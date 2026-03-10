import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual .env loader
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.VITE_GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("Error: Missing SUPABASE_URL, SUPABASE_KEY, or VITE_GEMINI_API_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

function cleanValue(val) {
  if (val === undefined || val === null || val === '') return null;
  return val;
}

async function syncCatalog() {
  const excelPath = path.join(__dirname, '../data/catalog.xlsx');
  console.log(`Reading catalog from Excel: ${excelPath}`);
  
  try {
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);
    
    // Wipe existing products & documents to ensure only spreadsheet items remain
    console.log("  Clearing old relational and vector data...");
    await supabase.from('documents').delete().eq('metadata->>source', 'Excel_Catalog');
    const { error: clearError } = await supabase.from('products').delete().neq('sku', '');
    if (clearError) console.error("Warning: Error clearing products table:", clearError.message);

    let successCount = 0;

    for (const [index, row] of products.entries()) {
      try {
        const skuStr = String(row.sku);
        // Create metadata object from individual columns
        const metadata = {
          tag: cleanValue(row.tag || row.horizonte),
          owner: cleanValue(row.owner),
          squad: cleanValue(row.squad),
          revenue: cleanValue(row.revenue),
          bu: cleanValue(row.bu || row.category),
          mercado: cleanValue(row.mercado),
          horizonte: cleanValue(row.horizonte || row.tag),
          pricing: cleanValue(row.pricing),
          enxoval_link: cleanValue(row.enxoval_link),
          // Deep dive data
          problem: cleanValue(row.problem),
          useCases: row.use_cases ? row.use_cases.split(',').map(i => i.trim()) : [],
          solutions: row.technical_solution ? row.technical_solution.split(',').map(i => i.trim()) : [],
          tech: row.tech_stack ? row.tech_stack.split(',').map(i => i.trim()) : []
        };

        const payload = {
          sku: skuStr,
          name: String(row.name),
          description: cleanValue(row.description),
          category: cleanValue(row.category || row.bu),
          price: row.price ? Number(row.price) : null,
          stock_status: cleanValue(row.stock_status) || 'in_stock',
          metadata: metadata
        };

        // 1. Sync to Products Table
        const { error: dbError } = await supabase.from('products').upsert(payload, { onConflict: 'sku' });
        if (dbError) throw dbError;

        // 2. Generate RAG Context & Embedding
        const ragContext = `
PRODUTO: ${payload.name}
SKU: ${payload.sku}
CATEGORIA: ${payload.category}
HORIZONTE: ${metadata.tag}
DESCRIÇÃO: ${payload.description}
PROBLEMA: ${metadata.problem}
CASOS DE USO: ${metadata.useCases.join(', ')}
SOLUÇÃO TÉCNICA: ${metadata.solutions.join(', ')}
TECNOLOGIAS: ${metadata.tech.join(', ')}
RESPONSÁVEL: ${metadata.owner}
SQUAD: ${metadata.squad}
        `.trim();

        const result = await embedModel.embedContent(ragContext);
        const embedding = result.embedding.values;

        // 3. Sync to Documents Table (Vector Store)
        const { error: vecError } = await supabase.from('documents').insert({
            content: ragContext,
            metadata: { source: 'Excel_Catalog', sku: payload.sku },
            embedding: embedding
        });

        if (vecError) throw vecError;
        
        successCount++;
        console.log(`  ✅ Synced & Embedded: ${payload.sku}`);
      } catch (err) {
        console.error(`  Error syncing row ${index} (SKU: ${row.sku}):`, err.message);
      }
    }
    
    console.log(`Catalog sync complete! Successfully processed ${successCount} items.`);
  } catch (err) {
    console.error("Error reading excel file:", err.message);
  }
}

syncCatalog();

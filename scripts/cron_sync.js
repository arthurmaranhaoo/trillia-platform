import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.VITE_GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("Error: Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

function cleanValue(val) {
  if (val === undefined || val === null || val === '') return null;
  return String(val);
}

async function performSync() {
  const excelPath = path.join(__dirname, '../data/catalog.xlsx');
  
  try {
    console.log(`[${new Date().toISOString()}] Reading catalog from Excel: ${excelPath}`);
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);

    console.log(`Found ${products.length} products in Excel. Cleaning old data...`);

    // 1. Wipe old data to ensure spreadsheet is absolute source of truth
    // Wiping everything in documents linked to catalog
    await supabase.from('documents').delete().eq('metadata->>source', 'Excel_Catalog');
    
    // Wiping all products to prevent "stuck" generic items
    const { error: clearError } = await supabase.from('products').delete().neq('sku', '___NON_EXISTENT___');
    if (clearError) {
      console.warn("  Warning during cleanup:", clearError.message);
    }

    let successCount = 0;

    for (const [index, row] of products.entries()) {
      try {
        const payload = {
          sku: cleanValue(row.sku),
          name: cleanValue(row.name),
          description: cleanValue(row.description),
          category: cleanValue(row.category),
          price: row.price ? Number(row.price) : null,
          stock_status: cleanValue(row.stock_status),
        };

        // 0. Build Metadata Object from individual columns or metadata column
        let metadataObj = {};
        
        // If there's a JSON metadata column, use it as base
        if (row.metadata) {
          try {
            metadataObj = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
          } catch (e) {
            console.warn(`  Warning: Could not parse metadata column for SKU ${row.sku}`);
          }
        }

        // Helper to add column to metadata if present
        const addToMetadata = (col, targetKey, isArray = false) => {
          if (row[col] !== undefined && row[col] !== null && row[col] !== '') {
            if (isArray) {
              metadataObj[targetKey] = String(row[col]).split(',').map(s => s.trim());
            } else {
              metadataObj[targetKey] = cleanValue(row[col]);
            }
          }
        };

        // Map individual columns to metadata
        addToMetadata('tag', 'tag');
        addToMetadata('horizonte', 'horizonte');
        addToMetadata('bu', 'bu');
        addToMetadata('squad', 'squad');
        addToMetadata('owner', 'owner');
        addToMetadata('mercado', 'mercado');
        addToMetadata('revenue', 'revenue');
        addToMetadata('pricing', 'pricing');
        addToMetadata('problem', 'problem');
        addToMetadata('use_cases', 'useCases', true);
        addToMetadata('solutions', 'solutions', true);
        addToMetadata('tech', 'tech', true);

        payload.metadata = metadataObj;

        // 1. Upsert Relational Data (Products Table)
        const { error: dbError } = await supabase.from('products').upsert(payload, { onConflict: 'sku' });
        if (dbError) throw dbError;

        // 2. Generate Context Embedding for RAG (Documents Table)
        const problemText = metadataObj.problem || payload.description || 'Problema principal';
        const pricingText = metadataObj.pricing || (payload.price ? `R$ ${payload.price}` : 'Sob Consulta');
        
        const ragContext = `
PRODUTO: ${payload.name}
SKU: ${payload.sku}
CATEGORIA: ${payload.category}
DESCRIÇÃO: ${payload.description}
O PROBLEMA QUE RESOLVE: ${problemText}
PREÇO: ${pricingText}
        `.trim();

        const result = await embedModel.embedContent(ragContext);
        const embedding = result.embedding.values;

        const { error: vecError } = await supabase.from('documents').insert({
            content: ragContext,
            metadata: { source: 'Excel_Catalog', sku: payload.sku },
            embedding: embedding
        });

        if (vecError) throw vecError;
        
        successCount++;
      } catch (err) {
        console.error(`  Error syncing row ${index} (SKU: ${row.sku}):`, err.message);
      }
    }
    
    console.log(`[${new Date().toISOString()}] Sync complete! Successfully synchronized ${successCount} products.`);
    console.log("Aguardando 24 horas até a próxima sincronização programada...");
  } catch (err) {
    console.error("Error during sync process:", err.message);
  }
}

// Run immediately, then every 24 hours (86,400,000 ms)
performSync();
setInterval(performSync, 24 * 60 * 60 * 1000);

import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

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
  console.log(`[${new Date().toISOString()}] Reading catalog from Excel: ${excelPath}`);
  
  try {
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Found ${products.length} products in Excel. Syncing to Supabase DB & Vector Store...`);
    
    // Clear old vectors linked to the spreadsheet so we don't have dupes after re-embedding
    await supabase.from('documents').delete().eq('metadata->>source', 'Excel_Catalog');

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

        let metadataObj = {};
        if (row.metadata) {
          try {
            metadataObj = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
            payload.metadata = metadataObj;
          } catch (e) {
            payload.metadata = { raw: cleanValue(row.metadata) };
          }
        }

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
    console.log("Waiting 5 minutes until next sync...");
  } catch (err) {
    console.error("Error reading excel file:", err.message);
  }
}

// Run immediately, then every 5 minutes (300,000 ms)
performSync();
setInterval(performSync, 5 * 60 * 1000);

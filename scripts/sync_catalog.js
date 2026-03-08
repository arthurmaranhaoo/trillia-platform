import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    console.log(`Found ${products.length} products. Syncing with Supabase...`);
    let successCount = 0;

    for (const [index, row] of products.entries()) {
      try {
        const payload = {
          sku: String(row.sku),
          name: String(row.name),
          description: cleanValue(row.description),
          category: cleanValue(row.category),
          price: row.price ? Number(row.price) : null,
          stock_status: cleanValue(row.stock_status),
        };

        if (row.metadata) {
          try {
            payload.metadata = JSON.parse(row.metadata);
          } catch (e) {
            payload.metadata = { raw: String(row.metadata) };
          }
        }

        const { error } = await supabase
          .from('products')
          .upsert(payload, { onConflict: 'sku' });

        if (error) throw error;
        
        successCount++;
        console.log(`  Synced: ${row.sku} - ${row.name}`);
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

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

async function downloadCatalogToExcel() {
  console.log("Fetching 50 products from Supabase to write to Excel...");
  
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
     console.error("Error fetching from Supabase:", error);
     return;
  }

  // Map to flat structure for Excel
  const flatProducts = products.map(p => ({
     sku: p.sku,
     name: p.name,
     description: p.description,
     category: p.category,
     price: p.price,
     stock_status: p.stock_status,
     metadata: JSON.stringify(p.metadata) // Flatten JSON for the spreadsheet cell
  }));

  const worksheet = xlsx.utils.json_to_sheet(flatProducts);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Catalog");
  
  const excelPath = path.join(__dirname, '../data/catalog.xlsx');
  xlsx.writeFile(workbook, excelPath);
  
  console.log(`Saved ${flatProducts.length} rows to ${excelPath}`);
}

downloadCatalogToExcel();

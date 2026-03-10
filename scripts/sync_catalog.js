import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

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

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing SUPABASE_URL or SUPABASE_KEY environment variables.");
  console.log("Environment detected:", { 
    supabaseUrl: supabaseUrl ? 'Set' : 'Missing', 
    supabaseKey: supabaseKey ? 'Set' : 'Missing' 
  });
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
          sku: String(row.sku),
          name: String(row.name),
          description: cleanValue(row.description),
          category: cleanValue(row.category || row.bu),
          price: row.price ? Number(row.price) : null,
          stock_status: cleanValue(row.stock_status) || 'in_stock',
          metadata: metadata
        };

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

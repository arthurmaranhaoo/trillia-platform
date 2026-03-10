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

async function syncAll() {
  console.log("🚀 Starting Full Sync (Catalog + Site Content)...");

  // 1. Wipe everything to avoid duplicates
  console.log("  🧹 Clearing old data...");
  await supabase.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('sku', '');

  // --- PART A: SYNC CATALOG ---
  const excelPath = path.join(__dirname, '../data/catalog.xlsx');
  try {
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);
    
    for (const [index, row] of products.entries()) {
      const skuStr = String(row.sku);
      const metadata = {
        tag: cleanValue(row.tag || row.horizonte),
        owner: cleanValue(row.owner),
        owner_email: cleanValue(row.owner_email),
        squad: cleanValue(row.squad),
        revenue: cleanValue(row.revenue),
        bu: cleanValue(row.bu || row.category),
        mercado: cleanValue(row.mercado),
        horizonte: cleanValue(row.horizonte || row.tag),
        pricing: cleanValue(row.pricing),
        problem: cleanValue(row.problem),
        enxoval_link: cleanValue(row.enxoval_link),
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
        stock_status: 'in_stock',
        metadata: metadata
      };

      await supabase.from('products').upsert(payload, { onConflict: 'sku' });

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
      `.trim();

      const result = await embedModel.embedContent(ragContext);
      await supabase.from('documents').insert({
          content: ragContext,
          metadata: { source: 'Excel_Catalog', sku: payload.sku },
          embedding: result.embedding.values
      });
      console.log(`  ✅ Catalog: ${payload.sku}`);
    }
  } catch (err) {
    console.error("  ❌ Catalog error:", err.message);
  }

  // --- PART B: INDEX SITE CONTENT ---
  console.log("  🌐 Indexing Site Content (App.tsx)...");
  const appPath = path.join(__dirname, '../src/App.tsx');
  try {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    // Extracting stages using regex to avoid icon reference errors
    const stagePattern = /\{\s*id:\s*'([\d.]+)'[\s\S]*?title:\s*'([\s\S]*?)'[\s\S]*?definition:\s*'([\s\S]*?)'[\s\S]*?entrada:\s*'([\s\S]*?)'[\s\S]*?saida:\s*'([\s\S]*?)'[\s\S]*?artefatos:\s*(\[[\s\S]*?\])/g;
    
    let match;
    while ((match = stagePattern.exec(appContent)) !== null) {
      const [_, id, title, definition, entrada, saida, artefatosRaw] = match;
      const artefatos = artefatosRaw.replace(/[\[\]']/g, '').split(',').map(s => s.trim()).join(', ');
      
      const ragContext = `
SITE_INFO: Metodologia Trillia - Fase ${id}
TÍTULO: ${title}
DEFINIÇÃO: ${definition}
PORTÃO ENTRADA: ${entrada}
PORTÃO SAÍDA: ${saida}
ARTEFATOS: ${artefatos}
      `.trim();

      const result = await embedModel.embedContent(ragContext);
      await supabase.from('documents').insert({
          content: ragContext,
          metadata: { source: 'Site_Content', area: `Fase ${id}`, type: 'Metodologia' },
          embedding: result.embedding.values
      });
      console.log(`  ✅ Indexed Methodology: Fase ${id}`);
    }

    // Index general intro
    const introMatch = appContent.match(/Explorar, aprender e criar[\s\S]*?<p class="text-ink\/60 text-lg leading-relaxed">([\s\S]*?)<\/p>/);
    if (introMatch) {
      const text = introMatch[1].replace(/<[^>]*>/g, '').trim();
      const ragContext = `SITE_INFO: Visão Geral Trillia\nCONTEÚDO: ${text}`;
      const result = await embedModel.embedContent(ragContext);
      await supabase.from('documents').insert({
          content: ragContext,
          metadata: { source: 'Site_Content', area: 'Intro' },
          embedding: result.embedding.values
      });
      console.log("  ✅ Indexed Site Intro");
    }

  } catch (err) {
    console.error("  ❌ Site content error:", err.message);
  }

  console.log("🏁 Full Sync Complete!");
}

syncAll();

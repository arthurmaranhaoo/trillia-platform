/**
 * sync_now.cjs
 * Sincroniza o catálogo do Excel para o Supabase (Relacional + RAG/Vetores)
 * e encerra o processo após concluir.
 */

const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.VITE_GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("❌ Erro: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY e VITE_GEMINI_API_KEY são obrigatórios.");
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
    console.log(`🚀 Iniciando sincronização do catálogo: ${excelPath}`);
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);

    console.log(`📦 Encontrados ${products.length} itens no Excel. Limpando dados antigos...`);

    // 1. Limpeza Atômica (Wipe Sync)
    await supabase.from('documents').delete().eq('metadata->>source', 'Excel_Catalog');
    await supabase.from('products').delete().neq('sku', '___NONE___');

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
          metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : {}
        };

        // 2. Atualiza Banco Relacional
        const { error: dbError } = await supabase.from('products').upsert(payload);
        if (dbError) throw dbError;

        // 3. Gera Contexto e Embeddings para RAG
        const ragContext = `
PRODUTO: ${payload.name}
SKU: ${payload.sku}
CATEGORIA: ${payload.category}
DESCRIÇÃO: ${payload.description}
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
        process.stdout.write('.'); // Progresso visual
      } catch (err) {
        console.error(`\n❌ Erro no SKU ${row.sku}:`, err.message);
      }
    }
    
    console.log(`\n\n✨ Sincronização Finalizada! ${successCount} produtos prontos no Bruce Assistente.`);
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Erro crítico no processo:", err.message);
    process.exit(1);
  }
}

performSync();

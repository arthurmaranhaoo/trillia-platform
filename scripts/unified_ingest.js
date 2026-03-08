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
  return val;
}

// Simple generation loop to create 50 distinct mock products in memory
function generate50Products() {
  const products = [];
  const categories = ['S&M e Inteligência de Mercado', 'Loss Prevention', 'Crédito e Cobrança', 'Cotação e Subscrição', 'Negócios e Infraestrutura', 'Capital Markets'];
  const squads = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta'];
  
  for (let i = 1; i <= 50; i++) {
    const horizon = i % 3 === 0 ? 'H3' : (i % 2 === 0 ? 'H2' : 'H1');
    const category = categories[i % categories.length];
    
    // We add deep contextual text so Bruce has "meat" to RAG
    const description = `Este é o Produto Mágico ${i}, focado em resolver problemas críticos de ${category}. Ele aumenta a eficiência em 30% e reduz custos operacionais. Ideal para clientes corporativos de grande porte que precisam escalar suas operações no horizonte ${horizon}.`;
    
    const problem = `As empresas atualmente perdem muito tempo com processos manuais na área de ${category}. O Produto ${i} entra para automatizar isso completamente.`;
    
    // Create the rich metadata context that RAG will embed
    const ragContext = `
PRODUTO: Produto Mágico ${i}
SKU: PROD-0${i}
CATEGORIA: ${category}
HORIZONTE: ${horizon}
DESCRIÇÃO: ${description}
O PROBLEMA QUE RESOLVE: ${problem}
CASOS DE USO: Automatização, Redução de Custo, Escalabilidade B2B
PREÇO: R$ ${Math.floor(Math.random() * 10000) + 1000},00
SQUAD RESPONSÁVEL: ${squads[i % squads.length]}
    `;

    products.push({
      sku: `PROD-0${i}`,
      name: `Produto Mágico ${i} - ${category}`,
      description: description,
      category: category,
      price: Math.floor(Math.random() * 10000) + 1000,
      stock_status: 'in_stock',
      rag_context: ragContext.trim(), // We'll embed this string for RAG
      metadata: {
        tag: horizon,
        owner: `Diretor ${i}`,
        squad: squads[i % squads.length],
        revenue: `R$ ${Math.floor(Math.random() * 5)}M ARR`,
        bu: category,
        mercado: 'B2B',
        horizonte: horizon,
        pricing: `SaaS - R$ ${Math.floor(Math.random() * 5000) + 500}/mês`,
        problem: problem,
        useCases: ['Automatização', 'Monitoramento Definitivo', 'Integrações robustas API'],
        solutions: ['Arquitetura escalável', 'Machine Learning embarcado'],
        tech: ['TypeScript', 'Supabase', 'Gemini']
      }
    });
  }
  return products;
}

async function syncAndEmbedAll() {
  const products = generate50Products();
  console.log(`Generated ${products.length} products. Starting unified Sync & Embed...`);

  // Clear existing vector DB rows to avoid dupes of old mock data
  console.log("Cleaning up old vector data...");
  const { error: delError } = await supabase.from('documents').delete().neq('id', 0);
  if (delError) console.error("Error wiping old docs:", delError.message);

  let successCount = 0;

  for (const [index, p] of products.entries()) {
    try {
      // 1. SYNC TO CATALOG (products table)
      const payload = {
        sku: p.sku,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        stock_status: p.stock_status,
        metadata: p.metadata
      };

      const { error: dbError } = await supabase.from('products').upsert(payload, { onConflict: 'sku' });
      if (dbError) throw dbError;

      // 2. GENERATE EMBEDDING FOR RAG (documents table)
      console.log(`  Embedding RAG context for ${p.sku}...`);
      const result = await embedModel.embedContent(p.rag_context);
      const embedding = result.embedding.values;

      const { error: vecError } = await supabase.from('documents').insert({
          content: p.rag_context,
          metadata: { source: 'Unified50_Script', sku: p.sku },
          embedding: embedding
      });

      if (vecError) throw vecError;
      
      successCount++;
      console.log(`✅ Synced & Embedded: ${p.sku}`);
    } catch (err) {
      console.error(`❌ Error on index ${index} (${p.sku}):`, err.message);
    }
  }
  
  console.log(`\n🎉 Process Complete! Successfully populated Catalog & Vector Store with ${successCount} items.`);
}

syncAndEmbedAll();

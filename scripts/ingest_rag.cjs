/**
 * ingest_rag.cjs
 * Processa arquivos TXT, PDF e PPTX na pasta data/docs e gera embeddings para o RAG.
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const officeParser = require('officeparser');
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

function chunkText(text, chunkSize = 1500, overlap = 150) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = start + chunkSize;
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }
    return chunks;
}

async function extractText(filepath) {
    const ext = path.extname(filepath).toLowerCase();
    
    if (ext === '.txt') {
        return fs.readFileSync(filepath, 'utf8');
    }
    
    if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filepath);
        const data = await pdf(dataBuffer);
        return data.text;
    }
    
    if (ext === '.pptx' || ext === '.docx' || ext === '.xlsx') {
        return new Promise((resolve, reject) => {
            officeParser.parseOffice(filepath, (data, err) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    }
    
    return null;
}

async function processFile(filepath) {
    const filename = path.basename(filepath);
    console.log(`🔍 Processando: ${filename}...`);
    
    try {
        const text = await extractText(filepath);
        if (!text) {
            console.log(`⚠️ Formato não suportado: ${filename}`);
            return;
        }

        const chunks = chunkText(text);
        console.log(`📄 Dividido em ${chunks.length} partes.`);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (!chunk.trim()) continue;

            const { data: existing } = await supabase
                .from('documents')
                .select('id')
                .eq('metadata->>source', filename)
                .eq('metadata->>chunk_index', String(i))
                .limit(1);

            if (existing && existing.length > 0) {
                // Já indexado (simplificação: pula se já existe)
                continue;
            }

            const result = await embedModel.embedContent(chunk);
            const embedding = result.embedding.values;

            const { error } = await supabase.from('documents').insert({
                content: chunk,
                metadata: { source: filename, chunk_index: String(i), file_type: path.extname(filename) },
                embedding: embedding
            });

            if (error) console.error(`❌ Erro ao inserir parte ${i}:`, error.message);
        }
        console.log(`✅ ${filename} indexado com sucesso.`);
    } catch (err) {
        console.error(`❌ Erro ao ler arquivo ${filepath}:`, err.message);
    }
}

async function main() {
    const docsDir = path.join(__dirname, '../data/docs');
    if (!fs.existsSync(docsDir)) {
        console.error(`❌ Pasta não encontrada: ${docsDir}`);
        return;
    }

    const files = fs.readdirSync(docsDir);
    const supported = ['.txt', '.pdf', '.pptx', '.docx'];

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (supported.includes(ext)) {
            const filepath = path.join(docsDir, file);
            await processFile(filepath);
        }
    }
}

if (require.main === module) {
    main().then(() => {
        console.log("✨ Processamento de RAG finalizado.");
    });
}

module.exports = { main };

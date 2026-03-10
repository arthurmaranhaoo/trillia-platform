import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import officeparser from 'officeparser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

function chunkText(text, chunkSize = 1000, overlap = 100) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }
  return chunks;
}

async function processFile(filepath) {
  console.log(`Processing ${filepath}...`);
  const filename = path.basename(filepath);
  const ext = path.extname(filepath).toLowerCase();
  
  try {
    let text = '';
    
    if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filepath);
        const data = await pdfParse(dataBuffer);
        text = data.text;
    } else if (ext === '.pptx' || ext === '.docx') {
        const raw = await officeparser.parseOffice(filepath);
        text = raw.toText ? raw.toText() : String(raw);
    } else if (ext === '.txt' || ext === '.md' || ext === '.csv') {
        text = fs.readFileSync(filepath, 'utf8');
    } else {
        console.log(`  Skipping unsupported file type: ${ext}`);
        return;
    }

    const chunks = chunkText(text);

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (!chunk.trim()) continue;

        console.log(`  Embedding chunk ${i + 1}/${chunks.length}...`);
        
        try {
            const result = await model.embedContent(chunk);
            const embedding = result.embedding.values;

            const { error } = await supabase.from('documents').insert({
                content: chunk,
                metadata: { source: filename, chunk_index: i },
                embedding: embedding
            });

            if (error) {
                console.error(`  Error inserting chunk ${i}:`, error.message);
            }
        } catch (embedError) {
             console.error(`  Error generating embedding for chunk ${i}:`, embedError.message);
        }
    }
  } catch (err) {
      console.error(`Error reading file ${filepath}:`, err.message);
  }
}

async function main() {
  const docsDir = path.join(__dirname, '../data/docs');
  if (!fs.existsSync(docsDir)) {
    console.error(`Directory not found: ${docsDir}`);
    return;
  }

  console.log("Connecting to Supabase and processing documents...");
  const files = fs.readdirSync(docsDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const validExts = ['.txt', '.md', '.csv', '.pdf', '.pptx', '.docx'];
    if (validExts.includes(ext)) {
      const filepath = path.join(docsDir, file);
      await processFile(filepath);
    }
  }
  
  console.log("Document ingestion complete!");
}

main();

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

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
  
  try {
    const text = fs.readFileSync(filepath, 'utf8');
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
    if (file.endsWith('.txt')) {
      const filepath = path.join(docsDir, file);
      await processFile(filepath);
    }
  }
  
  console.log("Document ingestion complete!");
}

main();

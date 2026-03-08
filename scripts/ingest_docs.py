import os
import json
import httpx
from supabase import create_client, Client

# Environment Variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or not GEMINI_API_KEY:
    print("Error: Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY environment variables.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_gemini_embedding(text):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={GEMINI_API_KEY}"
    headers = {'Content-Type': 'application/json'}
    data = {
        "model": "models/text-embedding-004",
        "content": {
            "parts": [{
                "text": text
            }]
        }
    }
    
    response = httpx.post(url, headers=headers, json=data, timeout=30.0)
    response.raise_for_status()
    result = response.json()
    return result['embedding']['values']

def chunk_text(text, chunk_size=1000, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def process_file(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        
    filename = os.path.basename(filepath)
    chunks = chunk_text(text)
    
    for i, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
            
        print(f"  Embedding chunk {i + 1}/{len(chunks)}...")
        try:
            embedding = get_gemini_embedding(chunk)
            
            # Store in Supabase
            data, count = supabase.table('documents').insert({
                "content": chunk,
                "metadata": {"source": filename, "chunk_index": i},
                "embedding": embedding
            }).execute()
            
        except Exception as e:
            print(f"  Error processing chunk {i}: {e}")

def main():
    docs_dir = "../data/docs"
    if not os.path.exists(docs_dir):
        print(f"Directory not found: {docs_dir}")
        return
        
    print("Connecting to Supabase and processing documents...")
    for filename in os.listdir(docs_dir):
        if filename.endswith(".txt"):
            filepath = os.path.join(docs_dir, filename)
            process_file(filepath)
            
    print("Document ingestion complete!")

if __name__ == "__main__":
    main()

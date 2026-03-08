-- Update the documents table to support 3072 dimensions (required by gemini-embedding-001)
ALTER TABLE documents ALTER COLUMN embedding TYPE vector(3072);

-- Drop the old matching function
DROP FUNCTION IF EXISTS match_documents;

-- Create the new matching function with the correct dimensions
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
RETURNS table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
$$;

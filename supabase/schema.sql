-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the products table for the catalog (synced from Excel)
create table if not exists products (
    id uuid default gen_random_uuid() primary key,
    sku text unique not null,
    name text not null,
    description text,
    category text,
    price numeric(10, 2),
    stock_status text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the documents table for the vector store
create table if not exists documents (
    id bigserial primary key,
    content text not null, -- The actual text chunk
    metadata jsonb, -- To store source file name, page number, etc.
    embedding vector(768) -- Gemini 3.0 Flash uses 768 dimensions for text-embedding-004
);

-- Create a function to similarity search for documents
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;

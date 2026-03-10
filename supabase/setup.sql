-- SCRIPT DE SETUP SUPABASE - TRILLIA PLATFORM
-- Execute este script no SQL Editor do seu Supabase para criar as tabelas necessárias.

-- 1. Habilitar a extensão de vetores (necessária para o Bruce Assistente/RAG)
create extension if not exists vector;

-- 2. Tabela de Produtos (Catálogo Relacional)
create table if not exists products (
    sku text primary key,
    name text not null,
    description text,
    category text,
    price numeric(10, 2),
    stock_status text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Documentos (Base de Conhecimento RAG / Vetores)
create table if not exists documents (
    id bigint generated desktop default as identity primary key,
    content text not null,
    metadata jsonb default '{}'::jsonb,
    embedding vector(768) -- Dimensão padrão para o modelo gemini-embedding-001
);

-- 4. Tabela de Feedbacks (Laboratório de Feedbacks)
create table if not exists feedbacks (
    id bigint generated always as identity primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    nome text not null,
    email text not null,
    categoria text not null,
    mensagem text not null
);

-- 5. Função de Busca para RAG (Permite ao Bruce buscar produtos por similaridade)
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
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;

-- 6. Habilitar RLS e Definir Políticas de Segurança
alter table products enable row level security;
alter table documents enable row level security;
alter table feedbacks enable row level security;

-- Políticas para PRODUTOS (Público pode ver, apenas admin pode editar)
create policy "Produtos visíveis para todos" on products for select using (true);
create policy "Apenas admins editam produtos" on products for all using (auth.role() = 'service_role');

-- Políticas para DOCUMENTOS/RAG (Público pode ver, apenas admin pode editar)
create policy "Documentos visíveis para todos" on documents for select using (true);
create policy "Apenas admins editam documentos" on documents for all using (auth.role() = 'service_role');

-- Políticas para FEEDBACKS (Público pode enviar, ninguém visualiza publicamente)
create policy "Qualquer um pode enviar feedback" on feedbacks for insert with check (true);
create policy "Apenas admins visualizam feedbacks" on feedbacks for select using (auth.role() = 'service_role');

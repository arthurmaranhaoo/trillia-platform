# Arquitetura Tecnica - Trillia Platform & Bruce Assistente

Este documento detalha o ecossistema tecnológico, as escolhas de engenharia e os modelos de IA que compõem a plataforma Trillia.

## Visual de Arquitetura

### Fluxo Geral do Sistema
```mermaid
graph TD
    User((Usuário))
    
    subgraph "Frontend (React 19 + Vite)"
        UI[Interface Bruce Assistente]
        Form[Laboratório de Feedback]
    end
    
    subgraph "Fontes de Dados (Local)"
        Excel[(Catalog.xlsx)]
        DocsDir[[Pasta data/docs]]
    end
    
    subgraph "Processamento (Node.cjs)"
        Sync[Scripts de Sincronização]
        Cron[Cron Jobs Automáticos]
    end
    
    subgraph "Inteligência & Backend"
        Supa[(Supabase PG + Vector)]
        Gemini[[Google Gemini API]]
    end

    User --> UI
    User --> Form
    Form --> Supa
    
    Excel --> Sync
    DocsDir --> Sync
    Sync --> Gemini
    Gemini --> Supa
    Cron --> Sync
    
    UI <--> Gemini
    Gemini <--> Supa
```

### Fluxo de RAG (Busca Inteligente)
```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant G as Gemini API
    participant S as Supabase (Vector Store)

    U->>F: Faz uma pergunta ("Qual o preço do X?")
    F->>G: Gera Embedding da Pergunta
    G->>S: Busca Vetorial (Similarity Search)
    S-->>G: Retorna Contexto (Produtos/Docs)
    G->>G: Gera Resposta com Contexto
    G-->>F: Resposta Formatada
    F-->>U: Exibe Resposta do Bruce
```

---

## 1. Engenharia de Software (Frontend & Core)

A plataforma foi construída seguindo princípios de **Modern Web Performance** e **Visual Experience (UX/UI)**.

- **Framework**: [React 19](https://react.dev/) (Vite) para uma renderização ultrarrápida e modular.
- **Linguagem**: TypeScript para garantir tipagem forte e segurança de código.
- **Estilização**: Sistema híbrido utilizando **Vanilla CSS + Modern Tokens**. Foco em **Glassmorphism**, contrastes profundos e estética Premium.
- **Animações**: [Framer Motion (motion/react)](https://www.framer.com/motion/) para micro-interações fluidas e transições de estado (Modais, Listas, Cards).
- **Icons**: [Lucide React](https://lucide.dev/) para uma biblioteca vetorial consistente.

---

## 2. Inteligência Artificial Generativa (Bruce Assistente)

O "cérebro" da plataforma utiliza o estado da arte em Large Language Models (LLMs) do Google.

- **Modelo de Chat**: **Gemini 2.5 Flash**. Escolhido pelo equilíbrio perfeito entre baixa latência e raciocínio complexo.
- **Capacidades**:
    - Reconhecimento de intenção (Intent Recognition).
    - Formatação de respostas em Markdown.
    - Personalidade amigável e técnica ("Assistente de Curadoria").
- **Embeddings**: Modelo `gemini-embedding-001` para transformar textos técnicos da planilha e de documentos (PDF, PPTX, TXT) em vetores matemáticos de alta dimensão.

---

## 3. Estrategia de Dados & RAG

Utilizamos **RAG (Retrieval-Augmented Generation)** para garantir que o Bruce nunca invente informações (alucinação).

- **Busca Vetorial**: Integra dados da planilha de produtos e de documentos externos.
- **Formatos Suportados**: Além do Excel, o Bruce "lê" arquivos `.pdf`, `.pptx`, `.docx` e `.txt`.
- **Processo RAG**:
    1. O usuário faz uma pergunta.
    2. O sistema gera um embedding da pergunta.
    3. Fazemos uma busca vetorial no Supabase para encontrar os produtos ou documentos mais relevantes.
    4. Enviamos esse contexto para o Gemini gerar a resposta precisa.

---

## 4. Banco de Dados e Backend (Supabase)

Utilizamos o **Supabase** como plataforma de backend as a service, provendo:

- **Relacional**: PostgreSQL para armazenar os produtos estruturados e o log de feedbacks.
- **Vetorial**: Extensão `pgvector` para armazenar os embeddings do catálogo.
- **Feedback Loop**: Tabela `feedbacks` projetada para escalabilidade, permitindo captura instantânea de sugestões do Laboratório.

---

## 5. Ecossistema de Integracao (Single Source of Truth)

O projeto inova ao utilizar o **Excel como fonte primária de verdade**, facilitando a gestão por pessoas não-técnicas.

- **Sincronização**: Scripts customizados em Node.js que:
    - Limpam dados antigos (Wipe Sync).
    - Processam e limpam dados do Excel (`xlsx`).
    - Geram novos embeddings via Google AI API.
    - Atualizam o Supabase de forma atômica.
- **Cron Jobs**: Sistema de sincronização agendada para manter o Bruce sempre atualizado com o `catalog.xlsx`.

---

## 6. Stack Tecnologica (Ferramentas)

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | React, Vite, Framer Motion, Lucide |
| **IA Chat** | Google Gemini 2.5 Flash |
| **IA Vector** | Google Gemini Embeddings |
| **Database** | Supabase (PostgreSQL + pgvector) |
| **Scripts** | Node.js (CommonJS & ESM) |
| **Data Format** | Excel (.xlsx), CSV, JSON |
| **Deployment** | Git / GitHub Versioning |

---
**Arquitetura desenhada para: Escalabilidade, Precisao de Dados e Experiencia de Usuario de Elite.**

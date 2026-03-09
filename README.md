# Trillia Platform - Bruce Assistente 🚀

Bem-vindo ao repositório do Trillia Platform, integrando o **Bruce Assistente** com inteligência artificial e um ecossistema de dados automatizado.

---

## 🛠️ Configuração e Execução

Para rodar o projeto localmente em qualquer máquina:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```
2.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) com as seguintes chaves:
    *   `VITE_GEMINI_API_KEY`: Sua chave de API do Google Gemini.
    *   `VITE_SUPABASE_URL`: A URL do seu projeto Supabase.
    *   `VITE_SUPABASE_ANON_KEY`: A chave anon/public do seu Supabase.

3.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

---

## 📊 Ecossistema de Planilhas e Sincronização

O projeto utiliza um sistema de "Fonte Única de Verdade" baseada em Excel para garantir integridade dos dados.

### 1. Sincronização de Catálogo (RAG)
*   **Arquivo Fonte**: `data/catalog.xlsx`
*   **Como funciona**: O script de sincronização lê esta planilha e atualiza tanto o banco de dados relacional (Produtos) quanto o banco de vetores (Embeddings para o Bruce).
*   **Ação Manual**: Para forçar uma atualização imediata, rode:
    ```bash
    node scripts/sync_catalog.js
    ```
*   **Automação (Cron)**: O sistema de sincronização automática mantém os dados sempre frescos.

### 2. Laboratório de Feedbacks
*   **Fluxo**: O usuário envia uma sugestão no site -> Os dados caem no **Supabase** instantaneamente.
*   **Exportação para Excel**: Para transformar os feedbacks recebidos em uma planilha de análise, rode:
    ```bash
    node scripts/export_feedbacks.cjs
    ```
*   **Resultado**: O arquivo será gerado em `data/feedbacks_trillia.xlsx`.

---

## 🦾 Bruce Assistente

O assistente utiliza o modelo **Gemini 2.5 Flash** e técnica de **RAG (Retrieval-Augmented Generation)** para responder sobre os produtos do catálogo com precisão absoluta, baseando-se sempre na última versão da planilha de catálogo sincronizada.

---

## 🔐 Requisitos de Banco de Dados (Supabase)

Para o sistema de feedback funcionar, certifique-se de que a tabela `feedbacks` existe no seu Supabase com os campos:
`id`, `created_at`, `nome`, `email`, `categoria`, `mensagem`.

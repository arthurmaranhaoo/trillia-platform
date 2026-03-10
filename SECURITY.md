# Relatório de Segurança - Trillia Platform

Este documento detalha a análise de segurança da arquitetura atual e fornece recomendações críticas para tornar o projeto seguro para produção.

> [!WARNING]
> O estado atual do projeto é **Experimental/LAB**. Existem vulnerabilidades severas que impedem o uso seguro em ambiente público real sem as correções abaixo.

## 🔴 Vulnerabilidades Críticas

### 1. Exposição de Chaves de API (Gemini)
*   **Problema**: A chave `VITE_GEMINI_API_KEY` é carregada diretamente no frontend (React).
*   **Risco**: Qualquer usuário que visite o site pode extrair essa chave inspecionando o código ou o tráfego de rede. Eles podem usar sua cota e gerar cobranças na sua conta do Google AI.
*   **Impacto**: Alto (Financeiro e de Cota).

### 2. Banco de Dados Aberto (Supabase RLS)
*   **Problema**: O Row Level Security (RLS) está desabilitado no script `setup.sql` para as tabelas `products`, `documents` e `feedbacks`.
*   **Risco**: Usuários mal-intencionados podem usar a chave `anon` (que é pública no frontend) para deletar produtos, inserir documentos falsos no RAG ou apagar feedbacks.
*   **Impacto**: Crítico (Integridade dos Dados).

### 3. Injeção de Prompt (Bruce Assistente)
*   **Problema**: O assistente aceita entrada direta de texto do usuário sem camadas de sanitização pesadas antes de enviar para o LLM.
*   **Risco**: Usuários podem tentar manipular o comportamento do Bruce ("Esqueça suas instruções anteriores e...") para obter informações restritas ou forçar comportamentos indesejados.
*   **Impacto**: Médio (Reputacional).

## 🟢 Recomendações de Correção

| Vulnerabilidade | Solução Recomendada |
| :--- | :--- |
| **Chave de API** | Mover as chamadas do Gemini para **Supabase Edge Functions**. O frontend chamará a Função, e a Função usará a chave secreta de forma protegida no servidor. |
| **Supabase RLS** | Reabilitar o RLS e criar políticas: `SELECT` permitido para todos, `INSERT/UPDATE/DELETE` apenas para usuários autenticados ou via Service Role. |
| **Segurança RAG** | Implementar filtros de metadados na busca vetorial para garantir que o Bruce só acesse documentos públicos. |
| **Sanitização** | Adicionar um "Guardrail" (instruções de sistema mais rígidas) para prevenir injeções de prompt comuns. |

## 📅 Histórico de Preços (Março 2026)
Conforme solicitado, os custos de infraestrutura documentados nesta data são:
- **Gemini 2.5 Flash**: ~$0.075/1M tokens (Input) | ~$0.30/1M tokens (Output)
- **Gemini Embedding 001**: ~$0.15/1M tokens (Input)
- **Referência Oficial**: [Google AI Pricing](https://ai.google.dev/pricing)

---
**Nota**: Estas recomendações visam transformar o Trillia de um protótipo laboratorial em uma aplicação robusta e segura.

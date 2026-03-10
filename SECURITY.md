# Relatório de Segurança - Trillia Platform

Este documento detalha a análise de segurança da arquitetura atual e fornece recomendações críticas para tornar o projeto seguro para produção.

> [!WARNING]
> O estado atual do projeto é **Experimental/LAB**. Existem vulnerabilidades severas que impedem o uso seguro em ambiente público real sem as correções abaixo.

## 🛡️ Status de Implementação e Segurança

O projeto passou por um processo de **Security Hardening** e agora está preparado para uso em ambiente controlado.

### 🟢 Vulnerabilidades Resolvidas

| Vulnerabilidade | Status | Solução Implementada |
| :--- | :--- | :--- |
| **Exposição de Chaves de API** | **RESOLVIDO** | As chamadas ao Gemini (Chat e Embedding) agora passam por uma **Supabase Edge Function** (`chat-proxy`). Nenhuma chave ou lógica de IA fica exposta no navegador. |
| **Banco de Dados Aberto** | **RESOLVIDO** | O **Row Level Security (RLS)** foi habilitado para todas as tabelas. Implementamos políticas que permitem `SELECT` público apenas onde necessário, restringindo edições para o `service_role`. |
| **Injeção de Prompt** | **RESOLVIDO** | Implementamos uma camada de **Prompt Guard** (System Instructions rígidas) tanto no frontend quanto na Edge Function, bloqueando tentativas de desviar o Bruce de sua função. |
| **Privacidade de Feedback** | **RESOLVIDO** | Feedbacks agora são `insert-only` para o público; ninguém consegue ler o feedback de outros usuários sem permissão de admin. |

## 📅 Histórico de Preços & Referência (Março 2026)
- **Gemini 2.5 Flash**: ~$0.075/1M tokens (Input) | ~$0.30/1M tokens (Output)
- **Gemini Embedding 001**: ~$0.15/1M tokens (Input)
- **Referência Oficial**: [Google AI Pricing](https://ai.google.dev/pricing)

---
**Nota**: O monitoramento de logs via Supabase Dashboard deve ocorrer regularmente para detectar acessos anômalos.

## 📅 Histórico de Preços (Março 2026)
Conforme solicitado, os custos de infraestrutura documentados nesta data são:
- **Gemini 2.5 Flash**: ~$0.075/1M tokens (Input) | ~$0.30/1M tokens (Output)
- **Gemini Embedding 001**: ~$0.15/1M tokens (Input)
- **Referência Oficial**: [Google AI Pricing](https://ai.google.dev/pricing)

---
**Nota**: Estas recomendações visam transformar o Trillia de um protótipo laboratorial em uma aplicação robusta e segura.

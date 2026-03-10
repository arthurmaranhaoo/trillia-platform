# Relatório de Segurança e Governança - Trillia Platform

Este documento detalha o histórico de incidentes estruturais e as diretrizes de proteção do código para evitar regressões e garantir a estabilidade do sistema.

> [!WARNING]  
> A quebra da UI durante a inserção de metadados exigiu um Rollback crítico no repositório. O "Relatório de Segurança" original focado em chaves de API foi migrado para o `README.md`. Este documento agora serve como **Post-Mortem Técnico e Guia de Contenção de Riscos**.

## 🚦 Riscos Mapeados (Post-Mortem do Rollback)

Durante a fase de desenvolvimento da UI dos cartões de produto e a adição de novos campos no banco (como `owner_email` e `enxoval_link`), enfrentamos quebras estruturais no Frontend que exigiram a reversão de commits (`git revert` / rollback) do arquivo central `App.tsx`. 

Para evitar futuras quebras em cascata pelo time de engenharia, detalhamos abaixo os 4 riscos mitigados:

### 1. Destruição de Estado (Vazamento de Memória / React Hooks)
- **O Incidente:** Alterações massivas de refatoração no `App.tsx` apagaram ou dessincronizaram variáveis de estado cruciais (como o log `messages` do assistente da IA e o estado do modal `selectedProduct`).
- **A Solução/Diretriz:** Modificações na árvore de componentes principais exigem lifting state up (foi o que fizemos movendo os `messages` para o topo). Qualquer alteração no `handleSend` ou na interface externa deve ser puramente baseada em *Props*. Nunca force o desmonte (`unmount`) do componente do Bruce.

### 2. Sincronização Divergente (Frontend Cego)
- **O Incidente:** Atualizar a UI para exibir dados recém-criados que ainda não existiam no Supabase causou undefineds e travou o modal principal.
- **A Solução/Diretriz:** É estritamente proibido forçar a leitura de metadados (`item.metadata?.owner_email`) sem antes validar e rodar o pipeline de sincronização (`sync_all.js`). **O banco primeiro, a UI depois.**

### 3. Wipe Constraints no RAG (Deleção Acidental)
- **O Incidente Potencial:** Os scripts de reset no banco deletavam documentos de chat ou ingestões manuais na tabela `documents`.
- **A Solução/Diretriz:** O comando de Wipe Sync foi fortificado. Ele deve sempre focar **estritamente em registros gerados por máquina** através da tag `metadata->>source`. Alterar a instrução `DELETE FROM documents` no `sync_all.js` exige aprovação superior.

### 4. Estilização "Frankenstein" e Z-Index
- **O Incidente:** Misturar classes Tailwind novas de maneira precipitada na visualização de blocos quebrou a sobreposição (z-index), impedindo que o botão flutuante do Bruce abrisse ou que o modal fechasse usando a tecla ESC.
- **A Solução/Diretriz:** Os modais agora têm ouvintes de `keydown` globais (Escape) isolados por `useEffect`. O Grid de catálogos e a janela Glassmorphism do Bruce operam em camadas predefinidas. Testes de regressão visual na responsividade (Mobile/Desktop) são obrigatórios após mexer em qualquer container mestre.

---
**Status Atual**: Repositório estabilizado, pipelines blindados e `sync_all.js` automatizado. Nenhuma anomalia detectada atualmente.

import os

def generate_docs():
    docs_dir = "../data/docs"
    os.makedirs(docs_dir, exist_ok=True)
    
    # Document 1: Bruce Agent Manual (Technical Context)
    bruce_manual = """
# Bruce: Manual Técnico e Contexto Operacional

## 1. Visão Geral
O Bruce é a estrela da Trillia Platform. Ele não é apenas um chatbot, mas um **Agente Cognitivo Autônomo** focado no mercado B2B corporativo. Seu principal diferencial é a capacidade de realizar buscas semânticas (RAG) em bases de conhecimento privadas, superando a segurança e assertividade de LLMs públicos.

## 2. Precificação e Margens
- **Setup Inicial**: R$ 25.000,00 (Cobre implementação, fine-tuning e integração com até 3 bancos de dados legados do cliente).
- **Mensalidade (SaaS)**: R$ 4.500,00/mês.
- **Margem de Lucro Bruta**: Cerca de 78%. O principal custo da Trillia para manter o Bruce rodando são chamadas de API (LLM) e hospedagem de instâncias de Vector Database (como Supabase pgvector).

## 3. Perfil de Cliente Ideal (ICP)
- **Porte**: Empresas com faturamento acima de R$ 50M/ano.
- **Dores Atuais**: Processos manuais em backoffice (RH, Financeiro, Jurídico). Alta dependência de pessoas para responder perguntas baseadas em documentos internos (contratos, CLT, manuais de produtos).
- **Persona Compradora (Buyer Persona)**: Diretores de Inovação (CIOs/CTOs), Diretores de RH.

## 4. Análise de Concorrência
O principal concorrente do Bruce no mercado nacional é a plataforma 'ZetaCorp AI'. 
**Nossas Vantagens Competitivas**:
1. Implementação na Trillia leva 4 semanas, ZetaCorp leva 12.
2. A ZetaCorp usa bancos de dados relacionais tradicionais, a Trillia usa bancos vetoriais (Supabase) que garantem recuperação de contexto 3x mais rápida em Pdfs/Word/Textos longos.
3. Bruce possui persona adaptável: ele pode assumir tom formal, amigável ou técnico conforme a necessidade.
"""
    
    with open(os.path.join(docs_dir, "bruce_manual_estrategico.txt"), "w", encoding="utf-8") as f:
        f.write(bruce_manual)
    
    # Document 2: Sales Script & Objection Handling
    sales_script = """
# Roteiro de Vendas: Trillia Flow e Consultoria

## A Abordagem "Land and Expand" (Pousar e Expandir)
Muitos clientes têm medo de investir os R$ 25.000 do Bruce logo de cara. A estratégia da equipe de vendas deve ser:
1. **Entrar com o Trillia Flow**: É mais barato (R$ 5.000). Ajuda o cliente a integrar o ERP com o CRM.
2. **Vender a Consultoria (R$ 18.000)**: Uma vez que o Flow expõe a bagunça dos dados do cliente, a Trillia entra organizando a casa.
3. **O Up-sell final**: Com os dados organizados, vendemos o Bruce para consumir esses dados e gerar valor real.

## Matando Objeções Clássicas
- **"O ChatGPT faz isso de graça"**: Resposta: O ChatGPT treina com seus dados confidenciais. O Bruce roda em um ambiente privado e faz buscas focadas APENAS nos seus contratos e manuais. Seus dados nunca viram inteligência para a concorrência.
- **"É muito caro"**: Resposta: Quanto custam 5 analistas juniores lendo 3.000 páginas de contratos por mês buscando cláusulas rescisórias? O Bruce faz a mesma busca em 4 segundos, cobrando o equivalente a um estagiário.
"""
    
    with open(os.path.join(docs_dir, "roteiro_vendas_e_objecoes.txt"), "w", encoding="utf-8") as f:
        f.write(sales_script)
        
    print(f"Mock text documents generated successfully in {docs_dir}")

if __name__ == "__main__":
    generate_docs()

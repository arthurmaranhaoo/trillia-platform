import pandas as pd
import json

def generate_catalog():
    products = [
        {
            "sku": "AGENT-001",
            "name": "Bruce - O Assistente Cognitivo Corporativo",
            "description": "Uma inteligência artificial desenhada para automatizar tarefas complexas, analisar dados financeiros e interagir com clientes em tempo real. Bruce aprende com o contexto da sua empresa e se adapta aos fluxos de trabalho.",
            "category": "Software / AI Agents",
            "price": 25000.00,
            "stock_status": "in_stock",
            "metadata": json.dumps({
                "features": ["Integração RAG", "Visão Computacional", "Análise de Sentimentos"],
                "target_audience": "Empresas B2B (Médio e Grande Porte)",
                "implementation_time_weeks": 4
            })
        },
        {
            "sku": "AGENT-002",
            "name": "Trillia Flow",
            "description": "Plataforma de orquestração de APIs. Conecte dezenas de serviços sem escrever código. Ideal para operações de e-commerce e logística.",
            "category": "Software / SaaS",
            "price": 5000.00,
            "stock_status": "in_stock",
            "metadata": json.dumps({
                "features": ["Drag-and-Drop", "700+ Integrações", "Suporte 24/7"],
                "target_audience": "Startups e E-commerces",
                "implementation_time_weeks": 1
            })
        },
        {
            "sku": "CONSULT-100",
            "name": "Consultoria de Implantação de Dados",
            "description": "50 horas de consultoria sênior para mapeamento de dados, criação de Data Lakes e estruturação de pipelines para receber inteligência artificial.",
            "category": "Serviços",
            "price": 18000.00,
            "stock_status": "available",
            "metadata": json.dumps({
                "deliverables": ["Blueprint Arquitetônico", "Pipeline ETL Customizado"],
                "professionals": ["Engenheiro de Dados", "Cientista de Dados"]
            })
        }
    ]
    
    df = pd.DataFrame(products)
    output_path = "../data/catalog.xlsx"
    df.to_excel(output_path, index=False)
    print(f"Mock catalog generated successfully at {output_path}")

if __name__ == "__main__":
    generate_catalog()

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    { 
      sku: 'MIH-001',
      name: 'MARKET INTELLIGENCE HUB', 
      tag: 'H1', 
      category: 'S&M e Inteligência de Mercado', 
      description: 'Plataforma centralizada de insights de mercado e análise competitiva em tempo real.', 
      owner: 'Ana Silva', 
      squad: 'Alpha',
      revenue: 'R$ 1.2M ARR',
      bu: 'S&M e Inteligência de Mercado',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'SaaS - R$ 5.000/mês'
    },
    { 
      sku: 'PRO-002',
      name: 'PROSPECTOR PRO', 
      tag: 'H1', 
      category: 'S&M e Inteligência de Mercado', 
      description: 'Ferramenta de geração e qualificação de leads B2B com enriquecimento de dados.', 
      owner: 'Bruno Costa', 
      squad: 'Alpha',
      revenue: 'R$ 2.4M ARR',
      bu: 'S&M e Inteligência de Mercado',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'SaaS - R$ 8.500/mês'
    },
    { 
      sku: 'IDG-003',
      name: 'IDENTITY GUARD AI', 
      tag: 'H1', 
      category: 'Loss Prevention', 
      description: 'Sistema de verificação de identidade com biometria facial e análise documental.', 
      owner: 'Carlos Santos', 
      squad: 'Beta',
      revenue: 'R$ 4.8M ARR',
      bu: 'Loss Prevention',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'Transacional - R$ 2,50/consulta'
    },
    { 
      sku: 'TSH-004',
      name: 'TRANSACTIONAL SHIELD', 
      tag: 'H1', 
      category: 'Loss Prevention', 
      description: 'Motor de regras e IA para detecção de fraudes em transações financeiras em tempo real.', 
      owner: 'Daniela Lima', 
      squad: 'Beta',
      revenue: 'R$ 7.2M ARR',
      bu: 'Loss Prevention',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'Transacional - 0.1% do volume processado'
    },
    { 
      sku: 'CDE-005',
      name: 'CREDIT DECISION ENGINE', 
      tag: 'H1', 
      category: 'Crédito e Cobrança', 
      description: 'Motor de decisão automatizado para aprovação de crédito com modelos customizáveis.', 
      owner: 'Eduardo Rocha', 
      squad: 'Gamma',
      revenue: 'R$ 3.1M ARR',
      bu: 'Crédito e Cobrança',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'SaaS + Transacional'
    },
    { 
      sku: 'REC-006',
      name: 'RECOVERY OPTIMIZER', 
      tag: 'H1', 
      category: 'Crédito e Cobrança', 
      description: 'Plataforma de gestão e otimização de cobrança com canais digitais integrados.', 
      owner: 'Fernanda Oliveira', 
      squad: 'Gamma',
      revenue: 'R$ 2.5M ARR',
      bu: 'Crédito e Cobrança',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'SaaS - R$ 12.000/mês'
    },
    { 
      sku: 'SMU-007',
      name: 'SMART UNDERWRITER', 
      tag: 'H2', 
      category: 'Cotação e Subscrição', 
      description: 'Sistema de auxílio à subscrição de riscos complexos com análise de dados externos.', 
      owner: 'Gustavo Lima', 
      squad: 'Delta',
      revenue: 'R$ 0.8M ARR',
      bu: 'Cotação e Subscrição',
      mercado: 'B2B',
      horizonte: 'H2',
      pricing: 'SaaS - R$ 15.000/mês'
    },
    { 
      sku: 'COL-008',
      name: 'COLLATERAL REGISTRY AI', 
      tag: 'H2', 
      category: 'Negócios e Infraestrutura', 
      description: 'Plataforma para registro e avaliação automatizada de garantias reais.', 
      owner: 'Helena Souza', 
      squad: 'Delta',
      revenue: 'R$ 0.5M ARR',
      bu: 'Negócios e Infraestrutura',
      mercado: 'B2B',
      horizonte: 'H2',
      pricing: 'SaaS - R$ 20.000/mês'
    },
    { 
      sku: 'MDA-009',
      name: 'MARKET DATA ANALYTICS HUB', 
      tag: 'H1', 
      category: 'Capital Markets', 
      description: 'Terminal de análise de dados de mercado em tempo real para fundos e corretoras.', 
      owner: 'Igor Martins', 
      squad: 'Epsilon',
      revenue: 'R$ 1.8M ARR',
      bu: 'Capital Markets',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'SaaS - R$ 4.000/usuário'
    },
    { 
      sku: 'QUA-010',
      name: 'QUANTUM PREDICTOR', 
      tag: 'H3', 
      category: 'Inovação e Pesquisa', 
      description: 'Algoritmo quântico experimental para predição de cenários econômicos globais com alta precisão.', 
      owner: 'Helena Souza', 
      squad: 'Epsilon',
      revenue: 'R$ 0 ARR',
      bu: 'Negócios e Infraestrutura',
      mercado: 'B2B',
      horizonte: 'H3',
      pricing: 'Pesquisa e Desenvolvimento'
    },
    { 
      sku: 'BLO-011',
      name: 'BLOCKCHAIN LEDGER', 
      tag: 'H2', 
      category: 'Negócios e Infraestrutura', 
      description: 'Infraestrutura de registro distribuído para liquidação instantânea de ativos financeiros.', 
      owner: 'Igor Martins', 
      squad: 'Delta',
      revenue: 'R$ 0.3M ARR',
      bu: 'Negócios e Infraestrutura',
      mercado: 'B2B',
      horizonte: 'H2',
      pricing: 'SaaS + Taxa por transação'
    },
    { 
      sku: 'CYB-012',
      name: 'CYBER DEFENSE AI', 
      tag: 'H1', 
      category: 'Loss Prevention', 
      description: 'Sistema de defesa proativa contra ataques cibernéticos em infraestruturas críticas.', 
      owner: 'Carlos Santos', 
      squad: 'Beta',
      revenue: 'R$ 5.5M ARR',
      bu: 'Loss Prevention',
      mercado: 'B2B',
      horizonte: 'H1',
      pricing: 'SaaS - R$ 25.000/mês'
    }
];

async function seed() {
    console.log("Starting seed of 12 catalog products...");
    for (const p of products) {
        const payload = {
            sku: p.sku,
            name: p.name,
            description: p.description,
            category: p.category,
            price: null,
            stock_status: 'in_stock',
            metadata: {
                tag: p.tag,
                owner: p.owner,
                squad: p.squad,
                revenue: p.revenue,
                bu: p.bu,
                mercado: p.mercado,
                horizonte: p.horizonte,
                pricing: p.pricing
            }
        };

        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'sku' });
        if (error) {
            console.error(error);
        } else {
            console.log(`Inserted ${p.sku}`);
        }
    }
    console.log("Done!");
}

seed();

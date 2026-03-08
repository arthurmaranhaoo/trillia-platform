/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Search, 
  User,
  ArrowRight, 
  Cpu, 
  Activity,
  Plus,
  Send,
  RefreshCw,
  LayoutGrid,
  List,
  Package,
  Paperclip,
  Layers,
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="grid grid-cols-3 gap-1">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent-green" />
      ))}
    </div>
    <span className="text-2xl font-black text-primary lowercase tracking-tighter">trillia</span>
  </div>
);

const Topbar = ({ activeTab, setActiveTab, onOpenAssistant }: { activeTab: string, setActiveTab: (t: string) => void, onOpenAssistant: () => void }) => (
  <header className="h-20 border-b border-ink/5 flex items-center justify-between px-6 lg:px-10 bg-white/60 backdrop-blur-xl sticky top-0 z-40">
    <div className="cursor-pointer" onClick={() => setActiveTab('inicio')}>
      <Logo />
    </div>
    <nav className="hidden md:flex items-center gap-10">
      <span 
        onClick={() => setActiveTab('inicio')}
        className={`nav-item ${activeTab === 'inicio' ? 'text-primary active' : ''}`}
      >
        // INÍCIO
      </span>
      <span 
        onClick={() => setActiveTab('horizontes')}
        className={`nav-item ${activeTab === 'horizontes' ? 'text-primary active' : ''}`}
      >
        // HORIZONTES
      </span>
      <span 
        onClick={() => setActiveTab('catalogo')}
        className={`nav-item ${activeTab === 'catalogo' ? 'text-primary active' : ''}`}
      >
        // EXPLORAR
      </span>
      <span 
        onClick={onOpenAssistant}
        className="nav-item flex items-center gap-2"
      >
        // ASSISTENTE
      </span>
    </nav>
    <div className="flex items-center gap-4">
    </div>
  </header>
);

// --- Views ---

const DataLoom = () => (
  <div className="w-full h-full relative bg-surface/30 overflow-hidden rounded-xl border border-ink/5">
    <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#004EFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#004EFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#004EFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9FF792" stopOpacity="0" />
          <stop offset="50%" stopColor="#9FF792" stopOpacity="1" />
          <stop offset="100%" stopColor="#9FF792" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Background Grid */}
      <pattern id="loomGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ink/5" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#loomGrid)" />

      {/* Braided Paths */}
      <g className="opacity-20">
        <path d="M -50 150 C 200 150, 300 350, 400 350 S 600 150, 850 150" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/20" />
        <path d="M -50 350 C 200 350, 300 150, 400 150 S 600 350, 850 350" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/20" />
        <path d="M 400 -50 L 400 550" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/20" />
      </g>

      {/* Animated Pulses */}
      <path 
        d="M -50 150 C 200 150, 300 350, 400 350 S 600 150, 850 150" 
        fill="none" 
        stroke="url(#grad1)" 
        strokeWidth="3" 
        strokeDasharray="100 400"
        className="animate-pulse-flow"
      />
      <path 
        d="M -50 350 C 200 350, 300 150, 400 150 S 600 350, 850 350" 
        fill="none" 
        stroke="url(#grad2)" 
        strokeWidth="3" 
        strokeDasharray="100 400"
        className="animate-pulse-flow-delayed"
      />
      
      {/* Central Knot */}
      <motion.circle 
        cx="400" cy="250" r="6" 
        className="fill-white stroke-primary stroke-2"
        animate={{ r: [6, 10, 6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <g className="origin-center animate-spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="400" cy="250" r="16" fill="none" stroke="#9FF792" strokeWidth="1" strokeDasharray="4 2" />
      </g>
    </svg>
    
    {/* Floating Data Nodes */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute top-8 left-8 p-4 glass-card border-white/40 space-y-1"
    >
      <p className="text-[8px] font-mono font-bold text-ink/30 uppercase tracking-widest">THROUGHPUT</p>
      <p className="text-xl font-black text-primary">842.01 <span className="text-[10px] opacity-50">GB/S</span></p>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      className="absolute bottom-8 right-8 p-4 glass-card border-white/40 text-right space-y-1"
    >
      <p className="text-[8px] font-mono font-bold text-ink/30 uppercase tracking-widest">LATENCY</p>
      <p className="text-xl font-black text-accent-green">0.04ms</p>
    </motion.div>
  </div>
);

const Machinery = () => (
  <div className="w-full h-[400px] relative overflow-hidden flex justify-center items-center">
    {/* Background Grid - subtle */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,78,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,78,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />
    
    {/* Horizontal Pistons */}
    <div className="w-[38px] h-[38px] absolute border-t-4 border-surface bg-primary animate-slide-h left-1/4 top-1/4" />
    <div className="w-[38px] h-[38px] absolute border-t-4 border-surface bg-primary animate-slide-h [animation-delay:1s] right-1/4 top-1/3" />
    <div className="w-[38px] h-[38px] absolute border-t-4 border-surface bg-primary animate-slide-h [animation-delay:2s] left-1/3 bottom-1/4" />
    
    {/* Vertical Pistons */}
    <div className="w-[38px] h-[38px] absolute border-t-4 border-transparent bg-accent-green left-1/2 top-0 animate-slide-v" />
    <div className="w-[38px] h-[38px] absolute border-t-4 border-transparent bg-accent-green right-1/3 top-1/4 animate-slide-v [animation-delay:1.5s]" />
    <div className="w-[38px] h-[38px] absolute border-t-4 border-transparent bg-accent-green left-1/4 bottom-0 animate-slide-v [animation-delay:0.5s]" />
    
    {/* Extra Blocks */}
    <div className="w-[38px] h-[38px] absolute border-t-4 border-surface bg-primary/40 animate-slide-h [animation-delay:0.7s] top-1/2 left-0" />
    <div className="w-[38px] h-[38px] absolute border-t-4 border-surface bg-accent-green/40 animate-slide-v [animation-delay:2.2s] bottom-0 right-1/4" />
  </div>
);

const BruceIcon = () => (
  <div className="grid grid-cols-2 gap-1">
    <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
  </div>
);

const HomeView = ({ onNavigate }: { onNavigate: (t: string) => void }) => {
  const cards = [
    {
      id: 'horizontes',
      icon: Layers,
      tag: 'ESTRUTURA',
      title: 'A metodologia core',
      desc: 'Visualize cada estágio da Esteira Principal — da tese ao escalonamento.',
      category: 'HORIZONTES'
    },
    {
      id: 'catalogo',
      icon: Package,
      tag: 'PRODUTOS',
      title: 'O portfólio de produtos',
      desc: 'Explore o catálogo completo de 9 produtos ativos. Filtre por BU ou mercado.',
      category: 'EXPLORAR'
    },
    {
      id: 'bruce',
      icon: BruceIcon,
      tag: 'SUPORTE',
      title: 'O assistente da fábrica',
      desc: 'Converse com o Bruce para consultar o catálogo ou entender precificação.',
      category: 'BRUCE'
    }
  ];

  return (
    <div className="p-6 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <section className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-primary" />
            <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">FÁBRICA DE PRODUTOS 2026</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase">
            O QUE VOCÊ PRECISA <br />
            <span className="text-primary">APRENDER</span>?
          </h1>
          <p className="text-ink/60 max-w-md text-lg leading-relaxed">
            Explore o ecossistema de Produtos da Trillia: entenda nossos horizontes de inovação, consulte o catálogo de produtos e tire dúvidas com o Bruce Assistente.
          </p>
        </div>
        <div className="flex-1 w-full h-full min-h-[400px] flex items-center justify-center">
          <Machinery />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {cards.map((card) => (
          <motion.div 
            key={card.id}
            whileHover={{ y: -5 }}
            className="glass-card p-8 lg:p-10 flex flex-col group cursor-pointer h-full"
            onClick={() => onNavigate(card.id === 'bruce' ? 'bruce' : card.id)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <card.icon size={24} />
              </div>
              <span className="text-[9px] font-mono font-bold text-ink/20 bg-surface/50 border border-ink/5 px-2 py-1 rounded uppercase tracking-widest">
                {card.tag}
              </span>
            </div>
            <div className="flex-1 mb-8">
              <div className="space-y-2">
                <p className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">// {card.category}</p>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">{card.title}</h3>
                <p className="text-ink/50 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs group-hover:gap-4 transition-all uppercase tracking-widest pt-4 border-t border-ink/5 mt-auto">
              Acessar <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

const CatalogView = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ bu: 'Todas', mercado: 'Todos', horizonte: 'Todos', squad: 'Todas', responsavel: 'Todos' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const products = [
    { 
      id: 1, 
      title: 'MARKET INTELLIGENCE HUB', 
      tag: 'H1', 
      category: 'S&M e Inteligência de Mercado', 
      desc: 'Plataforma centralizada de insights de mercado e análise competitiva em tempo real.', 
      owner: 'Ana Silva', 
      squad: 'Alpha',
      revenue: 'R$ 1.2M ARR',
      bu: 'S&M e Inteligência de Mercado',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 1.2M ARR', leads: '450/mês', clients: '15 empresas', bu: 'S&M e Inteligência de Mercado' },
      problem: 'Dados de mercado dispersos e falta de visão estratégica consolidada.',
      useCases: ['Análise de concorrência', 'Identificação de tendências'],
      solutions: ['Web Scraping automatizado', 'Dashboards de BI'],
      tech: ['Python', 'Selenium', 'PowerBI'],
      success: 'Empresa Alpha: Redução de 20% no tempo de resposta a movimentos de mercado.',
      pricing: 'SaaS - R$ 5.000/mês'
    },
    { 
      id: 2, 
      title: 'PROSPECTOR PRO', 
      tag: 'H1', 
      category: 'S&M e Inteligência de Mercado', 
      desc: 'Ferramenta de geração e qualificação de leads B2B com enriquecimento de dados.', 
      owner: 'Bruno Costa', 
      squad: 'Alpha',
      revenue: 'R$ 2.4M ARR',
      bu: 'S&M e Inteligência de Mercado',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 2.4M ARR', leads: '1.2k/mês', clients: '42 empresas', bu: 'S&M e Inteligência de Mercado' },
      problem: 'Dificuldade em encontrar leads qualificados e dados de contato atualizados.',
      useCases: ['Prospecção ativa', 'Enriquecimento de CRM'],
      solutions: ['Algoritmo de matching', 'API de enriquecimento'],
      tech: ['Node.js', 'Elasticsearch', 'React'],
      success: 'Beta Corp: Aumento de 35% na taxa de conversão de leads frios.',
      pricing: 'SaaS - R$ 8.500/mês'
    },
    { 
      id: 3, 
      title: 'IDENTITY GUARD AI', 
      tag: 'H1', 
      category: 'Loss Prevention', 
      desc: 'Sistema de verificação de identidade com biometria facial e análise documental.', 
      owner: 'Carlos Santos', 
      squad: 'Beta',
      revenue: 'R$ 4.8M ARR',
      bu: 'Loss Prevention',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 4.8M ARR', leads: '800/mês', clients: '28 bancos', bu: 'Loss Prevention' },
      problem: 'Fraudes de identidade em processos de onboarding digital.',
      useCases: ['Abertura de conta digital', 'Validação de transações'],
      solutions: ['Liveness detection', 'OCR de documentos'],
      tech: ['Python', 'TensorFlow', 'AWS Rekognition'],
      success: 'Banco Digital X: Redução de 92% em tentativas de fraude de identidade.',
      pricing: 'Transacional - R$ 2,50/consulta'
    },
    { 
      id: 4, 
      title: 'TRANSACTIONAL SHIELD', 
      tag: 'H1', 
      category: 'Loss Prevention', 
      desc: 'Motor de regras e IA para detecção de fraudes em transações financeiras em tempo real.', 
      owner: 'Daniela Lima', 
      squad: 'Beta',
      revenue: 'R$ 7.2M ARR',
      bu: 'Loss Prevention',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 7.2M ARR', leads: '2.5k/mês', clients: '12 adquirentes', bu: 'Loss Prevention' },
      problem: 'Perdas financeiras elevadas devido a transações fraudulentas não detectadas.',
      useCases: ['Monitoramento de cartões', 'Prevenção de chargeback'],
      solutions: ['Motor de regras dinâmico', 'Score de risco em tempo real'],
      tech: ['Go', 'Redis', 'Kafka'],
      success: 'Adquirente Y: Economia de R$ 15M em chargebacks no primeiro semestre.',
      pricing: 'Transacional - 0.1% do volume processado'
    },
    { 
      id: 5, 
      title: 'CREDIT DECISION ENGINE', 
      tag: 'H1', 
      category: 'Crédito e Cobrança', 
      desc: 'Motor de decisão automatizado para aprovação de crédito com modelos customizáveis.', 
      owner: 'Eduardo Rocha', 
      squad: 'Gamma',
      revenue: 'R$ 3.1M ARR',
      bu: 'Crédito e Cobrança',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 3.1M ARR', leads: '1.5k/mês', clients: '20 financeiras', bu: 'Crédito e Cobrança' },
      problem: 'Processos de análise de crédito manuais, lentos e inconsistentes.',
      useCases: ['Aprovação de crédito pessoal', 'Análise de risco PJ'],
      solutions: ['Workflow de decisão', 'Integração com bureaus'],
      tech: ['Java', 'Spring Boot', 'PostgreSQL'],
      success: 'Financeira Z: Redução do tempo de análise de 48h para 3 segundos.',
      pricing: 'SaaS + Transacional'
    },
    { 
      id: 6, 
      title: 'RECOVERY OPTIMIZER', 
      tag: 'H1', 
      category: 'Crédito e Cobrança', 
      desc: 'Plataforma de gestão e otimização de cobrança com canais digitais integrados.', 
      owner: 'Fernanda Oliveira', 
      squad: 'Gamma',
      revenue: 'R$ 2.5M ARR',
      bu: 'Crédito e Cobrança',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 2.5M ARR', leads: '3k/mês', clients: '15 assessorias', bu: 'Crédito e Cobrança' },
      problem: 'Baixa eficiência na recuperação de créditos em atraso.',
      useCases: ['Régua de cobrança digital', 'Negociação via WhatsApp'],
      solutions: ['Chatbot de negociação', 'Priorização de carteira'],
      tech: ['Node.js', 'Twilio', 'MongoDB'],
      success: 'Assessoria W: Aumento de 22% na recuperação de dívidas de curto prazo.',
      pricing: 'SaaS - R$ 12.000/mês'
    },
    { 
      id: 7, 
      title: 'SMART UNDERWRITER', 
      tag: 'H2', 
      category: 'Cotação e Subscrição', 
      desc: 'Sistema de auxílio à subscrição de riscos complexos com análise de dados externos.', 
      owner: 'Gustavo Lima', 
      squad: 'Delta',
      revenue: 'R$ 0.8M ARR',
      bu: 'Cotação e Subscrição',
      mercado: 'B2B',
      horizonte: 'H2',
      stats: { revenue: 'R$ 0.8M ARR', leads: '150/mês', clients: '5 seguradoras', bu: 'Cotação e Subscrição' },
      problem: 'Subscrição de riscos complexos baseada em dados limitados e manuais.',
      useCases: ['Seguro agrícola', 'Seguro de grandes riscos'],
      solutions: ['Análise de satélite', 'Cruzamento de dados públicos'],
      tech: ['Python', 'Google Earth Engine', 'Vue.js'],
      success: 'Seguradora S: Redução de 15% na sinistralidade através de melhor seleção de risco.',
      pricing: 'SaaS - R$ 15.000/mês'
    },
    { 
      id: 8, 
      title: 'COLLATERAL REGISTRY AI', 
      tag: 'H2', 
      category: 'Negócios e Infraestrutura', 
      desc: 'Plataforma para registro e avaliação automatizada de garantias reais.', 
      owner: 'Helena Souza', 
      squad: 'Delta',
      revenue: 'R$ 0.5M ARR',
      bu: 'Negócios e Infraestrutura',
      mercado: 'B2B',
      horizonte: 'H2',
      stats: { revenue: 'R$ 0.5M ARR', leads: '100/mês', clients: '3 bancos', bu: 'Negócios e Infraestrutura' },
      problem: 'Gestão de garantias reais (imóveis, veículos) ineficiente e sujeita a erros.',
      useCases: ['Avaliação de imóveis', 'Gestão de gravames'],
      solutions: ['Avaliação automatizada (AVM)', 'Integração com cartórios'],
      tech: ['C#', '.NET Core', 'SQL Server'],
      success: 'Banco B: Redução de 40% no custo operacional de gestão de garantias.',
      pricing: 'SaaS - R$ 20.000/mês'
    },
    { 
      id: 9, 
      title: 'MARKET DATA ANALYTICS HUB', 
      tag: 'H1', 
      category: 'Capital Markets', 
      desc: 'Terminal de análise de dados de mercado em tempo real para fundos e corretoras.', 
      owner: 'Igor Martins', 
      squad: 'Epsilon',
      revenue: 'R$ 1.8M ARR',
      bu: 'Capital Markets',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 1.8M ARR', leads: '300/mês', clients: '10 assets', bu: 'Capital Markets' },
      problem: 'Falta de ferramentas acessíveis para análise quantitativa de mercado.',
      useCases: ['Análise técnica', 'Backtesting de estratégias'],
      solutions: ['Streaming de dados B3', 'Motor de backtesting'],
      tech: ['C++', 'Python', 'React'],
      success: 'Asset A: Melhoria de 12% no alpha das estratégias quantitativas.',
      pricing: 'SaaS - R$ 4.000/usuário'
    },
    { 
      id: 10, 
      title: 'QUANTUM PREDICTOR', 
      tag: 'H3', 
      category: 'Inovação e Pesquisa', 
      desc: 'Algoritmo quântico experimental para predição de cenários econômicos globais com alta precisão.', 
      owner: 'Helena Souza', 
      squad: 'Epsilon',
      revenue: 'R$ 0 ARR',
      bu: 'Negócios e Infraestrutura',
      mercado: 'B2B',
      horizonte: 'H3',
      stats: { revenue: 'R$ 0 ARR', leads: '10/mês', clients: '1 parceiro acadêmico', bu: 'Negócios e Infraestrutura' },
      problem: 'Limitações de processamento clássico para modelos macroeconômicos complexos.',
      useCases: ['Simulação de crises', 'Otimização de portfólio quântico'],
      solutions: ['Algoritmos de Grover adaptados', 'Integração com computadores quânticos IBM'],
      tech: ['Qiskit', 'Python', 'C++'],
      success: 'Lab X: Redução de 99% no tempo de simulação de Monte Carlo.',
      pricing: 'Pesquisa e Desenvolvimento'
    },
    { 
      id: 11, 
      title: 'BLOCKCHAIN LEDGER', 
      tag: 'H2', 
      category: 'Negócios e Infraestrutura', 
      desc: 'Infraestrutura de registro distribuído para liquidação instantânea de ativos financeiros.', 
      owner: 'Igor Martins', 
      squad: 'Delta',
      revenue: 'R$ 0.3M ARR',
      bu: 'Negócios e Infraestrutura',
      mercado: 'B2B',
      horizonte: 'H2',
      stats: { revenue: 'R$ 0.3M ARR', leads: '50/mês', clients: '2 bancos teste', bu: 'Negócios e Infraestrutura' },
      problem: 'Lentidão e falta de transparência em processos de clearing bancário.',
      useCases: ['Liquidação D+0', 'Tokenização de recebíveis'],
      solutions: ['Hyperledger Fabric', 'Smart Contracts'],
      tech: ['Go', 'Docker', 'Kubernetes'],
      success: 'Banco Y: Redução de 70% no custo de backoffice de liquidação.',
      pricing: 'SaaS + Taxa por transação'
    },
    { 
      id: 12, 
      title: 'CYBER DEFENSE AI', 
      tag: 'H1', 
      category: 'Loss Prevention', 
      desc: 'Sistema de defesa proativa contra ataques cibernéticos em infraestruturas críticas.', 
      owner: 'Carlos Santos', 
      squad: 'Beta',
      revenue: 'R$ 5.5M ARR',
      bu: 'Loss Prevention',
      mercado: 'B2B',
      horizonte: 'H1',
      stats: { revenue: 'R$ 5.5M ARR', leads: '200/mês', clients: '12 empresas', bu: 'Loss Prevention' },
      problem: 'Aumento de ataques de ransomware e vazamento de dados sensíveis.',
      useCases: ['Detecção de intrusão', 'Análise de comportamento de rede'],
      solutions: ['Deep Learning para anomalias', 'Resposta automática a incidentes'],
      tech: ['Python', 'ELK Stack', 'TensorFlow'],
      success: 'Empresa Z: Bloqueio de 100% das tentativas de exfiltração de dados em 2025.',
      pricing: 'SaaS - R$ 25.000/mês'
    }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBU = filters.bu === 'Todas' || p.bu === filters.bu;
    const matchesMercado = filters.mercado === 'Todos' || p.mercado === filters.mercado;
    const matchesHorizonte = filters.horizonte === 'Todos' || p.horizonte === filters.horizonte;
    const matchesSquad = filters.squad === 'Todas' || p.squad === filters.squad;
    const matchesResponsavel = filters.responsavel === 'Todos' || p.owner === filters.responsavel;
    return matchesSearch && matchesBU && matchesMercado && matchesHorizonte && matchesSquad && matchesResponsavel;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  return (
    <div className="p-6 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-[1px] w-8 bg-primary" />
              <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">EXPLORAR PORTFÓLIO</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              CATÁLOGO DE <span className="text-primary">PRODUTOS</span>
            </h1>
            <p className="text-lg text-ink/50 leading-relaxed max-w-4xl">
              O Catálogo de Produtos da Trillia é o repositório central de todas as nossas soluções ativas e em desenvolvimento. 
              Aqui você pode explorar o portfólio completo, filtrando por Unidade de Negócio (BU), mercado de atuação ou 
              estágio de maturidade (Horizonte). Cada card oferece uma visão profunda da proposta de valor, stack tecnológica 
              e indicadores de performance de cada produto.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 pt-8 border-t border-ink/5">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-6 py-3 bg-white border border-ink/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <label className="text-[9px] font-mono font-bold text-ink/30 uppercase tracking-widest whitespace-nowrap">HORIZONTE:</label>
              <div className="relative">
                <select 
                  value={filters.horizonte}
                  onChange={(e) => setFilters({ ...filters, horizonte: e.target.value })}
                  className="pl-4 pr-10 py-2 bg-white border border-ink/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer w-40 shadow-sm"
                >
                  {['Todos', 'H1', 'H2', 'H3'].map(horizonte => (
                    <option key={horizonte} value={horizonte}>{horizonte}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[9px] font-mono font-bold text-ink/30 uppercase tracking-widest whitespace-nowrap">BU:</label>
              <div className="relative">
                <select 
                  value={filters.bu}
                  onChange={(e) => setFilters({ ...filters, bu: e.target.value })}
                  className="pl-4 pr-10 py-2 bg-white border border-ink/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer w-40 shadow-sm"
                >
                  {['Todas', 'S&M e Inteligência de Mercado', 'Loss Prevention', 'Crédito e Cobrança', 'Cotação e Subscrição', 'Negócios e Infraestrutura', 'Capital Markets'].map(bu => (
                    <option key={bu} value={bu}>{bu}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[9px] font-mono font-bold text-ink/30 uppercase tracking-widest whitespace-nowrap">SQUAD:</label>
              <div className="relative">
                <select 
                  value={filters.squad}
                  onChange={(e) => setFilters({ ...filters, squad: e.target.value })}
                  className="pl-4 pr-10 py-2 bg-white border border-ink/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer w-40 shadow-sm"
                >
                  {['Todas', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map(squad => (
                    <option key={squad} value={squad}>{squad}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[9px] font-mono font-bold text-ink/30 uppercase tracking-widest whitespace-nowrap">RESPONSÁVEL:</label>
              <div className="relative">
                <select 
                  value={filters.responsavel}
                  onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
                  className="pl-4 pr-10 py-2 bg-white border border-ink/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer w-40 shadow-sm"
                >
                  {['Todos', 'Ana Silva', 'Bruno Costa', 'Carlos Santos', 'Daniela Lima', 'Eduardo Rocha', 'Fernanda Oliveira', 'Gustavo Lima', 'Helena Souza', 'Igor Martins'].map(resp => (
                    <option key={resp} value={resp}>{resp}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[9px] font-mono font-bold text-ink/30 uppercase tracking-widest whitespace-nowrap">MERCADO:</label>
              <div className="relative">
                <select 
                  value={filters.mercado}
                  onChange={(e) => setFilters({ ...filters, mercado: e.target.value })}
                  className="pl-4 pr-10 py-2 bg-white border border-ink/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer w-40 shadow-sm"
                >
                  {['Todos', 'B2B', 'B2C', 'B2B2C'].map(mercado => (
                    <option key={mercado} value={mercado}>{mercado}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>

            <div className="flex items-center bg-white border border-ink/10 rounded-xl p-1 shadow-sm ml-auto">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-ink/30 hover:text-ink'}`}
                title="Visualização em Grade"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-ink/30 hover:text-ink'}`}
                title="Visualização em Lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div 
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-6 bg-surface/30 rounded-[32px] border border-dashed border-ink/10"
          >
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center text-ink/10">
              <Search size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">Nenhum produto encontrado</h3>
              <p className="text-ink/40 text-sm max-w-xs mx-auto">Não encontramos resultados para os filtros selecionados. Tente ajustar sua busca ou filtros.</p>
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilters({ bu: 'Todas', mercado: 'Todos', horizonte: 'Todos', squad: 'Todas', responsavel: 'Todos' });
              }}
              className="px-6 py-3 bg-ink text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg hover:shadow-primary/20"
            >
              Limpar todos os filtros
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key={`${viewMode}-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}
          >
            {paginatedProducts.map((product, index) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={viewMode === 'grid' ? { 
                  y: -12,
                  rotateX: 2,
                  rotateY: -2,
                  transition: { duration: 0.2 }
                } : { x: 12 }}
                onClick={() => setSelectedProduct(product)}
                className={`glass-card group cursor-pointer border-transparent hover:border-primary/20 transition-all overflow-hidden flex perspective-1000 relative ${viewMode === 'grid' ? 'flex-col h-full min-h-[450px]' : 'flex-row items-center p-6 gap-8'}`}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {viewMode === 'grid' ? (
                <>
                  <div className="p-8 space-y-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest border shadow-sm
                        ${product.tag === 'H3' ? 'bg-accent-green text-white border-accent-green/20' : 
                          product.tag === 'H2' ? 'bg-primary text-white border-primary/20' : 
                          product.tag === 'H1' ? 'bg-ink text-white border-ink/20' : 
                          'bg-surface text-primary border-primary/10'}
                      `}>
                        {product.tag}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{product.title}</h3>
                      <p className="text-xs font-mono font-bold text-ink/30 uppercase tracking-widest">{product.category}</p>
                    </div>

                    <p className="text-sm text-ink/50 leading-relaxed line-clamp-3">
                      {product.desc}
                    </p>

                    <div className="mt-auto pt-6 border-t border-ink/5">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-[8px] font-mono text-ink/20 font-bold uppercase tracking-widest">BU</p>
                          <p className="text-[10px] font-black text-primary truncate">{product.bu.split(' ')[0]}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-mono text-ink/20 font-bold uppercase tracking-widest">SQUAD</p>
                          <p className="text-[10px] font-black text-ink/80 uppercase">{product.squad}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-mono text-ink/20 font-bold uppercase tracking-widest">RESPONSÁVEL</p>
                          <p className="text-[10px] font-black text-ink/80 uppercase truncate">{product.owner.split(' ')[0]}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 py-5 bg-surface/50 border-t border-ink/5 flex justify-between items-center group/footer">
                    <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-ink/30 uppercase tracking-widest group-hover/footer:text-primary transition-colors">
                      Ver Detalhes <ArrowRight size={14} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 flex items-center gap-12">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors truncate">{product.title}</h3>
                    </div>
                    <div className="hidden lg:block w-48 shrink-0">
                      <p className="text-[8px] font-mono text-ink/20 font-bold uppercase mb-1 tracking-widest">BU</p>
                      <p className="text-[10px] font-bold text-ink uppercase truncate">{product.bu}</p>
                    </div>
                    <div className="hidden lg:block w-32 shrink-0">
                      <p className="text-[8px] font-mono text-ink/20 font-bold uppercase mb-1 tracking-widest">SQUAD</p>
                      <p className="text-[10px] font-bold text-ink uppercase">{product.squad}</p>
                    </div>
                    <div className="hidden lg:block w-48 shrink-0">
                      <p className="text-[8px] font-mono text-ink/20 font-bold uppercase mb-1 tracking-widest">RESPONSÁVEL</p>
                      <p className="text-[10px] font-bold text-ink uppercase truncate">{product.owner}</p>
                    </div>
                    <div className="flex justify-end items-center gap-6 shrink-0">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest border shadow-sm
                        ${product.tag === 'H3' ? 'bg-accent-green text-white border-accent-green/20' : 
                          product.tag === 'H2' ? 'bg-primary text-white border-primary/20' : 
                          product.tag === 'H1' ? 'bg-ink text-white border-ink/20' : 
                          'bg-surface text-primary border-primary/10'}
                      `}>
                        {product.tag}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-ink/20 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-ink/10 text-ink/30 hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-ink/30 disabled:hover:border-ink/10 transition-all"
          >
            <ChevronDown className="rotate-90" size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-xs font-mono font-bold transition-all hover:-translate-y-1 active:scale-95 ${currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-ink/30 hover:text-ink hover:bg-surface border border-transparent hover:border-ink/5'}`}
              >
                {page.toString().padStart(2, '0')}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-ink/10 text-ink/30 hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-ink/30 disabled:hover:border-ink/10 transition-all"
          >
            <ChevronDown className="-rotate-90" size={20} />
          </button>
        </div>
      )}

      {/* Product Deep Dive Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface hover:bg-ink hover:text-white transition-all flex items-center justify-center z-10"
              >
                <Plus className="rotate-45" size={24} />
              </button>

              <div className="overflow-y-auto p-8 lg:p-16 space-y-16">
                <header className="flex flex-col md:flex-row justify-between items-start gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest border shadow-sm
                        ${selectedProduct.tag === 'H3' ? 'bg-accent-green text-white border-accent-green/20' : 
                          selectedProduct.tag === 'H2' ? 'bg-primary text-white border-primary/20' : 
                          selectedProduct.tag === 'H1' ? 'bg-ink text-white border-ink/20' : 
                          'bg-surface text-primary border-primary/10'}
                      `}>
                        {selectedProduct.tag}
                      </span>
                      <a 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary uppercase tracking-widest hover:underline"
                      >
                        <Paperclip size={14} /> Enxoval do Produto
                      </a>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">{selectedProduct.title}</h2>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-2 space-y-12">
                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-primary" />
                        <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">O PROBLEMA</p>
                      </div>
                      <p className="text-2xl font-black text-ink/80 leading-tight">{selectedProduct.problem}</p>
                    </section>

                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-primary" />
                        <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">CASOS DE USO</p>
                      </div>
                      <ul className="space-y-3">
                        {selectedProduct.useCases.map((u: string) => (
                          <li key={u} className="text-lg text-ink/60 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary/30" /> {u}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-primary" />
                        <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">SOLUÇÃO TÉCNICA</p>
                      </div>
                      <ul className="space-y-4">
                        {selectedProduct.solutions.map((s: string) => (
                          <li key={s} className="text-lg text-ink/80 font-bold flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-ink/5">
                        {selectedProduct.tech.map((t: string) => (
                          <span key={t} className="px-3 py-1 bg-surface border border-ink/5 rounded-lg text-[10px] font-mono font-bold text-ink/40 uppercase tracking-widest">
                            {t}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="space-y-12">
                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-primary" />
                        <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">GOVERNANÇA</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-ink/5">
                          <span className="text-[10px] font-mono text-ink/30 font-bold uppercase">BU</span>
                          <span className="text-xs font-black uppercase">{selectedProduct.bu}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-ink/5">
                          <span className="text-[10px] font-mono text-ink/30 font-bold uppercase">MERCADO</span>
                          <span className="text-xs font-black uppercase">{selectedProduct.mercado}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-ink/5">
                          <span className="text-[10px] font-mono text-ink/30 font-bold uppercase">RESPONSÁVEL</span>
                          <span className="text-xs font-black uppercase">{selectedProduct.owner}</span>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">// PRICING</p>
                      <div className="p-6 bg-ink text-white rounded-2xl space-y-2">
                        <p className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-widest">MODELO DE NEGÓCIO</p>
                        <p className="text-sm font-black uppercase tracking-tight">{selectedProduct.pricing}</p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BruceAssistant = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Olá. Sou o Bruce Assistente! Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `Você é o Bruce Assistente, um agente de IA especializado no ecossistema de produtos da Trillia.
Seu objetivo é:
1. Explicar os produtos do catálogo detalhadamente.
2. Manter um foco comercial, destacando benefícios, ROI e casos de sucesso.
3. Tirar dúvidas dos usuários sobre a metodologia H3, horizontes de inovação e governança.

Sempre que o usuário pedir uma comparação entre produtos, você DEVE obrigatoriamente utilizar uma tabela Markdown para facilitar a visualização.
A tabela deve conter as seguintes colunas:
- Dor (Qual problema o produto resolve)
- Solução (Como ele resolve)
- Ofertas (O que está incluído)
- Como precificar (Modelo de negócio)
- Objeções principais (O que o cliente costuma questionar e como contornar)

Aqui está o contexto dos produtos disponíveis:
${JSON.stringify([
  { id: 1, title: 'MARKET INTELLIGENCE HUB', tag: 'H1', category: 'S&M e Inteligência de Mercado', desc: 'Plataforma centralizada de insights de mercado e análise competitiva em tempo real.', owner: 'Ana Silva', squad: 'Alpha', pricing: 'SaaS - R$ 5.000/mês' },
  { id: 2, title: 'PROSPECTOR PRO', tag: 'H1', category: 'S&M e Inteligência de Mercado', desc: 'Ferramenta de geração e qualificação de leads B2B com enriquecimento de dados.', owner: 'Bruno Costa', squad: 'Alpha', pricing: 'SaaS - R$ 8.500/mês' },
  { id: 3, title: 'IDENTITY GUARD AI', tag: 'H1', category: 'Loss Prevention', desc: 'Sistema de verificação de identidade com biometria facial e análise documental.', owner: 'Carlos Santos', squad: 'Beta', pricing: 'Transacional - R$ 2,50/consulta' },
  { id: 4, title: 'TRANSACTIONAL SHIELD', tag: 'H1', category: 'Loss Prevention', desc: 'Motor de regras e IA para detecção de fraudes em transações financeiras em tempo real.', owner: 'Daniela Lima', squad: 'Beta', pricing: 'Transacional - 0.1% do volume processado' },
  { id: 5, title: 'CREDIT DECISION ENGINE', tag: 'H1', category: 'Crédito e Cobrança', desc: 'Motor de decisão automatizado para aprovação de crédito com modelos customizáveis.', owner: 'Eduardo Rocha', squad: 'Gamma', pricing: 'SaaS + Transacional' },
  { id: 6, title: 'RECOVERY OPTIMIZER', tag: 'H1', category: 'Crédito e Cobrança', desc: 'Plataforma de gestão e otimização de cobrança com canais digitais integrados.', owner: 'Fernanda Oliveira', squad: 'Gamma', pricing: 'SaaS - R$ 12.000/mês' },
  { id: 7, title: 'SMART UNDERWRITER', tag: 'H2', category: 'Cotação e Subscrição', desc: 'Sistema de auxílio à subscrição de riscos complexos com análise de dados externos.', owner: 'Gustavo Lima', squad: 'Delta', pricing: 'SaaS - R$ 15.000/mês' },
  { id: 8, title: 'COLLATERAL REGISTRY AI', tag: 'H2', category: 'Negócios e Infraestrutura', desc: 'Plataforma para registro e avaliação automatizada de garantias reais.', owner: 'Helena Souza', squad: 'Delta', pricing: 'SaaS - R$ 20.000/mês' },
  { id: 9, title: 'MARKET DATA ANALYTICS HUB', tag: 'H1', category: 'Capital Markets', desc: 'Terminal de análise de dados de mercado em tempo real para fundos e corretoras.', owner: 'Igor Martins', squad: 'Epsilon', pricing: 'SaaS - R$ 4.000/usuário' }
])}

Aqui está o contexto da metodologia H3:
- H3 (Discovery): Validação de tese e problema. Foco em inovação radical.
- H2 (Engenharia): Construção de MVP e primeira venda. Foco em tração.
- H1 (Escala): Máquina de vendas e crescimento acelerado. Foco em eficiência.

Seja profissional, técnico e persuasivo. Responda em Português do Brasil.`;

      const response = await ai.models.generateContent({
        model,
        contents: messages.concat(userMessage).map(m => ({
          role: m.role === 'system' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction,
        }
      });

      const aiText = response.text || "Desculpe, tive um problema ao processar sua solicitação.";
      setMessages(prev => [...prev, { role: 'system', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'system', text: "Erro na conexão com o Bruce. Verifique sua chave de API ou tente novamente mais tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'system', text: 'Olá. Sou o Bruce Assistente! Como posso te ajudar hoje?' }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`fixed z-50 glass-card overflow-hidden shadow-2xl border-primary/10 flex flex-col ${
            isExpanded 
              ? 'inset-0 w-full h-full rounded-none' 
              : 'bottom-4 right-4 sm:bottom-10 sm:right-10 w-[calc(100%-2rem)] sm:w-[450px] h-[600px] max-h-[calc(100vh-80px)] rounded-2xl'
          }`}
        >
          <header className="bg-accent-green p-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-ink rounded-lg flex items-center justify-center text-accent-green">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              </div>
              <div>
                <h3 className="font-black uppercase text-ink leading-none">BRUCE ASSISTENTE</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-ink/10 rounded-full transition-colors hidden sm:block">
                {isExpanded ? <Minimize2 size={18} className="text-ink" /> : <Maximize2 size={18} className="text-ink" />}
              </button>
              <button onClick={handleReset} className="p-2 hover:bg-ink/10 rounded-full transition-colors">
                <RefreshCw size={18} className="text-ink" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-ink/10 rounded-full transition-colors">
                <Plus size={24} className="text-ink rotate-45" />
              </button>
            </div>
          </header>

          <div 
            ref={scrollRef}
            className="overflow-y-auto p-6 sm:p-8 space-y-8 bg-white/50 flex-1"
          >
            {messages.map((msg, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${msg.role === 'system' ? 'bg-ink text-accent-green' : 'bg-primary text-white'}`}>
                    {msg.role === 'system' ? (
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-accent-green" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                      </div>
                    ) : <User size={14} />}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-ink/30 uppercase tracking-widest">
                    {msg.role === 'system' ? 'BRUCE ASSISTENTE' : 'USUÁRIO'}
                  </span>
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed ${msg.role === 'system' ? 'bg-surface border border-ink/5' : 'bg-primary text-white'}`}>
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 ml-8">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          <footer className="p-6 bg-white border-t border-ink/5 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Pergunte qualquer coisa ao Bruce..." 
                className="w-full pl-6 pr-24 py-4 bg-surface border border-ink/5 rounded-2xl focus:outline-none focus:border-primary/30 transition-all text-sm disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? '...' : 'ENVIAR'} <Send size={14} />
              </button>
            </form>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HorizontesView = () => {
  const [selectedStage, setSelectedStage] = useState<any>(null);

  const stages = [
    {
      id: '3.1',
      horizon: 'H3',
      title: 'Discovery e Concepção',
      subtitle: 'SUB-FASE 1',
      description: 'Estruturar a tese do produto, definindo o problema e o público-alvo.',
      color: 'bg-accent-green',
      textColor: 'text-accent-green',
      icon: Search,
      definition: 'O ponto de partida. Aqui a visão de negócio é destilada em uma tese clara que será validada tecnicamente nas camadas seguintes.',
      entrada: 'Tese de negócio inicial e visão macro.',
      saida: 'Tese de produto documentada e aprovada.',
      redFlags: ['Problema mal definido', 'Público-alvo muito genérico', 'Falta de diferencial claro'],
      etapas: ['Reunião de Alinhamento', 'Documentação da Tese', 'Pesquisa Inicial', 'Consolidação'],
      artefatos: ['Tese de Produto', 'Dicionário de Dados V1'],
      checklist: ['Tese documentada', 'Premissas mapeadas', 'Alinhamento PO & Lead Tech'],
      responsavel: 'PO (Lidera), Lead Tech (Co-cria)'
    },
    {
      id: '3.2',
      horizon: 'H3',
      title: 'Análise de Mercado e Viabilidade',
      subtitle: 'SUB-FASE 2',
      description: 'Quantificar a oportunidade de negócio e analisar os riscos técnicos e legais.',
      color: 'bg-accent-green',
      textColor: 'text-accent-green',
      icon: Activity,
      definition: 'Transformar a tese em uma oportunidade de mercado concreta, analisando o tamanho do problema e a viabilidade de execução sem código.',
      entrada: 'Tese de produto validada.',
      saida: 'Business Case e Parecer de Viabilidade.',
      redFlags: ['Mercado muito pequeno', 'Barreiras legais críticas', 'Custo de aquisição inviável'],
      etapas: ['Análise de Mercado', 'Estudo de Viabilidade Técnica', 'Privacy by Design', 'Business Case'],
      artefatos: ['Business Case', 'Parecer de Viabilidade Técnica'],
      checklist: ['Business Case completo', 'Pareceres anexados', 'Validação Privacy realizada'],
      responsavel: 'PO (Mercado), Lead Tech (Técnico)'
    },
    {
      id: '3.3',
      horizon: 'H3',
      title: 'Prova de Conceito (PoC)',
      subtitle: 'SUB-FASE 3',
      description: 'Obter prova tangível (quantitativa e qualitativa) do valor da solução.',
      color: 'bg-accent-green',
      textColor: 'text-accent-green',
      icon: Cpu,
      definition: 'A teoria encontra a prática. Construção de uma prova de conceito para validar as premissas mais arriscadas e o potencial de reuso.',
      entrada: 'Business Case aprovado.',
      saida: 'Relatório de Validação e PoC funcional.',
      redFlags: ['Falha na validação técnica', 'Feedback negativo de usuários', 'Complexidade excessiva para PoC'],
      etapas: ['Estratégia Técnica', 'Materiais de Apoio', 'Execução da Validação', 'Consolidação'],
      artefatos: ['Relatório de Validação', 'Esteira Técnica do PoC', 'Produto de Papel'],
      checklist: ['Relatório finalizado', 'Caso de sucesso gerado', 'Trilha H2 definida'],
      responsavel: 'PO (Qualitativo), Lead Tech (Execução)'
    },
    {
      id: '2.1',
      horizon: 'H2',
      title: 'Engenharia e Estratégia Comercial',
      subtitle: 'SUB-FASE 1',
      description: 'Construir a V1 do produto e, em paralelo, estruturar o pipeline de vendas.',
      color: 'bg-primary',
      textColor: 'text-primary',
      icon: Settings,
      definition: 'Início da construção robusta do produto (V1.0) with foco total na integridade e disponibilidade dos dados core.',
      entrada: 'PoC validado e trilha H2 definida.',
      saida: 'MVP (V1) e Pipeline de Vendas estruturado.',
      redFlags: ['Dívida técnica precoce', 'Falta de leads no pipeline', 'Instabilidade no Core Engine'],
      etapas: ['Planejamento de Engenharia', 'Execução em Trilhas', 'QA e Integração', 'Estruturação de Pipeline'],
      artefatos: ['MVP (V1)', 'Data Handoff', 'Pipeline de Vendas'],
      checklist: ['V1 aprovada no QA', 'Data Handoff concluído', 'Demo interna realizada'],
      responsavel: 'Lead Tech & Squad (Técnico), PO (Comercial)'
    },
    {
      id: '2.2',
      horizon: 'H2',
      title: 'Vendas & Início do Handover',
      subtitle: 'SUB-FASE 2',
      description: 'Executar a primeira venda, que valida o negócio e dispara o processo de handover.',
      color: 'bg-primary',
      textColor: 'text-primary',
      icon: ArrowRight,
      definition: 'Criação de linguagens específicas de domínio para acelerar a integração e o handover do produto.',
      entrada: 'MVP (V1) estável.',
      saida: 'Primeiro contrato assinado e handover iniciado.',
      redFlags: ['Ciclo de venda muito longo', 'Dificuldade de integração', 'Rejeição do time de operações'],
      etapas: ['Lançamento de Campanha', 'Suporte à Venda', 'Gatilho de Handover', 'Primeira Entrega'],
      artefatos: ['Contrato Assinado', 'Formulário de Cadastro Técnico', 'Formulário de Implantação'],
      checklist: ['Ao menos um contrato assinado', 'Cadastro técnico submetido', 'Primeira entrega realizada'],
      responsavel: 'PO (Materiais), Equipe de Negócios (Vendas), Lead Tech (Suporte)'
    },
    {
      id: '2.3',
      horizon: 'H2',
      title: 'Enxoval & Conclusão do Handover',
      subtitle: 'SUB-FASE 3',
      description: 'Finalizar a documentação, capacitador as equipes e concluir a Passagem de Bola.',
      color: 'bg-primary',
      textColor: 'text-primary',
      icon: Paperclip,
      definition: 'Refino técnico final e preparação do enxoval completo para garantir a replicabilidade do produto.',
      entrada: 'Primeira venda realizada.',
      saida: 'Enxoval completo e Passagem de Bola assinada.',
      redFlags: ['Documentação incompleta', 'Time de sustentação sem autonomia', 'Gargalos no processo de implantação'],
      etapas: ['Construção do Enxoval', 'Capacitação de Equipes', 'Soft Launch', 'Passagem de Bola'],
      artefatos: ['Enxoval do Produto', 'Plano de GTM (Soft)', 'Formulário de Passagem de Bola'],
      checklist: ['Enxoval completo', 'Treinamentos concluídos', 'Passagem de Bola assinada'],
      responsavel: 'PO (Negócio), Lead Tech (Técnico)'
    },
    {
      id: '1.1',
      horizon: 'H1',
      title: 'Máquina de Vendas',
      subtitle: 'SUB-FASE 1',
      description: 'Implementar o GTM (Hard Launch) para escalar a geração de leads e vendas.',
      color: 'bg-ink',
      textColor: 'text-ink',
      icon: Activity,
      definition: 'Lançamento oficial e entrada em produção técnica em larga escala. O foco é a estabilidade do Hard Launch.',
      entrada: 'Handover concluído com sucesso.',
      saida: 'Hard Launch executado e metas de venda batidas.',
      redFlags: ['CAC superior ao LTV', 'Instabilidade em alta carga', 'Baixa conversão de leads'],
      etapas: ['Execução do Hard Launch', 'Campanhas de Marketing', 'Eventos e PR', 'Análise de KPIs'],
      artefatos: ['Plano de GTM (Hard)', 'Materiais de Marketing'],
      checklist: ['Resultados de marketing analisados', 'Metas vs Realizado comparado'],
      responsavel: 'Marketing & Vendas (Liderança), PO (Visão)'
    },
    {
      id: '1.2',
      horizon: 'H1',
      title: 'Sustentação Ativa',
      subtitle: 'SUB-FASE 2',
      description: 'Garantir a saúde operacional do produto com monitoramento e suporte contínuo.',
      color: 'bg-ink',
      textColor: 'text-ink',
      icon: RefreshCw,
      definition: 'Monitoramento contínuo e rastreabilidade total de cada transação para garantir o SLA em escala.',
      entrada: 'Produto em escala (Hard Launch).',
      saida: 'SLA garantido e dashboards de saúde ativos.',
      redFlags: ['Aumento de churn técnico', 'MTTR elevado', 'Falta de visibilidade de erros'],
      etapas: ['Gestão de Incidentes', 'Suporte Especializado', 'Monitoramento Técnico', 'Monitoramento de Bilhetagem'],
      artefatos: ['Dashboards de Monitoramento', 'Relatórios de Incidentes'],
      checklist: ['Dashboards revisados', 'Incidentes analisados', 'Saúde do produto classificada'],
      responsavel: 'Equipe de Operações (Liderança), CS (Feedback)'
    },
    {
      id: '1.3',
      horizon: 'H1',
      title: 'Otimização e Evolução',
      subtitle: 'SUB-FASE 3',
      description: 'Utilizar dados de performance para tomar decisões de melhoria ou reinvenção.',
      color: 'bg-ink',
      textColor: 'text-ink',
      icon: Plus,
      definition: 'Garantir que a entrega de valor seja contínua e que o produto evolua conforme o feedback real dos clientes.',
      entrada: 'Dados de performance consolidados.',
      saida: 'Roadmap de evolução ou decisão de pivot.',
      redFlags: ['Produto estagnado', 'Feedback negativo recorrente', 'Perda de relevância no mercado'],
      etapas: ['Análise de Performance', 'Coleta de Feedback', 'Proposta de Evolução', 'Decisão e Roteirização'],
      artefatos: ['Dashboards de Negócio', 'Proposta de Evolução'],
      checklist: ['Análise de performance apresentada', 'Decisão formal tomada'],
      responsavel: 'PM / PO (Análise), Liderança de Produto (Decisão)'
    }
  ];

  return (
    <div className="p-6 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-primary" />
            <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">EXPLORAR METODOLOGIA</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            MATRIZ DE <span className="text-primary">HORIZONTES</span>
          </h1>
          <p className="text-lg text-ink/50 leading-relaxed max-w-4xl">
            A Matriz de Horizontes é o mapa estratégico que guia a evolução de cada produto na Trillia. 
            Dividida em três horizontes (H3, H2, H1), ela define o nível de maturidade, os objetivos centrais 
            e os critérios de sucesso necessários para avançar na esteira de inovação, garantindo que cada 
            solução seja validada, construída e escalada com máxima eficiência e governança.
          </p>
        </div>
      </header>

      {/* Matrix Headers */}
      <div className="hidden md:grid grid-cols-4 gap-0 border-b border-ink/10 pb-4">
        <div className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-widest pl-10">FASE</div>
        <div className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-widest pl-10">SUB-FASE 1</div>
        <div className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-widest pl-10">SUB-FASE 2</div>
        <div className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-widest pl-10">SUB-FASE 3</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-ink/10 rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Row H3 */}
        <div className="p-10 bg-surface/30 flex flex-col items-center text-center justify-center border-b md:border-b md:border-r border-ink/10">
          <div className="w-24 h-24 rounded-full bg-accent-green flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6">H3</div>
          <p className="text-xs font-mono font-bold text-accent-green uppercase tracking-widest mb-2">VALIDAÇÃO</p>
          <p className="text-sm font-black uppercase tracking-tight text-ink/80 leading-tight">Reduzir o risco validando a tese de negócio com baixo custo.</p>
        </div>
        {stages.filter(s => s.horizon === 'H3').map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.02)' }}
            onClick={() => setSelectedStage(stage)}
            className={`p-10 space-y-8 cursor-pointer group transition-all min-h-[350px] flex flex-col justify-between border-ink/10
              ${idx !== 2 ? 'md:border-r' : ''}
              border-b md:border-b
            `}
          >
            <div className="flex items-start gap-6">
              <div className={`shrink-0 w-14 h-14 rounded-2xl ${stage.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                <stage.icon size={28} />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-start">
                  <p className={`font-mono text-[10px] font-bold tracking-widest uppercase ${stage.textColor}`}>{stage.subtitle}</p>
                  <span className="text-2xl font-black text-ink/5 group-hover:text-primary/10 transition-colors uppercase leading-none">{stage.horizon}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-none">{stage.title}</h3>
                <p className="text-sm text-ink/40 leading-relaxed group-hover:text-ink/60 transition-colors">{stage.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-ink/30 uppercase tracking-widest group-hover:text-primary transition-colors">
              Expandir Etapa <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}

        {/* Row H2 */}
        <div className="p-10 bg-surface/30 flex flex-col items-center text-center justify-center border-t md:border-t-0 md:border-b md:border-r border-ink/10 border-b md:border-b">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6">H2</div>
          <p className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-2">CONSTRUÇÃO</p>
          <p className="text-sm font-black uppercase tracking-tight text-ink/80 leading-tight">Transformar a tese validada em um produto vendável e sustentável.</p>
        </div>
        {stages.filter(s => s.horizon === 'H2').map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx + 3) * 0.05 }}
            whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.02)' }}
            onClick={() => setSelectedStage(stage)}
            className={`p-10 space-y-8 cursor-pointer group transition-all min-h-[350px] flex flex-col justify-between border-ink/10
              ${idx !== 2 ? 'md:border-r' : ''}
              border-b md:border-b
            `}
          >
            <div className="flex items-start gap-6">
              <div className={`shrink-0 w-14 h-14 rounded-2xl ${stage.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                <stage.icon size={28} />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-start">
                  <p className={`font-mono text-[10px] font-bold tracking-widest uppercase ${stage.textColor}`}>{stage.subtitle}</p>
                  <span className="text-2xl font-black text-ink/5 group-hover:text-primary/10 transition-colors uppercase leading-none">{stage.horizon}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-none">{stage.title}</h3>
                <p className="text-sm text-ink/40 leading-relaxed group-hover:text-ink/60 transition-colors">{stage.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-ink/30 uppercase tracking-widest group-hover:text-primary transition-colors">
              Expandir Etapa <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}

        {/* Row H1 */}
        <div className="p-10 bg-surface/30 flex flex-col items-center text-center justify-center border-t md:border-t-0 md:border-r border-ink/10">
          <div className="w-24 h-24 rounded-full bg-ink flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6">H1</div>
          <p className="text-xs font-mono font-bold text-ink uppercase tracking-widest mb-2">ESCALA</p>
          <p className="text-sm font-black uppercase tracking-tight text-ink/80 leading-tight">Garantir a estabilidade, escalar as vendas e evoluir o produto continuamente.</p>
        </div>
        {stages.filter(s => s.horizon === 'H1').map((stage, idx) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx + 6) * 0.05 }}
            whileHover={{ backgroundColor: 'rgba(var(--primary-rgb), 0.02)' }}
            onClick={() => setSelectedStage(stage)}
            className={`p-10 space-y-8 cursor-pointer group transition-all min-h-[350px] flex flex-col justify-between border-ink/10
              ${idx !== 2 ? 'md:border-r' : ''}
              border-b md:border-b-0
            `}
          >
            <div className="flex items-start gap-6">
              <div className={`shrink-0 w-14 h-14 rounded-2xl ${stage.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                <stage.icon size={28} />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-start">
                  <p className={`font-mono text-[10px] font-bold tracking-widest uppercase ${stage.textColor}`}>{stage.subtitle}</p>
                  <span className="text-2xl font-black text-ink/5 group-hover:text-primary/10 transition-colors uppercase leading-none">{stage.horizon}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-none">{stage.title}</h3>
                <p className="text-sm text-ink/40 leading-relaxed group-hover:text-ink/60 transition-colors">{stage.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-ink/30 uppercase tracking-widest group-hover:text-primary transition-colors">
              Expandir Etapa <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Canva Modal / Overlay */}
      <AnimatePresence>
        {selectedStage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStage(null)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-7xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedStage(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface hover:bg-ink hover:text-white transition-all flex items-center justify-center z-10"
              >
                <Plus className="rotate-45" size={24} />
              </button>

              <div className="overflow-y-auto p-8 lg:p-16 space-y-16">
                <header className="flex flex-col md:flex-row justify-between items-start gap-10">
                  <div className="flex items-center gap-8">
                    <div className={`w-32 h-32 rounded-[40px] ${selectedStage.color} flex items-center justify-center text-white shadow-2xl`}>
                      <selectedStage.icon size={64} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">{selectedStage.title}</h2>
                      <p className="font-mono text-sm font-bold text-ink/30 uppercase tracking-widest">{selectedStage.subtitle} // {selectedStage.horizon}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-3">
                    <p className="text-[11px] font-mono text-ink/30 font-bold uppercase tracking-widest">ARTEFATO ESTRATÉGICO</p>
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-ink text-white rounded-2xl font-mono text-sm font-bold uppercase tracking-widest shadow-xl">
                      <ArrowRight size={18} className="text-primary" /> {selectedStage.artefatos[0]}
                    </div>
                  </div>
                </header>

                <div className="space-y-16">
                  <section className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-[2px] w-12 bg-primary" />
                      <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">DEFINIÇÃO DO CICLO</p>
                    </div>
                    <p className="text-3xl lg:text-4xl font-black text-ink/80 leading-[1.1] max-w-5xl">
                      {selectedStage.definition}
                    </p>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4 bg-accent-green/5 p-8 rounded-3xl border border-accent-green/10">
                      <p className="text-[11px] font-mono text-accent-green font-bold tracking-widest uppercase">PORTÃO DE ENTRADA</p>
                      <p className="text-lg font-black text-ink/80">{selectedStage.entrada}</p>
                    </div>
                    <div className="space-y-4 bg-primary/5 p-8 rounded-3xl border border-primary/10">
                      <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">PORTÃO DE SAÍDA</p>
                      <p className="text-lg font-black text-ink/80">{selectedStage.saida}</p>
                    </div>
                    <div className="space-y-4 bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
                      <p className="text-[11px] font-mono text-red-500 font-bold tracking-widest uppercase">RED FLAGS</p>
                      <ul className="space-y-2">
                        {selectedStage.redFlags.map((rf: string) => (
                          <li key={rf} className="text-sm font-bold text-red-500/80 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {rf}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-12 border-t border-ink/5">
                    <div className="space-y-6">
                      <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">// ETAPAS</p>
                      <ul className="space-y-3">
                        {selectedStage.etapas.map((e: string) => <li key={e} className="text-sm text-ink/60 flex items-center gap-3"><div className={`w-1.5 h-1.5 rounded-full ${selectedStage.color}`} /> {e}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">// ARTEFATOS</p>
                      <ul className="space-y-3">
                        {selectedStage.artefatos.map((a: string) => <li key={a} className="text-sm text-ink/60 flex items-center gap-3"><BookOpen size={16} className="text-primary" /> {a}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">// CHECKLIST</p>
                      <ul className="space-y-3">
                        {selectedStage.checklist.map((c: string) => <li key={c} className="text-sm text-ink/60 flex items-center gap-3"><div className="w-4 h-4 border-2 border-ink/10 rounded-md" /> {c}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <p className="text-[11px] font-mono text-primary font-bold tracking-widest uppercase">// RESPONSÁVEL</p>
                      <p className="text-sm font-black text-ink/80 uppercase tracking-tight">{selectedStage.responsavel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Handle navigation from Home cards
  const handleNavigate = (tab: string) => {
    if (tab === 'bruce') {
      setIsAssistantOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAssistant={() => setIsAssistantOpen(true)} 
      />
      <div className="flex flex-1">
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'inicio' && <HomeView onNavigate={handleNavigate} />}
              {activeTab === 'horizontes' && <HorizontesView />}
              {activeTab === 'catalogo' && <CatalogView />}
              {activeTab === 'config' && (
                <div className="p-20 text-center space-y-6">
                  <Settings size={64} className="mx-auto text-ink/10" />
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Configurações</h2>
                  <p className="text-ink/40">Acesse as diretrizes do Trillia Design System v4.0.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Assistant Trigger */}
      {!isAssistantOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            boxShadow: "0 20px 40px rgba(0, 78, 255, 0.3)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-10 right-10 w-24 h-24 bg-ink text-white rounded-[28px] shadow-2xl flex items-center justify-center z-40 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="grid grid-cols-2 gap-1.5">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-accent-green" 
              />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
            <span className="text-[8px] font-mono font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100 text-center leading-tight">
              BRUCE<br/>ASSISTENTE
            </span>
          </div>
        </motion.button>
      )}

      <BruceAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
}

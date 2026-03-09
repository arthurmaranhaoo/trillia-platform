/**
 * export_feedbacks.js
 * Extrai os feedbacks do Supabase e salva em um arquivo Excel local.
 */

const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórios no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportFeedbacks() {
    console.log('🚀 Iniciando exportação de feedbacks...');

    try {
        // 1. Buscar dados do Supabase
        const { data, error } = await supabase
            .from('feedbacks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            console.log('⚠️ Nenhum feedback encontrado para exportar.');
            return;
        }

        console.log(`📦 Encontrados ${data.length} feedbacks.`);

        // 2. Formatar dados para o Excel com cabeçalhos amigáveis
        const formattedData = data.map(item => ({
            'ID Registro': item.id,
            'Data de Envio': new Date(item.created_at).toLocaleString('pt-BR'),
            'Nome do Colaborador': item.nome,
            'E-mail Corporativo': item.email,
            'Tipo de Registro': item.categoria,
            'Sugestão / Detalhes': item.mensagem
        }));

        // 3. Criar a planilha
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(formattedData);

        // Ajustar largura das colunas (estilo premium)
        const wscols = [
            {wch: 12}, // ID
            {wch: 20}, // Data
            {wch: 25}, // Nome
            {wch: 30}, // E-mail
            {wch: 20}, // Categoria
            {wch: 60}, // Mensagem
        ];
        worksheet['!cols'] = wscols;

        xlsx.utils.book_append_sheet(workbook, worksheet, 'Feedback Labs');

        // 4. Salvar o arquivo na pasta data
        const exportPath = path.join(__dirname, '..', 'data', 'feedbacks_trillia.xlsx');
        xlsx.writeFile(workbook, exportPath);

        console.log('\n✨ Exportação Concluída com Sucesso!');
        console.log(`📍 Arquivo: ${exportPath}`);
        console.log('📊 Agora você pode analisar as novas possibilidades (Bugs, Produtos, Funcionalidades)!\n');
    } catch (err) {
        console.error('❌ Erro na exportação:', err.message);
    }
}

exportFeedbacks();

/**
 * cron_rag.cjs
 * Automação que roda o ingest_rag.cjs a cada 1 minuto.
 */

const { main } = require('./ingest_rag.cjs');

console.log("🕒 Cron RAG Iniciado (Intervalo: 1 minuto)");

async function runInterval() {
    console.log(`\n[${new Date().toLocaleString()}] 🔄 Verificando novos documentos na pasta data/docs...`);
    try {
        await main();
    } catch (err) {
        console.error("❌ Erro durante a execução automática:", err.message);
    }
    console.log("😴 Aguardando 1 minuto para a próxima verificação...");
}

// Roda imediatamente e depois a cada 1 minuto (60.000 ms)
runInterval();
setInterval(runInterval, 60 * 1000);

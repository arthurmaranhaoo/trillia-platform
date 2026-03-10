/**
 * cron_rag.cjs
 * Automação que roda o ingest_rag.cjs a cada 24 horas.
 */

const { main } = require('./ingest_rag.cjs');

console.log("🕒 Cron RAG Iniciado (Intervalo: 24 horas)");

async function runInterval() {
    console.log(`\n[${new Date().toLocaleString()}] 🔄 Verificando novos documentos na pasta data/docs...`);
    try {
        await main();
    } catch (err) {
        console.error("❌ Erro durante a execução automática:", err.message);
    }
    console.log("😴 Aguardando 24 horas para a próxima verificação...");
}

// Roda imediatamente e depois a cada 24 horas (86.400.000 ms)
runInterval();
setInterval(runInterval, 24 * 60 * 60 * 1000);

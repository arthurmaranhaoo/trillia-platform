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
    
    scheduleNextMidnightRun();
}

function scheduleNextMidnightRun() {
    const now = new Date();
    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Amanhã
        0, 0, 0, 0 // Meia-noite em ponto
    );

    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    console.log(`😴 Agendado: Próxima verificação de PDFs/PPTXs ocorrerá à meia-noite (em aprox. ${(msUntilMidnight / 1000 / 60 / 60).toFixed(2)} horas).`);

    setTimeout(() => {
        runInterval(); // Roda à meia-noite, e então se agenda de novo
    }, msUntilMidnight);
}

// Roda imediatamente no start do servidor, depois agenda para toda meia-noite
console.log("🚀 Iniciando motor de OCR (PDF/PPTX)...");
runInterval();

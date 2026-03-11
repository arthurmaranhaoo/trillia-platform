import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDb() {
    console.log("🔍 Consultando diretamente o banco de dados Supabase na nuvem...\n");
    
    const { data: pdfDocs, error: err1 } = await supabase
        .from('documents')
        .select('content, metadata')
        .eq('metadata->>source', 'relatorio_auditoria_h3.pdf');
        
    console.log("📄 RESULTADO DA TABELA DOCUMENTS (PDF):");
    console.log(JSON.stringify(pdfDocs, null, 2));
    console.log("\n----------------------------------------\n");

    const { data: pptxDocs, error: err2 } = await supabase
        .from('documents')
        .select('content, metadata')
        .eq('metadata->>source', 'pitch_deck_enterprise.pptx');
        
    console.log("📊 RESULTADO DA TABELA DOCUMENTS (PPTX):");
    console.log(JSON.stringify(pptxDocs, null, 2));
}

verifyDb();

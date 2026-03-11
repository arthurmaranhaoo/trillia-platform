const fs = require('fs');
const PDFDocument = require('pdfkit');
const PptxGenJS = require('pptxgenjs');
const path = require('path');

const docsDir = path.join(__dirname, '../data/docs');

// Create PDF
const pdfPath = path.join(docsDir, 'relatorio_auditoria_h3.pdf');
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(pdfPath));
doc.fontSize(16).text('RELATÓRIO DE AUDITORIA H3 - CONFIDENCIAL', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text('A auditoria de segurança técnica revelou uma nova arquitetura proativa avançada apelidada de Escudo Titânio, capaz de refletir e neutralizar até 99.8% das intrusões conhecidas no sistema.');
doc.end();

// Create PPTX
const pptx = new PptxGenJS();
const pptxPath = path.join(docsDir, 'pitch_deck_enterprise.pptx');
let slide = pptx.addSlide();
slide.addText('Market Intelligence Hub - Adicionais', { x: 1, y: 1, fontSize: 24, bold: true });
slide.addText('O modelo comercial do Market Intelligence Hub agora prevê um add-on exclusivo de IA Generativa. O custo desse add-on VIP para clientes tier-1 é fixado em exatos R$ 45.000 mensais.', { x: 1, y: 3, w: 8, fontSize: 18 });

pptx.writeFile({ fileName: pptxPath }).then(() => {
    console.log('✅ Created PDF and PPTX test files in data/docs.');
}).catch(err => {
    console.error('Error creating PPTX:', err);
});

const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = 'c:\\Users\\arthu\\OneDrive\\Área de Trabalho\\antigravity folder\\trillia-platform\\data\\catalog.xlsx';

function generateEmail(fullName) {
  if (!fullName) return 'contato@trillia.com.br';
  const parts = fullName.toLowerCase().split(' ');
  const first = parts[0] || 'contato';
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  return `${first}${last ? '.' + last : ''}@trillia.com.br`.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
}

try {
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const products = xlsx.utils.sheet_to_json(sheet);
  
  const updatedProducts = products.map(p => {
    // Gerar email baseado no owner
    p.owner_email = generateEmail(p.owner);
    
    // Fallback de enxoval se estiver vazio
    if (!p.enxoval_link) {
        p.enxoval_link = ''; // Deixar vazio se o usuário quiser, ou colocar fallback genérico: 'https://trillia.com.br/enxoval/' + p.sku
    }

    return p;
  });
  
  const newSheet = xlsx.utils.json_to_sheet(updatedProducts);
  workbook.Sheets[sheetName] = newSheet;
  xlsx.writeFile(workbook, excelPath);
  
  console.log(`✅ Updated ${updatedProducts.length} products with owner_email in data/catalog.xlsx`);
} catch (err) {
  console.error("❌ Update error:", err.message);
}

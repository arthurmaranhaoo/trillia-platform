const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = 'c:\\Users\\arthu\\OneDrive\\Área de Trabalho\\antigravity folder\\trillia-platform\\data\\catalog.xlsx';
const jsonPath = 'c:\\Users\\arthu\\OneDrive\\Área de Trabalho\\antigravity folder\\trillia-platform\\tmp\\catalog_data.json';

try {
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const products = xlsx.utils.sheet_to_json(sheet);
  
  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
  console.log(`✅ Exported ${products.length} products to tmp/catalog_data.json`);
} catch (err) {
  console.error("❌ Export error:", err.message);
}

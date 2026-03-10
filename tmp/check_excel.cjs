const xlsx = require('xlsx');
const path = require('path');

const excelPath = 'c:\\Users\\arthu\\OneDrive\\Área de Trabalho\\antigravity folder\\trillia-platform\\data\\catalog.xlsx';

try {
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  console.log("COLUNAS ENCONTRADAS:");
  console.log(JSON.stringify(data[0], null, 2));
  
  console.log("\nEXEMPLO DA PRIMEIRA LINHA:");
  console.log(JSON.stringify(data[1], null, 2));
} catch (err) {
  console.error("Erro ao ler a planilha:", err.message);
}

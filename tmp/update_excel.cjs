const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = 'c:\\Users\\arthu\\OneDrive\\Área de Trabalho\\antigravity folder\\trillia-platform\\data\\catalog.xlsx';

const ownerMapping = {
  "Ana": "Ana Silva",
  "Bruno": "Bruno Costa",
  "Carlos": "Carlos Santos",
  "Daniela": "Daniela Lima",
  "Eduardo": "Eduardo Rocha",
  "Fernanda": "Fernanda Oliveira",
  "Gustavo": "Gustavo Lima",
  "Helena": "Helena Souza",
  "Igor": "Igor Martins",
  "Gabriel": "Gabriel Silva",
  "Lucas": "Lucas Mendes",
  "Roberto": "Roberto Mendes"
};

const squadMapping = {
  "Alpha": "SQUAD ALPHA PRIME",
  "Beta": "SQUAD BETA NEXUS",
  "Gamma": "SQUAD GAMMA CORE",
  "Delta": "SQUAD DELTA FORCE",
  "Epsilon": "SQUAD EPSILON STRAT",
  "Zeta": "SQUAD ZETA VISION",
  "Eta": "SQUAD ETA SOLUTIONS",
  "Theta": "SQUAD THETA LABS",
  "Deep Dive": "SQUAD DEEP DIVE AI",
  "Quantum": "SQUAD QUANTUM COMPUTING"
};

try {
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const products = xlsx.utils.sheet_to_json(sheet);
  
  const updatedProducts = products.map(p => {
    // Fix Owner
    if (p.owner && !p.owner.includes(' ')) {
      p.owner = ownerMapping[p.owner] || p.owner + " Silva";
    }
    
    // Fix Squad
    if (squadMapping[p.squad]) {
      p.squad = squadMapping[p.squad];
    } else if (p.squad && !p.squad.startsWith('SQUAD ')) {
      p.squad = "SQUAD " + p.squad.toUpperCase();
    }
    
    return p;
  });
  
  const newSheet = xlsx.utils.json_to_sheet(updatedProducts);
  workbook.Sheets[sheetName] = newSheet;
  xlsx.writeFile(workbook, excelPath);
  
  console.log(`✅ Updated ${updatedProducts.length} products in data/catalog.xlsx`);
} catch (err) {
  console.error("❌ Update error:", err.message);
}

const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'data', 'catalog.xlsx');
try {
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);
    
    const agro = products.find(p => p.name && p.name.toUpperCase().includes('AGRO'));
    if (agro) {
        console.log('Product Found:', JSON.stringify(agro, null, 2));
    } else {
        console.log('AGRO not found.');
        console.log('Available names (first 10):', products.slice(0, 10).map(p => p.name));
    }
} catch (e) {
    console.error(e);
}

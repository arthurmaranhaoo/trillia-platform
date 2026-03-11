const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'data/catalog.xlsx');
try {
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);
    
    if (products.length > 0) {
        console.log('Columns:', Object.keys(products[0]));
        console.log('Sample Row:', JSON.stringify(products[0], null, 2));
    } else {
        console.log('No data found in sheet.');
    }
} catch (e) {
    console.error(e);
}

const xlsx = require('xlsx');

const workbook = xlsx.readFile('./dataset/APSI 25_5_26/08033142038_2024_Ganjil_A.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log("Sheet Name:", sheetName);
console.log("First 15 rows:");
console.log(data.slice(0, 15));

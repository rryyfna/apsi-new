const xlsx = require('xlsx');
const workbook = xlsx.readFile('./dataset/APSI 25_5_26/08033142038_2025_Ganjil_A.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
console.log("2025 Ganjil A - First 15 rows:");
console.log(data.slice(0, 15));

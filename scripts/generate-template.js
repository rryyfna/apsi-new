const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = XLSX.utils.book_new();

const cpmkData = [
  { 'Kode MK': '08033122045', 'Kode CPMK': 'CPMK-1', 'Deskripsi (ID)': 'Mampu memahami konsep dasar', 'Deskripsi (EN)': 'Able to understand basic concepts' },
  { 'Kode MK': '08033142021', 'Kode CPMK': 'CPMK-2', 'Deskripsi (ID)': 'Mampu mengaplikasikan teori', 'Deskripsi (EN)': 'Able to apply theory' }
];

const cplData = [
  { 'Kode CPL': 'CPL-1', 'Deskripsi (ID)': 'Sikap dan Tata Nilai', 'Deskripsi (EN)': 'Attitude and Values' },
  { 'Kode CPL': 'CPL-2', 'Deskripsi (ID)': 'Penguasaan Pengetahuan', 'Deskripsi (EN)': 'Knowledge Mastery' }
];

const cpmkSheet = XLSX.utils.json_to_sheet(cpmkData);
const cplSheet = XLSX.utils.json_to_sheet(cplData);

XLSX.utils.book_append_sheet(workbook, cpmkSheet, "CPMK");
XLSX.utils.book_append_sheet(workbook, cplSheet, "CPL");

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

XLSX.writeFile(workbook, path.join(publicDir, 'Template_Import_CPMK_CPL.xlsx'));
console.log('Template created successfully at public/Template_Import_CPMK_CPL.xlsx');

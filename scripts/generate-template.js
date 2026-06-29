const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function generateTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIAKAD';
  workbook.created = new Date();

  // Styling helpers
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004E98' } },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  const dataStyle = {
    alignment: { vertical: 'middle', wrapText: true },
    border: {
      top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
      left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
      bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
      right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
    }
  };

  // 1. CPMK Sheet
  const cpmkSheet = workbook.addWorksheet('CPMK', { views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }] });
  
  cpmkSheet.columns = [
    { header: 'Kode MK', key: 'kodeMk', width: 20 },
    { header: 'Kode CPMK', key: 'kodeCpmk', width: 15 },
    { header: 'Deskripsi (ID)', key: 'descId', width: 45 },
    { header: 'Deskripsi (EN)', key: 'descEn', width: 45 }
  ];

  cpmkSheet.getRow(1).height = 30;
  cpmkSheet.getRow(1).eachCell((cell) => {
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
    cell.alignment = headerStyle.alignment;
    cell.border = headerStyle.border;
  });

  const cpmkRows = [
    { kodeMk: '08033122045', kodeCpmk: 'CPMK-1', descId: 'Mampu memahami konsep dasar dan prinsip kerja', descEn: 'Able to understand basic concepts and working principles' },
    { kodeMk: '08033142021', kodeCpmk: 'CPMK-2', descId: 'Mampu mengaplikasikan teori ke dalam praktik', descEn: 'Able to apply theory into practice' }
  ];

  cpmkRows.forEach(data => {
    const row = cpmkSheet.addRow(data);
    row.eachCell((cell) => {
      cell.alignment = dataStyle.alignment;
      cell.border = dataStyle.border;
    });
  });

  // 2. CPL Sheet
  const cplSheet = workbook.addWorksheet('CPL', { views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }] });
  
  cplSheet.columns = [
    { header: 'Kode CPL', key: 'kodeCpl', width: 15 },
    { header: 'Deskripsi (ID)', key: 'descId', width: 45 },
    { header: 'Deskripsi (EN)', key: 'descEn', width: 45 }
  ];

  cplSheet.getRow(1).height = 30;
  cplSheet.getRow(1).eachCell((cell) => {
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
    cell.alignment = headerStyle.alignment;
    cell.border = headerStyle.border;
  });

  const cplRows = [
    { kodeCpl: 'CPL-1', descId: 'Menunjukkan sikap dan tata nilai yang berkarakter', descEn: 'Demonstrate attitude and character values' },
    { kodeCpl: 'CPL-2', descId: 'Menguasai konsep teoritis secara mendalam', descEn: 'Master theoretical concepts in depth' }
  ];

  cplRows.forEach(data => {
    const row = cplSheet.addRow(data);
    row.eachCell((cell) => {
      cell.alignment = dataStyle.alignment;
      cell.border = dataStyle.border;
    });
  });

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const filePath = path.join(publicDir, 'Template_Import_CPMK_CPL.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log('Polished template created successfully at public/Template_Import_CPMK_CPL.xlsx');
}

generateTemplate().catch(console.error);

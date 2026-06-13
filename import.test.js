const xlsx = require('xlsx');

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Locate the start of the data (Row starting with No, Nim, Mahasiswa)
  let headerRowIdx = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i] && data[i][0] === 'No' && data[i][1] === 'Nim') {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    throw new Error('Format tabel tidak ditemukan (Header No, Nim)');
  }

  // Row + 1 is the Component Names (UK1, UK2, etc)
  // Row + 2 is the Weights
  const weightsRow = data[headerRowIdx + 2];
  const weights = {
    tugas: weightsRow[3] || 0,
    uts: weightsRow[4] || 0,
    uas: weightsRow[5] || 0,
    partisipasi: weightsRow[6] || 0,
    proyek: weightsRow[7] || 0,
  };

  const students = [];
  // Row + 3 onwards is student data
  for (let i = headerRowIdx + 3; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) break; // Empty row or end of list

    students.push({
      nim: row[1],
      nama: row[2],
      nilai: {
        tugas: row[3] || 0,
        uts: row[4] || 0,
        uas: row[5] || 0,
        partisipasi: row[6] || 0,
        proyek: row[7] || 0,
      }
    });
  }

  return { weights, students };
}

// Test Run
try {
  console.log('Testing Excel Parse...');
  const result = parseExcel('./dataset/APSI 25_5_26/08033142038_2024_Ganjil_A.xlsx');
  
  // Assertion
  if (result.weights.tugas !== 30) throw new Error(`Test Failed: Expected tugas weight 30, got ${result.weights.tugas}`);
  if (result.students[0].nim !== 'I0321002') throw new Error(`Test Failed: Expected first student NIM I0321002, got ${result.students[0].nim}`);
  if (result.students[0].nilai.tugas !== 73.75) throw new Error(`Test Failed: Expected first student tugas 73.75, got ${result.students[0].nilai.tugas}`);

  console.log('✅ TEST PASSED!');
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('❌ TEST FAILED:', error);
  process.exit(1);
}

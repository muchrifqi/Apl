function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Handle preflight request
  if (e.method === 'OPTIONS') {
    return ContentService.createTextOutput()
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
  
  try {
    const ss = SpreadsheetApp.openById('14ZC8bQElzfvddIQa2L90ClcU5dk1I3zGzFXP5RhgcDQ');
    let result;
    
    if (e.postData && e.postData.contents) {
      const data = JSON.parse(e.postData.contents);
      if (data.action === 'saveRegistration') {
        result = saveRegistration(ss, data);
      }
      // Tambahkan action lainnya sesuai kebutuhan
    }
    
    return ContentService.createTextOutput(JSON.stringify(result || {success: false, message: 'No action specified'}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

// Fungsi saveRegistration dan lainnya tetap sama

// 2. CORE FUNCTIONS
function saveRegistration(ss, e) {
  const sheet = ss.getSheetByName('Registrasi');
  const data = JSON.parse(e.postData.contents);
  
  // Validasi data wajib
  const requiredFields = ['nama_lengkap', 'jenis_kelamin', 'tanggal_lahir', 'nama_ayah', 'nama_ibu', 'no_hp'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return responseError(`Field ${field} harus diisi`);
    }
  }

  const rowData = [
    new Date(),
    Utilities.getUuid(),
    data.nama_lengkap,
    data.jenis_kelamin,
    data.tempat_lahir,
    data.tanggal_lahir,
    data.alamat,
    data.nama_ayah,
    data.pekerjaan_ayah || '',
    data.nama_ibu,
    data.pekerjaan_ibu || '',
    data.no_hp,
    data.email || '',
    data.jenjang || '',
    JSON.stringify(data.dokumen || {})
  ];
  
  sheet.appendRow(rowData);
  
  return responseSuccess({
    registrationId: rowData[1],
    message: "Registrasi berhasil disimpan"
  });
}

function getStudents(ss) {
  const sheet = ss.getSheetByName('Registrasi');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const students = [];
  
  for (let i = 1; i < data.length; i++) {
    const student = {};
    for (let j = 0; j < headers.length; j++) {
      student[headers[j]] = data[i][j];
    }
    students.push({
      nama: student.nama_lengkap,
      jenjang: student.jenjang,
      orangTua: student.nama_ayah, // atau field lain yang sesuai
      telepon: student.no_hp
    });
  }
  
  return responseSuccess(students);
}

function uploadDocument(e) {
  const folder = DriveApp.getFolderById('12gC8ucVJMyRvQGjhOdtqVvc-lHQ2-Cfj');
  const blob = Utilities.newBlob(
    Utilities.base64Decode(e.postData.contents.split(',')[1]),
    e.parameter.mimeType,
    e.parameter.filename
  );
  
  const file = folder.createFile(blob);
  
  return responseSuccess({
    documentId: file.getId(),
    documentUrl: file.getUrl()
  });
}
// 3. TRANSACTION FUNCTIONS
function saveTransaction(ss, e) {
  const sheet = ss.getSheetByName('Transaksi');
  const data = JSON.parse(e.postData.contents);
  
  const rowData = [
    new Date(),
    Utilities.getUuid(),
    data.registrationId, // Link to registration
    data.nama_siswa,
    data.jenis_pembayaran,
    data.nominal,
    data.metode_pembayaran,
    data.keterangan || ''
  ];
  
  sheet.appendRow(rowData);
  
  return responseSuccess({
    transactionId: rowData[1],
    sheetName: 'Transaksi'
  });
}
// 4. HELPER FUNCTIONS
function checkDuplicate(ss, nis) {
  const sheet = ss.getSheetByName('Registrasi');
  const data = sheet.getDataRange().getValues();
  const nisColumnIndex = 2; // Adjust based on your sheet structure
  
  const isDuplicate = data.some(row => row[nisColumnIndex] === nis);
  
  return responseSuccess({
    isDuplicate: isDuplicate
  });
}

function responseSuccess(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function responseError(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      success: false, 
      message: message 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 5. TRIGGERS (Optional)
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Registration Tools')
    .addItem('Generate Reports', 'generateReports')
    .addToUi();
}

function generateReports() {
  // Custom report generation logic here
}
function saveRegistration(ss, e) {
    const sheet = ss.getSheetByName('Registrasi');
    const data = JSON.parse(e.postData.contents);
    
    // Validasi data wajib
    if(!data.nama_lengkap || !data.jenis_kelamin || !data.tanggal_lahir) {
        return responseError('Data wajib tidak lengkap');
    }
    
    const rowData = [
        new Date(),
        Utilities.getUuid(),
        data.nama_lengkap,
        data.jenis_kelamin,
        data.tempat_lahir,
        data.tanggal_lahir,
        data.alamat,
        data.nama_ayah,
        data.pekerjaan_ayah || '',
        data.nama_ibu,
        data.pekerjaan_ibu || '',
        data.no_hp,
        data.email || ''
    ];
    
    sheet.appendRow(rowData);
    
    return responseSuccess({
        registrationId: rowData[1],
        message: "Registrasi berhasil disimpan"
    });
}
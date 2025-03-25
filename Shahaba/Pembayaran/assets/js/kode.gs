// 1. MAIN FUNCTIONS
function doPost(e) {
  // Handle CORS preflight
  if (e.queryString === 'cors') {
    return ContentService.createTextOutput()
      .setMimeType(ContentService.MimeType.JSON)
      .append(JSON.stringify({}))
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  const action = e.parameter.action;
  const ss = SpreadsheetApp.openById('14ZC8bQElzfvddIQa2L90ClcU5dk1I3zGzFXP5RhgcDQ');
  
  try {
    let result;
    if (action === 'saveRegistration') {
      result = saveRegistration(ss, e);
    } else if (action === 'uploadDocument') {
      result = uploadDocument(e);
    } else {
      result = responseError('Invalid action');
    }
    
    // Tambahkan header CORS untuk response normal
    return result
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST');
      
  } catch (error) {
    return responseError(error.message)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

// Tambahkan doGet untuk handle preflight
function doGet(e) {
  if (e.parameter.action === 'checkDuplicate') {
    return checkDuplicate(SpreadsheetApp.openById('14ZC8bQElzfvddIQa2L90ClcU5dk1I3zGzFXP5RhgcDQ'), e.parameter.nis)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
  
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .append(JSON.stringify({}))
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

// 2. CORE FUNCTIONS
function saveRegistration(ss, e) {
  const sheet = ss.getSheetByName('Registrasi');
  const data = JSON.parse(e.postData.contents);
  
  // Prepare data row
  const rowData = [
    new Date(), // Timestamp
    Utilities.getUuid(), // Registration ID
    data.nama_lengkap,
    data.jenis_kelamin,
    data.tempat_lahir,
    data.tanggal_lahir,
    data.alamat,
    data.nama_ayah,
    data.pekerjaan_ayah,
    data.nama_ibu,
    data.pekerjaan_ibu,
    data.no_hp,
    data.email,
    data.jenjang || '', // Removed financial fields
    '', // Removed payment method
    '', // Removed financial notes
    JSON.stringify(data.dokumen || {}) // Store document metadata
  ];
  
  sheet.appendRow(rowData);
  
  return responseSuccess({
    registrationId: rowData[1],
    message: "Registration saved successfully"
  });
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
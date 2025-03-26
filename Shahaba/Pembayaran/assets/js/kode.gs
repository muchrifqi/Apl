// Google Apps Script
function doPost(e) {
  try {
    // Parse data yang diterima
    const data = JSON.parse(e.postData.contents);
    
    // Dapatkan spreadsheet aktif
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pendaftaran');
    if (!sheet) {
      throw new Error('Sheet "Pendaftaran" tidak ditemukan');
    }
    
    // Tambahkan data ke spreadsheet
    const timestamp = new Date();
    const row = [
      timestamp,
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
      data.akta_kelahiran,
      data.ktp_ortu,
      data.kk,
      data.foto,
      'Menunggu Verifikasi' // Status pendaftaran
    ];
    
    sheet.appendRow(row);
    
    // Kirim email notifikasi (opsional)
    sendNotificationEmail(data);
    
    // Return response sukses
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Data berhasil disimpan',
      timestamp: timestamp.toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return response error
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmail(data) {
  try {
    const recipient = data.email || 'mrifqi939@gmail.com'; // Ganti dengan email admin
    const subject = 'Pendaftaran Baru: ' + data.nama_lengkap;
    
    let body = `
      <h2>Pendaftaran Peserta Didik Baru</h2>
      <p>Berikut adalah data pendaftaran yang baru saja diterima:</p>
      
      <h3>Data Peserta Didik</h3>
      <ul>
        <li>Nama Lengkap: ${data.nama_lengkap}</li>
        <li>Jenis Kelamin: ${data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</li>
        <li>Tempat, Tanggal Lahir: ${data.tempat_lahir}, ${data.tanggal_lahir}</li>
        <li>Alamat: ${data.alamat}</li>
      </ul>
      
      <h3>Data Orang Tua</h3>
      <ul>
        <li>Nama Ayah: ${data.nama_ayah}</li>
        <li>Pekerjaan Ayah: ${data.pekerjaan_ayah || '-'}</li>
        <li>Nama Ibu: ${data.nama_ibu}</li>
        <li>Pekerjaan Ibu: ${data.pekerjaan_ibu || '-'}</li>
        <li>No. HP: ${data.no_hp}</li>
        <li>Email: ${data.email || '-'}</li>
      </ul>
      
      <h3>Lampiran Dokumen</h3>
      <ul>
        <li>Akta Kelahiran: ${data.akta_kelahiran || '-'}</li>
        <li>KTP Orang Tua: ${data.ktp_ortu || '-'}</li>
        <li>Kartu Keluarga: ${data.kk || '-'}</li>
        <li>Foto: ${data.foto || '-'}</li>
      </ul>
      
      <p>Silakan verifikasi data ini di sistem administrasi.</p>
    `;
    
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: body
    });
    
  } catch (error) {
    console.error('Gagal mengirim email notifikasi:', error);
  }
}
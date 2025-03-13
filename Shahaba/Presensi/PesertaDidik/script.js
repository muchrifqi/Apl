let isScanning = true;
const webAppUrl = 'https://script.google.com/macros/s/AKfycbwyYf2D42MHyKmAzywf6R_zWibg1B3Sius0Lcndfx25hd53ejxRgkerJrUvnJ6ZNZfb/exec'; // Ganti dengan URL Web App Anda

function playBeep() {
  const audio = new Audio('https://drive.google.com/file/d/1yg97S3NCIm-nomRGa2cx5jN8_4v5aKcC/view?usp=sharing'); // Ganti dengan URL file bip
  audio.play();
}

async function onScanSuccess(content) {
  if (!isScanning) return;

  isScanning = false;
  document.getElementById('result').innerText = 'Memproses...';

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'studentId=' + encodeURIComponent(content),
    });
    const result = await response.json();

    if (result.status === 'success') {
      playBeep();
      Swal.fire({
        title: 'Berhasil!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'Ok',
        timer: 3000, // Notifikasi akan hilang setelah 3 detik
        timerProgressBar: true, // Tampilkan progress bar
      }).then(() => {
        document.getElementById('start-button').style.display = 'block';
      });
      document.getElementById('result').innerText = result.message;
    } else {
      Swal.fire({
        title: 'Error!',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'Ok',
        timer: 2000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'Terjadi kesalahan saat memproses presensi.',
      icon: 'error',
      confirmButtonText: 'Ok',
      timer: 2000,
      timerProgressBar: true,
    });
  } finally {
    html5QrCode.stop();
  }
}

function startScan() {
  isScanning = true;
  document.getElementById('start-button').style.display = 'none';
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  ).catch(err => {
    document.getElementById('result').innerText = 'Error: ' + err;
  });
}

const html5QrCode = new Html5Qrcode("qr-reader");
startScan();

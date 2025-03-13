// Langsung kirim IP ke Apps Script tanpa menampilkan ke user
const buttons = document.querySelectorAll('button');
const statusMessage = document.getElementById('statusMessage');
const confirmation = document.getElementById('confirmation');
const confirmationMessage = document.getElementById('confirmationMessage');
const loading = document.getElementById('loading');

// Lokasi yang diizinkan
const allowedLocations = [
  { lat: -6.589108056587621, lng: 106.8218295143879 }, // Lokasi 1 (Shahaba Ruko Tanah Baru Residence)
  { lat: -6.592279, lng: 106.822581 } // Lokasi 2 (Shahaba Jl. Swadaya)
];

// Fungsi untuk menghitung jarak antara dua koordinat (dalam meter)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Fungsi untuk memeriksa lokasi pengguna
function checkLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation tidak didukung di browser ini.");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Cek apakah pengguna berada dalam radius 20 meter dari salah satu lokasi yang diizinkan
          const isWithinRadius = allowedLocations.some(
            (loc) => calculateDistance(userLat, userLng, loc.lat, loc.lng) <= 20
          );

          if (isWithinRadius) {
            resolve();
          } else {
            reject("Anda berada di luar lokasi yang diizinkan.");
          }
        },
        (error) => {
          // Pesan error jika pengguna tidak mengizinkan akses lokasi
          if (error.code === error.PERMISSION_DENIED) {
            reject("Anda tidak mengizinkan akses lokasi. Harap aktifkan izin lokasi.");
          } else {
            reject("Gagal mendapatkan lokasi: " + error.message);
          }
        }
      );
    }
  });
}

// Fungsi untuk mendapatkan alamat IP
async function getIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Gagal mendapatkan alamat IP:", error);
    return null;
  }
}

// Fungsi untuk memeriksa status tombol dari spreadsheet
async function getButtonStatus() {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbxiONB6ZxClTKwoD-GMJU2vp-rgdDFfEaFfAG3zyAqWchh_XWrsYDlqiX_2P12zNn0D2g/exec?action=getStatus`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gagal memeriksa status tombol:", error);
    return {};
  }
}

// Fungsi untuk menonaktifkan tombol berdasarkan status
async function updateButtonStatus() {
  const status = await getButtonStatus();
  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    const nama = button.innerText;
    const waktu = new Date().toLocaleTimeString();
    if (status[nama] === "Nonaktif") {
      button.disabled = true;
      button.innerText = `${nama} ✓`;
    }
  });
}

// Fungsi presensi
async function presensi(nama) {
  const { isConfirmed } = await Swal.fire({
    title: `Apakah Anda ${nama}?`,
    text: "Pendataan presensi tidak dapat diwakilkan.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: `Ya, Saya ${nama}`,
    cancelButtonText: "Kembali",
  });

  if (!isConfirmed) {
    return; // Batalkan jika pengguna memilih "Kembali"
  }

  const button = Array.from(buttons).find(btn => btn.innerText === nama);
  button.disabled = true;
  loading.style.display = 'block'; // Tampilkan loading indicator

  try {
    // Periksa lokasi pengguna
    await checkLocation();

    // Kirim data ke Google Apps Script
    const ip = await getIPAddress();
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbxiONB6ZxClTKwoD-GMJU2vp-rgdDFfEaFfAG3zyAqWchh_XWrsYDlqiX_2P12zNn0D2g/exec?action=presensi&nama=${encodeURIComponent(nama)}&ip=${encodeURIComponent(ip)}`
    );
    const result = await response.text();

    // Tampilkan pesan sukses dengan SweetAlert2
    await Swal.fire({
      icon: 'success',
      title: 'Presensi Berhasil',
      text: `Presensi ${nama} telah dicatat.`,
    });

    // Update tampilan tombol
    const waktu = new Date().toLocaleTimeString();
    button.innerText = `${nama} ✓`;
    confirmationMessage.innerText = `${nama} pukul ${waktu}`;
    confirmation.style.display = 'block';
    statusMessage.innerText = "";
  } catch (error) {
    // Tampilkan pesan error
    statusMessage.innerText = error;
    statusMessage.style.color = getComputedStyle(document.documentElement).getPropertyValue('--error-color');
    button.disabled = false;
  } finally {
    loading.style.display = 'none'; // Sembunyikan loading indicator
  }
}

// Periksa status tombol saat halaman dimuat
window.onload = async () => {
  await updateButtonStatus();
  // Periksa status tombol setiap 5 detik
  setInterval(updateButtonStatus, 5000);
};

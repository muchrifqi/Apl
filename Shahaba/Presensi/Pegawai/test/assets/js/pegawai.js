// Fungsi untuk login pegawai
async function loginPegawai(username, password) {
    try {
        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Gagal login:", error);
        return null;
    }
}

// Fungsi untuk mencatat ketidakhadiran
async function catatKetidakhadiran(nama, status, keterangan) {
    try {
        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec?action=absen&nama=${encodeURIComponent(nama)}&status=${encodeURIComponent(status)}&keterangan=${encodeURIComponent(keterangan)}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Gagal mencatat ketidakhadiran:", error);
        return null;
    }
}

// Fungsi untuk melihat slip gaji
async function lihatSlipGaji(nama, bulan) {
    try {
        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec?action=slipGaji&nama=${encodeURIComponent(nama)}&bulan=${encodeURIComponent(bulan)}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Gagal melihat slip gaji:", error);
        return null;
    }
}

// Event listener untuk form login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await loginPegawai(username, password);
    if (result && result.success) {
        window.location.href = 'dashboard.html';
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: 'Username atau password salah.',
        });
    }
});

// Event listener untuk form ketidakhadiran
document.getElementById('absenFormInput').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('status').value;
    const keterangan = document.getElementById('keterangan').value;

    const result = await catatKetidakhadiran(localStorage.getItem('nama'), status, keterangan);
    if (result && result.success) {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Ketidakhadiran berhasil dicatat.',
        });
        closeAbsenForm();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Gagal mencatat ketidakhadiran.',
        });
    }
});

// Event listener untuk form slip gaji
document.getElementById('slipGajiForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bulan = document.getElementById('bulan').value;

    const result = await lihatSlipGaji(localStorage.getItem('nama'), bulan);
    if (result && result.success) {
        document.getElementById('slipGajiContent').innerHTML = `<a href="${result.slipGajiUrl}" download>Download Slip Gaji</a>`;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Gagal memuat slip gaji.',
        });
    }
});

// Fungsi untuk membuka form ketidakhadiran
function openAbsenForm() {
    document.getElementById('absenForm').style.display = 'block';
}

// Fungsi untuk menutup form ketidakhadiran
function closeAbsenForm() {
    document.getElementById('absenForm').style.display = 'none';
}

// Fungsi untuk membuka modal slip gaji
function openSlipGaji() {
    document.getElementById('slipGajiModal').style.display = 'block';
}

// Fungsi untuk menutup modal slip gaji
function closeSlipGaji() {
    document.getElementById('slipGajiModal').style.display = 'none';
}

async function getDataPegawai() {
    try {
        const response = await fetch(
            `https://script.google.com/macros/s/APPS_SCRIPT_URL/exec?action=getPegawai`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
        return null;
    }
}


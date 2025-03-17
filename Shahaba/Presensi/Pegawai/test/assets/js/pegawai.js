console.log("File pegawai.js terload!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM sudah siap!");

    // Fungsi untuk login pegawai
    async function loginPegawai(username, password) {
        try {
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbxUHl8fI_XdSmdzEiuNjbq92_vlTooAbmG6MqXNWL3LTlCCRCRmRKP4PbOew9G9KWs/exec';
            const response = await fetch(`${scriptUrl}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Gagal login:", error);
            return null;
        }
    }

    // Event listener untuk form login
            const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault(); // Mencegah form submission default
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                console.log("Username:", username);
                console.log("Password:", password);

                const result = await loginPegawai(username, password);
                console.log("Response dari server:", result);

                if (result && result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Gagal',
                        text: result?.message || 'Username atau password salah.',
                    });
                }
            });
        } else {
            console.error("Form login tidak ditemukan!");
        }
    // Fungsi untuk mencatat ketidakhadiran
    async function catatKetidakhadiran(nama, status, keterangan) {
        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbxUHl8fI_XdSmdzEiuNjbq92_vlTooAbmG6MqXNWL3LTlCCRCRmRKP4PbOew9G9KWs/exec?action=absen&nama=${encodeURIComponent(nama)}&status=${encodeURIComponent(status)}&keterangan=${encodeURIComponent(keterangan)}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Gagal mencatat ketidakhadiran:", error);
            return null;
        }
    }

    // Event listener untuk form ketidakhadiran
    const absenForm = document.getElementById('absenFormInput');
    console.log("Elemen absenFormInput:", absenForm); // Debugging
    if (absenForm) {
        absenForm.addEventListener('submit', async (e) => {
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
    } else {
        console.error("Form absen tidak ditemukan!");
    }

    // Fungsi untuk melihat slip gaji
    async function lihatSlipGaji(nama, bulan) {
        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbxUHl8fI_XdSmdzEiuNjbq92_vlTooAbmG6MqXNWL3LTlCCRCRmRKP4PbOew9G9KWs/exec?action=slipGaji&nama=${encodeURIComponent(nama)}&bulan=${encodeURIComponent(bulan)}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Gagal melihat slip gaji:", error);
            return null;
        }
    }

    // Event listener untuk form slip gaji
    const slipGajiForm = document.getElementById('slipGajiForm');
    if (slipGajiForm) {
        slipGajiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const bulan = document.getElementById('bulan').value;

            const result = await lihatSlipGaji(localStorage.getItem('nama'), bulan);
            if (result && result.success) {
                document.getElementById('slipGajiContent').innerHTML = `
                    <p><strong>Gaji Pokok:</strong> ${result.data.gajiPokok}</p>
                    <p><strong>Uang Makan:</strong> ${result.data.uangMakan}</p>
                    <p><strong>Transport:</strong> ${result.data.transport}</p>
                    <p><strong>Tunjangan 1:</strong> ${result.data.tunjangan1}</p>
                    <p><strong>Tunjangan 2:</strong> ${result.data.tunjangan2}</p>
                    <p><strong>Tunjangan 3:</strong> ${result.data.tunjangan3}</p>
                    <p><strong>Tunjangan 4:</strong> ${result.data.tunjangan4}</p>
                    <p><strong>Tunjangan 5:</strong> ${result.data.tunjangan5}</p>
                    <p><strong>Potongan:</strong> ${result.data.potongan}</p>
                    <p><strong>Total Gaji:</strong> ${result.data.totalGaji}</p>
                `;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Gagal memuat slip gaji.',
                });
            }
        });
    } else {
        console.error("Form slip gaji tidak ditemukan!");
    }

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

    // Fungsi untuk membuka halaman data pegawai (admin)
    function openDataPegawai() {
        window.location.href = 'data-pegawai.html'; // Ganti dengan URL yang sesuai
    }

    // Fungsi untuk membuka halaman pengaturan gaji (admin)
    function openPengaturanGaji() {
        window.location.href = 'pengaturan-gaji.html'; // Ganti dengan URL yang sesuai
    }

    // Fungsi untuk mengontrol floating button dan menu
    const floatingMenuButton = document.getElementById('floatingMenuButton');
    const floatingMenu = document.getElementById('floatingMenu');

    if (floatingMenuButton && floatingMenu) {
        floatingMenuButton.addEventListener('click', () => {
            floatingMenu.classList.toggle('active');
        });

        // Sembunyikan menu saat mengklik di luar menu
        document.addEventListener('click', (event) => {
            if (!floatingMenu.contains(event.target) && !floatingMenuButton.contains(event.target)) {
                floatingMenu.classList.remove('active');
            }
        });
    } else {
        console.error("Elemen floating menu tidak ditemukan!");
    }

    // Event listener untuk tombol "Lokasi Presisi" di dalam menu
    const floatingLocationButton = document.getElementById('floatingLocationButton');
    if (floatingLocationButton) {
        floatingLocationButton.addEventListener('click', async () => {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const nama = localStorage.getItem('nama');
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Kirim lokasi ke Apps Script (jika diperlukan)
                const result = await simpanLokasi(nama, latitude, longitude);
                if (result && result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Lokasi berhasil disimpan.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: 'Gagal menyimpan lokasi.',
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal mendapatkan lokasi.',
                });
            }
        });
    } else {
        console.error("Tombol lokasi presisi tidak ditemukan!");
    }

    // Fungsi untuk menyimpan lokasi (opsional)
    async function simpanLokasi(nama, latitude, longitude) {
        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbxUHl8fI_XdSmdzEiuNjbq92_vlTooAbmG6MqXNWL3LTlCCRCRmRKP4PbOew9G9KWs/exec?action=simpanLokasi&nama=${encodeURIComponent(nama)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Gagal menyimpan lokasi:", error);
            return null;
        }
    }
});
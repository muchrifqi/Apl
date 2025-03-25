// pendaftaran.js
document.addEventListener('DOMContentLoaded', function() {
    // Validasi form sebelum submit
    document.getElementById('formPendaftaran').addEventListener('submit', function(e) {
        e.preventDefault();
        handleSubmit();
    });
});

async function handleSubmit() {
    // Validasi form
    if (!validateForm()) {
        return;
    }

    try {
        // Tampilkan loading
        Swal.fire({
            title: 'Memproses...',
            html: 'Sedang menyimpan data pendaftaran',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Kumpulkan data form
        const formData = collectFormData();

        // Kirim data ke Google Apps Script
        const response = await sendToGoogleAppsScript(formData);

        // Tampilkan hasil
        if (response.result === 'success') {
            Swal.fire({
                title: 'Sukses!',
                text: 'Pendaftaran berhasil disimpan',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                resetForm();
            });
        } else {
            throw new Error(response.message || 'Gagal menyimpan data');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: error.message || 'Terjadi kesalahan saat menyimpan data',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function validateForm() {
    // Validasi field required
    const requiredFields = [
        'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'alamat',
        'nama_ayah', 'nama_ibu', 'no_hp',
        'akta_kelahiran', 'ktp_ortu', 'kk'
    ];

    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            Swal.fire({
                title: 'Perhatian!',
                text: `Field ${field.labels[0].textContent} harus diisi`,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            field.focus();
            return false;
        }
    }

    // Validasi email jika diisi
    const email = document.getElementById('email').value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.fire({
            title: 'Perhatian!',
            text: 'Format email tidak valid',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        document.getElementById('email').focus();
        return false;
    }

    // Validasi nomor HP
    const noHp = document.getElementById('no_hp').value;
    if (!/^[0-9]{10,13}$/.test(noHp)) {
        Swal.fire({
            title: 'Perhatian!',
            text: 'Nomor HP harus 10-13 digit angka',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        document.getElementById('no_hp').focus();
        return false;
    }

    // Validasi file upload
    const fileFields = ['akta_kelahiran', 'ktp_ortu', 'kk', 'foto'];
    for (const fieldId of fileFields) {
        const field = document.getElementById(fieldId);
        if (field.required && !field.files[0]) {
            Swal.fire({
                title: 'Perhatian!',
                text: `File ${field.labels[0].textContent} harus diupload`,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return false;
        }
    }

    return true;
}

function collectFormData() {
    const formData = {
        // Data peserta didik
        nama_lengkap: document.getElementById('nama_lengkap').value,
        jenis_kelamin: document.getElementById('jenis_kelamin').value,
        tempat_lahir: document.getElementById('tempat_lahir').value,
        tanggal_lahir: document.getElementById('tanggal_lahir').value,
        alamat: document.getElementById('alamat').value,
        
        // Data orang tua
        nama_ayah: document.getElementById('nama_ayah').value,
        pekerjaan_ayah: document.getElementById('pekerjaan_ayah').value,
        nama_ibu: document.getElementById('nama_ibu').value,
        pekerjaan_ibu: document.getElementById('pekerjaan_ibu').value,
        no_hp: document.getElementById('no_hp').value,
        email: document.getElementById('email').value,
        
        // Info lampiran (hanya nama file, file sebenarnya akan diupload terpisah)
        akta_kelahiran: document.getElementById('akta_kelahiran').files[0]?.name || '',
        ktp_ortu: document.getElementById('ktp_ortu').files[0]?.name || '',
        kk: document.getElementById('kk').files[0]?.name || '',
        foto: document.getElementById('foto').files[0]?.name || ''
    };

    return formData;
}
const maxSize = 2 * 1024 * 1024; // 2MB
if (field.files[0] && field.files[0].size > maxSize) {
    Swal.fire({
        title: 'Perhatian!',
        text: `Ukuran file ${field.labels[0].textContent} terlalu besar (maks 2MB)`,
        icon: 'warning',
        confirmButtonText: 'OK'
    });
    return false;
}

async function sendToGoogleAppsScript(formData) {
    // Ganti dengan URL deployment Google Apps Script Anda
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbz96b87D1nnqoFc1vjUxa18dJnQRbN2_pFnCk81inGtlHzjuRxaU86144S94ZkvEEQ/exec';
    
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'no-cors' // Penting untuk Google Apps Script
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Gagal mengirim data ke server');
    }
}
function resetForm() {
    Swal.fire({
        title: 'Reset Form?',
        text: 'Semua data yang telah diisi akan dihapus',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Reset',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('formPendaftaran').reset();
        }
    });
}

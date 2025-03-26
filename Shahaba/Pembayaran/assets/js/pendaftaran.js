// pendaftaran.js
document.addEventListener('DOMContentLoaded', function() {
    // Setup form submission
    const form = document.getElementById('formPendaftaran');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleSubmit();
    });

    // Setup file input event listeners
    setupFileInputs();
});

function setupFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            const fileInfo = this.nextElementSibling;
            
            if (file) {
                fileInfo.textContent = `File: ${file.name} (${formatFileSize(file.size)})`;
                fileInfo.style.color = '#2e7d32';
            } else {
                fileInfo.textContent = `Format: ${this.accept.replace(/\./g, '').replace(/,/g, '/')} (Maks. 2MB)`;
                fileInfo.style.color = '';
            }
        });
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

async function handleSubmit() {
    try {
        // Validasi form
        if (!validateForm()) {
            return;
        }

        // Tampilkan loading
        Swal.fire({
            title: 'Memproses...',
            html: 'Sedang menyimpan data pendaftaran',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Kumpulkan data form dan file
        const formData = await collectFormData();

        // Kirim data ke server
        const response = await sendToGoogleAppsScript(formData);

        // Tampilkan hasil
        if (response.result === 'success') {
            await Swal.fire({
                title: 'Sukses!',
                text: 'Pendaftaran berhasil disimpan',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            resetForm();
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
            showValidationError(`Field ${field.labels[0].textContent} harus diisi`, field);
            return false;
        }
    }

    // Validasi email jika diisi
    const email = document.getElementById('email').value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showValidationError('Format email tidak valid', document.getElementById('email'));
        return false;
    }

    // Validasi nomor HP
    const noHp = document.getElementById('no_hp').value;
    if (!/^[0-9]{10,13}$/.test(noHp)) {
        showValidationError('Nomor HP harus 10-13 digit angka', document.getElementById('no_hp'));
        return false;
    }

    // Validasi tanggal lahir
    const tanggalLahir = new Date(document.getElementById('tanggal_lahir').value);
    const today = new Date();
    if (tanggalLahir >= today) {
        showValidationError('Tanggal lahir harus sebelum hari ini', document.getElementById('tanggal_lahir'));
        return false;
    }

    // Validasi file upload
    const fileFields = ['akta_kelahiran', 'ktp_ortu', 'kk', 'foto'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    for (const fieldId of fileFields) {
        const field = document.getElementById(fieldId);
        if (field.required && !field.files[0]) {
            showValidationError(`File ${field.labels[0].textContent} harus diupload`, field);
            return false;
        }
        
        if (field.files[0] && field.files[0].size > maxSize) {
            showValidationError(`Ukuran file ${field.labels[0].textContent} terlalu besar (maks 2MB)`, field);
            return false;
        }
    }

    return true;
}

function showValidationError(message, field) {
    Swal.fire({
        title: 'Perhatian!',
        text: message,
        icon: 'warning',
        confirmButtonText: 'OK'
    }).then(() => {
        if (field) {
            field.focus();
            if (field.scrollIntoView) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

async function collectFormData() {
    const form = document.getElementById('formPendaftaran');
    const formData = new FormData(form);
    
    // Konversi FormData ke object biasa untuk Google Apps Script
    const data = {};
    formData.forEach((value, key) => {
        // Untuk file, simpan nama dan ukuran saja
        if (value instanceof File) {
            data[key] = {
                name: value.name,
                size: value.size,
                type: value.type
            };
        } else {
            data[key] = value;
        }
    });
    
    return data;
}

async function sendToGoogleAppsScript(formData) {
    // Ganti dengan URL deployment Google Apps Script Anda
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxhBmEFqnD-eaejRNAoSIbNui71TPTlb6HKJz6XeAlVWzQJETqEgA6NLS5LM0npyvIg/exec';
    
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Gagal mengirim data ke server: ' + error.message);
    }
}

function resetForm() {
    document.getElementById('formPendaftaran').reset();
    
    // Reset file info text
    const fileInfos = document.querySelectorAll('.file-info');
    fileInfos.forEach(info => {
        const input = info.previousElementSibling;
        info.textContent = `Format: ${input.accept.replace(/\./g, '').replace(/,/g, '/')} (Maks. 2MB)`;
        info.style.color = '';
    });
}
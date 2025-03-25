// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function collectFormData(selector) {
    const data = {};
    const elements = document.querySelectorAll(`${selector} input, ${selector} select, ${selector} textarea`);
    
    elements.forEach(el => {
        if (el.id && !el.classList.contains('nominal-tagihan') && !el.classList.contains('jenis-tagihan')) {
            data[el.id] = el.value;
        }
    });
    
    return data;
}

async function uploadFiles() {
    const files = [
        document.getElementById('akta_kelahiran').files[0],
        document.getElementById('ktp_ortu').files[0],
        document.getElementById('kk').files[0],
        document.getElementById('foto').files[0]
    ].filter(file => file);
    
    const uploadPromises = files.map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const formData = {
                    action: 'uploadDocument',
                    filename: file.name,
                    mimeType: file.type,
                    file: e.target.result.split(',')[1]
                };
                
                fetch('https://script.google.com/macros/s/AKfycbznj4FeWebdRPdC4cQ51HAkuPuEAgwxM8elDvY9YWzafRlWmFrkxRrivk73tBUnVBze/exec', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(resolve)
                .catch(resolve);
            };
            reader.readAsDataURL(file);
        });
    });
    
    return Promise.all(uploadPromises);
}

async function simpanData(dokumen = {}) {
    const formData = {
        ...collectFormData('#formPendaftaran'),
        dokumen,
        action: 'saveRegistration'
    };
    
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbznj4FeWebdRPdC4cQ51HAkuPuEAgwxM8elDvY9YWzafRlWmFrkxRrivk73tBUnVBze/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function resetForm() {
    document.getElementById('formPendaftaran').reset();
}

async function handleSubmit() {
    if (!document.getElementById('formPendaftaran').checkValidity()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Harap isi semua field yang wajib diisi!',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    try {
        Swal.fire({
            title: 'Menyimpan data...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Upload file terlebih dahulu
        const uploadResults = await uploadFiles();
        const dokumen = {};
        
        uploadResults.forEach((result, index) => {
            if (result && result.success) {
                const fieldName = ['akta_kelahiran', 'ktp_ortu', 'kk', 'foto'][index];
                dokumen[fieldName] = {
                    id: result.data.documentId,
                    url: result.data.documentUrl
                };
            }
        });
        
        // Simpan data pendaftaran
        const result = await simpanData(dokumen);
        
        Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Pendaftaran berhasil disimpan',
            confirmButtonText: 'OK'
        });
        
        resetForm();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Terjadi kesalahan saat menyimpan data: ' + error.message,
            confirmButtonText: 'OK'
        });
    }
}
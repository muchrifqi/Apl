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
                
                fetch('https://script.google.com/macros/s/AKfycbzRItuBaUHEDAsNSu1nuE1k7klUvpy0fyVmhiR7E-kMaq_qNN90tKo2u6vtzKBIq5Pz/exec', {
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

async function simpanData() {
    const formData = {
        ...collectFormData('#formPendaftaran'),
        action: 'saveRegistration'
    };
    
    try {
        // Gunakan URL deployment Google Apps Script yang benar
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbzRItuBaUHEDAsNSu1nuE1k7klUvpy0fyVmhiR7E-kMaq_qNN90tKo2u6vtzKBIq5Pz/exec';
        
        // Tambahkan timestamp untuk menghindari cache
        const url = `${scriptUrl}?timestamp=${new Date().getTime()}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            redirect: 'follow' // Penting untuk Google Apps Script
        });
        
        // Handle redirect manual jika diperlukan
        if (response.redirected) {
            const redirectedResponse = await fetch(response.url);
            return await redirectedResponse.json();
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function handleSubmit() {
    try {
        await Swal.fire({
            title: 'Menyimpan data...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        const result = await simpanData();
        
        await Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: result.message || 'Data berhasil disimpan',
            confirmButtonText: 'OK'
        });
        
        resetForm();
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Gagal menyimpan data',
            confirmButtonText: 'OK'
        });
    }
}
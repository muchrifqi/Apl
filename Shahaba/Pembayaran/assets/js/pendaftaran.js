// Format Rupiah (jika diperlukan)
function formatRupiah(angka) {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Kumpulkan data form
function collectFormData(selector) {
    const data = {};
    const elements = document.querySelectorAll(`${selector} input, ${selector} select, ${selector} textarea`);
    
    elements.forEach(el => {
        if (el.id) {
            data[el.id] = el.value;
        }
    });
    
    return data;
}

// Reset form
function resetForm() {
    document.getElementById('formPendaftaran').reset();
}

// Handle upload file
async function uploadFiles() {
    const files = [
        document.getElementById('akta_kelahiran').files[0],
        document.getElementById('ktp_ortu').files[0],
        document.getElementById('kk').files[0],
        document.getElementById('foto').files[0]
    ].filter(file => file);
    
    try {
        const uploadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const response = await fetch('https://script.google.com/macros/s/AKfycbz2ZnhFeXB0k2SUdocCCfFxTO6soPceAjw04ogOv2hX2Ix444GJQ2xMBoPej0ZvAmQQ/exec', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                action: 'uploadDocument',
                                filename: file.name,
                                mimeType: file.type,
                                file: e.target.result.split(',')[1]
                            })
                        });
                        
                        const result = await response.json();
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error(`Gagal membaca file ${file.name}`));
                reader.readAsDataURL(file);
            });
        });
        
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error upload:', error);
        throw error;
    }
}

// Simpan data utama
async function simpanData(dokumen = {}) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbz2ZnhFeXB0k2SUdocCCfFxTO6soPceAjw04ogOv2hX2Ix444GJQ2xMBoPej0ZvAmQQ/exec', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                action: 'saveRegistration',
                ...collectFormData('#formPendaftaran'),
                dokumen: dokumen
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error simpan:', error);
        throw error;
    }
}

// Handle submit
async function handleSubmit() {
    try {
        const swalInstance = Swal.fire({
            title: 'Menyimpan Data',
            html: 'Sedang memproses data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // 1. Upload file
        const uploadResults = await uploadFiles();
        
        // 2. Kumpulkan metadata dokumen
        const dokumen = uploadResults.reduce((acc, result, index) => {
            const fieldNames = ['akta_kelahiran', 'ktp_ortu', 'kk', 'foto'];
            if(result.success) {
                acc[fieldNames[index]] = {
                    id: result.data.documentId,
                    url: result.data.documentUrl
                };
            }
            return acc;
        }, {});
        
        // 3. Simpan data registrasi
        const result = await simpanData(dokumen);
        
        // 4. Tampilkan hasil
        await Swal.fire({
            icon: result.success ? 'success' : 'error',
            title: result.success ? 'Berhasil!' : 'Gagal!',
            text: result.message,
            confirmButtonText: 'OK'
        });
        
        if(result.success) resetForm();
        
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error Sistem',
            text: error.message,
            confirmButtonText: 'OK'
        });
    } finally {
        Swal.close();
    }
}
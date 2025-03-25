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

// Fungsi utama yang diperbaiki
async function simpanData(dokumen = {}) {
    const formData = {
        ...collectFormData('#formPendaftaran'),
        dokumen,
        action: 'saveRegistration'
    };
    
    try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbz2ZnhFeXB0k2SUdocCCfFxTO6soPceAjw04ogOv2hX2Ix444GJQ2xMBoPej0ZvAmQQ/exec';
        
        // Tambahkan timestamp untuk menghindari cache
        const url = `${scriptUrl}?timestamp=${new Date().getTime()}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            redirect: 'follow'
        });

        // Handle redirect manual jika diperlukan
        if (response.redirected) {
            const redirectedResponse = await fetch(response.url);
            return await redirectedResponse.json();
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Gagal menyimpan data');
        }
        
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Fungsi handleSubmit yang diperbaiki
async function handleSubmit() {
    try {
        // Tampilkan loading indicator
        const swalInstance = Swal.fire({
            title: 'Menyimpan data...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // 1. Upload file terlebih dahulu
        const uploadResults = await uploadFiles();
        
        // 2. Kumpulkan metadata dokumen
        const dokumen = {};
        uploadResults.forEach((result, index) => {
            if (result && result.success) {
                const fieldNames = ['akta_kelahiran', 'ktp_ortu', 'kk', 'foto'];
                dokumen[fieldNames[index]] = {
                    id: result.data.documentId,
                    url: result.data.documentUrl
                };
            }
        });
        
        // 3. Simpan data pendaftaran
        const result = await simpanData(dokumen);
        
        // 4. Tampilkan hasil
        await Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: result.message || 'Data berhasil disimpan',
            confirmButtonText: 'OK'
        });
        
        // 5. Reset form jika sukses
        if (result.success) {
            resetForm();
        }
        
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Terjadi kesalahan saat menyimpan data',
            confirmButtonText: 'OK'
        });
    } finally {
        Swal.close();
    }
}
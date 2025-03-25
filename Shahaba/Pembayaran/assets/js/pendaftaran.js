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
// Debug SweetAlert
console.log('SweetAlert available:', typeof Swal !== 'undefined');

// Fallback jika SweetAlert gagal dimuat
if (typeof Swal === 'undefined') {
    console.error('SweetAlert2 not loaded! Using fallback alerts');
    window.Swal = {
        fire: function(options) {
            alert(options.title + '\n' + (options.text || ''));
            return Promise.resolve({ isConfirmed: true });
        },
        showLoading: function() {
            console.log('Loading...');
        },
        close: function() {
            console.log('Closing alert');
        },
        isVisible: function() {
            return false;
        }
    };
}
async function simpanData() {
    const formData = {
        ...collectFormData('#formPendaftaran'),
        action: 'saveRegistration'
    };
    
    try {
        // Dapatkan token OAuth 2.0 (implementasi tergantung pada sistem auth Anda)
        const token = await getAuthToken();
        
        const scriptId = 'AKfycbyGwc5Cmj1nB1-wMecx_qNv4zI7bojRERlIDrVcS6AYagLHf4tAoApVjR439xw6gKE2';
        const url = `https://script.googleapis.com/v1/scripts/${scriptId}:run`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                function: 'saveRegistration',
                parameters: [formData],
                devMode: true
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error.message);
        }
        
        return result.response.result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

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
                        const formData = {
                            action: 'uploadDocument',
                            filename: file.name,
                            mimeType: file.type,
                            file: e.target.result.split(',')[1]
                        };
                        
                        const response = await fetch('https://script.google.com/macros/s/AKfycbyGwc5Cmj1nB1-wMecx_qNv4zI7bojRERlIDrVcS6AYagLHf4tAoApVjR439xw6gKE2/exec', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData),
                            redirect: 'follow'
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Upload failed for ${file.name}`);
                        }
                        
                        const result = await response.json();
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
                reader.readAsDataURL(file);
            });
        });
        
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error in uploadFiles:', error);
        throw error;
    }
}

async function handleSubmit() {
    // Tutup semua SweetAlert yang mungkin masih terbuka
    Swal.close();
    
    try {
        // Tampilkan loading indicator
        const swalInstance = Swal.fire({
            title: 'Menyimpan data...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                // Bersihkan timer jika ada
                clearTimeout(window.swalTimeout);
            }
        });

        // Timeout fallback (8 detik)
        window.swalTimeout = setTimeout(() => {
            if (Swal.isVisible()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Memakan waktu lebih lama',
                    text: 'Proses penyimpanan masih berjalan...',
                    confirmButtonText: 'OK'
                });
            }
        }, 8000);

        // Upload file terlebih dahulu
        const uploadResults = await uploadFiles().catch(error => {
            throw new Error(`Gagal mengunggah file: ${error.message}`);
        });

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
        const result = await simpanData(dokumen).catch(error => {
            throw new Error(`Gagal menyimpan data: ${error.message}`);
        });

        // Tutup loading indicator
        await swalInstance;
        Swal.close();

        // Tampilkan hasil sukses
        await Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: result.message || 'Pendaftaran berhasil disimpan',
            confirmButtonText: 'OK'
        });

        resetForm();
    } catch (error) {
        // Pastikan semua SweetAlert ditutup sebelum menampilkan error
        Swal.close();
        
        console.error('Error:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Terjadi kesalahan saat menyimpan data',
            confirmButtonText: 'OK'
        });
    }
}
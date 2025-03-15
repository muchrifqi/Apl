# Sistem Presensi Shahaba

Sistem presensi online untuk pegawai Shahaba SD & Prasekolah. Sistem ini memungkinkan pegawai untuk melakukan presensi dengan memastikan lokasi mereka berada dalam radius yang diizinkan. Sistem ini juga dilengkapi dengan fitur pengumuman yang dapat diperbarui oleh admin.

## Fitur

- **Presensi Pegawai**: Pegawai dapat melakukan presensi dengan menekan tombol yang sesuai dengan nama mereka. Sistem akan memeriksa lokasi pengguna sebelum mencatat presensi.
- **Validasi Lokasi**: Sistem memastikan bahwa presensi hanya dapat dilakukan jika pengguna berada dalam radius 20 meter dari lokasi yang diizinkan.
- **Pengumuman**: Admin dapat memperbarui pengumuman yang akan ditampilkan di halaman utama.
- **Tombol Presisi Lokasi**: Tombol melayang untuk memperbarui lokasi dengan akurasi tinggi dan menghapus cache lokasi lama.
- **Status Tombol**: Tombol presensi akan dinonaktifkan jika presensi sudah dilakukan.

## Teknologi yang Digunakan

- **HTML**: Struktur dasar halaman web.
- **CSS**: Styling dan animasi untuk tampilan yang menarik.
- **JavaScript**: Logika dan interaktivitas halaman web.
- **Google Apps Script**: Backend untuk menangani presensi dan pengumuman.
- **SweetAlert2**: Library untuk menampilkan popup konfirmasi dan pesan.

## Cara Menggunakan

1. **Presensi Pegawai**:
   - Buka halaman presensi.
   - Tekan tombol dengan nama Anda.
   - Izinkan akses lokasi jika diminta.
   - Jika lokasi Anda valid, presensi akan dicatat.

2. **Memperbarui Pengumuman (Admin)**:
   - Tekan tombol "Edit Pengumuman (Admin)".
   - Masukkan password admin.
   - Masukkan pengumuman baru dan tekan OK.

3. **Tombol Presisi Lokasi**:
   - Tekan tombol melayang di sudut kanan bawah untuk memperbarui lokasi dengan akurasi tinggi.

## Struktur File

- **index.html**: File utama yang berisi struktur halaman web.
- **style.css**: File CSS untuk styling halaman web.
- **script.js**: File JavaScript yang berisi logika dan interaktivitas halaman web.

Kontribusi
Jika Anda ingin berkontribusi pada proyek ini, silakan buka issue atau pull request di repositori GitHub.

© 2025 Shahaba SD & Prasekolah

### Penjelasan:
- **Fitur**: Menjelaskan fitur-fitur utama yang tersedia dalam sistem.
- **Teknologi yang Digunakan**: Menjelaskan teknologi yang digunakan dalam pengembangan proyek.
- **Cara Menggunakan**: Panduan singkat tentang cara menggunakan sistem.
- **Struktur File**: Menjelaskan struktur file dalam proyek.
- **Instalasi**: Panduan singkat untuk menginstal dan menjalankan proyek.
- **Kontribusi**: Informasi tentang cara berkontribusi pada proyek.

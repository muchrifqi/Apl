# Sistem Pendataan Presensi Pegawai Shahaba Ikhwan

Aplikasi ini adalah sistem pendataan presensi pegawai untuk Shahaba Ikhwan. Aplikasi ini memungkinkan pegawai untuk melakukan presensi dengan menekan tombol yang sesuai dengan nama mereka. Sistem ini juga dilengkapi dengan fitur pengumuman yang dapat diupdate oleh admin, serta validasi lokasi untuk memastikan bahwa presensi hanya dapat dilakukan di lokasi yang telah ditentukan.

## Fitur Utama

- **Presensi Pegawai**: Pegawai dapat melakukan presensi dengan menekan tombol yang sesuai dengan nama mereka.
- **Validasi Lokasi**: Sistem memeriksa apakah pegawai berada dalam radius 20 meter dari lokasi yang diizinkan.
- **Pengumuman**: Admin dapat mengupdate pengumuman yang akan ditampilkan di halaman utama.
- **Loading Indicator**: Menampilkan indikator loading saat proses presensi sedang berlangsung.
- **Konfirmasi Presensi**: Menampilkan pesan konfirmasi setelah presensi berhasil dilakukan.
- **Tombol Melayang**: Tombol untuk memperbarui lokasi dengan akurasi tinggi.
- **Responsif**: Desain yang responsif untuk berbagai ukuran layar.

## Struktur File

Aplikasi ini terdiri dari tiga file utama:

- **index.html**: File HTML yang berisi struktur dan konten halaman web.
- **script.js**: File JavaScript yang berisi logika dan fungsi-fungsi aplikasi.
- **styles.css**: File CSS yang berisi gaya dan tampilan aplikasi.

## Cara Penggunaan

### Presensi Pegawai

1. Buka aplikasi di browser.
2. Tekan tombol dengan nama Anda.
3. Jika lokasi Anda valid, presensi akan berhasil dan Anda akan melihat pesan konfirmasi.

### Update Pengumuman (Admin)

1. Tekan tombol "Edit Pengumuman (Admin)".
2. Masukkan password admin.
3. Masukkan pengumuman baru dan tekan OK.

### Perbarui Lokasi dengan Akurasi Tinggi

1. Tekan tombol melayang di sudut kanan bawah.
2. Sistem akan memperbarui lokasi Anda dengan akurasi tinggi.

## Teknologi yang Digunakan

- **HTML5**: Untuk struktur dan konten halaman web.
- **CSS3**: Untuk gaya dan tampilan aplikasi.
- **JavaScript**: Untuk logika dan interaktivitas aplikasi.
- **Font Awesome**: Untuk ikon.
- **SweetAlert2**: Untuk notifikasi dan konfirmasi.
- **Google Apps Script**: Untuk backend dan penyimpanan data.

## Keamanan

- **Validasi Lokasi**: Presensi hanya dapat dilakukan di lokasi yang telah ditentukan.
- **Password Admin**: Hanya admin yang mengetahui password dapat mengupdate pengumuman.

## Batasan dan Catatan

- **Lokasi**: Presensi hanya dapat dilakukan di lokasi yang telah ditentukan.
- **Browser**: Aplikasi ini memerlukan browser yang mendukung geolocation dan JavaScript modern.
- **Internet**: Aplikasi memerlukan koneksi internet untuk mengirim data ke Google Apps Script.

## Pengembangan Selanjutnya

- **Notifikasi**: Menambahkan notifikasi real-time untuk pengumuman baru.
- **Laporan Presensi**: Menambahkan fitur untuk melihat laporan presensi.
- **Multi-language Support**: Menambahkan dukungan untuk beberapa bahasa.

## Kesimpulan

Aplikasi Sistem Pendataan Presensi Pegawai Shahaba Ikhwan adalah solusi yang efektif untuk mengelola presensi pegawai dengan validasi lokasi dan fitur pengumuman yang dapat diupdate oleh admin. Aplikasi ini dirancang dengan antarmuka yang user-friendly dan responsif, serta menggunakan teknologi modern untuk memastikan keamanan dan keandalan.

## Kontribusi

Jika Anda ingin berkontribusi pada pengembangan aplikasi ini, silakan fork repository ini dan buat pull request dengan perubahan Anda.


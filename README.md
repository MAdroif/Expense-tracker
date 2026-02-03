Expense Tracker — README

Deskripsi singkat

Expense Tracker adalah proyek front-end sederhana untuk mencatat pemasukan dan pengeluaran. Dibangun sebagai *portfolio piece* yang menonjolkan keterampilan HTML, CSS, dan JavaScript murni—termasuk manipulasi DOM, penyimpanan lokal (localStorage), dan integrasi datepicker (flatpickr).

Projekt ini dibuat agar mudah dijalankan di perangkat apa pun (termasuk Android/Termux) tanpa bergantung pada backend.



Fitur utama

* Tambah transaksi (pemasukan / pengeluaran) dengan tanggal, kategori, keterangan, dan jumlah.
* Ringkasan otomatis: total pemasukan, total pengeluaran, dan saldo.
* Filter: semua / pemasukan / pengeluaran.
* Filter rentang tanggal dengan picker (flatpickr).
* Hapus transaksi.
* Ekspor data yang difilter ke CSV.
* Penyimpanan lokal menggunakan `localStorage`.



Teknologi

* HTML5
* CSS (style.css)
* JavaScript (sc.js)
* Flatpickr (date range picker)
* Font Awesome (ikon)



Struktur berkas

```
/ (project root)
├─ index.html         # Halaman utama
├─ style.css          # Styling utama
├─ sc.js              # Logic JavaScript (manipulasi transaksi, localStorage, export CSV)
└─ vendor (external libs via CDN)
```



Cara menjalankan

Skenario cepat — cukup buka `index.html` di browser.

Pilihan (direkomendasikan untuk pengembangan):

1. Jalankan server sederhana (untuk menghindari batasan CORS atau behaviour file://):

```bash
# Python 3 (desktop / Termux jika tersedia)
python -m http.server 8000
# lalu buka http://localhost:8000
```

2. Menggunakan ekstensi Live Server (VS Code) — buka folder proyek lalu klik "Go Live".

3. Di Android/Termux: masuk ke folder proyek lalu jalankan `python -m http.server 8000` (jika python tersedia) atau gunakan aplikasi file manager yang mendukung membuka file HTML.



Cara pakai

1. Isi tanggal (opsional — jika kosong akan otomatis berisi tanggal hari ini).
2. Pilih jenis: Pemasukan / Pengeluaran.
3. Pilih kategori, masukkan jumlah, dan tambahkan keterangan jika perlu.
4. Klik Simpan Transaksi.
5. Gunakan tombol filter untuk melihat semua / pemasukan / pengeluaran.
6. Pilih rentang tanggal di field "Pilih rentang tanggal" lalu klik **Reset Tanggal** jika ingin menghapus filter.
7. Klik Export CSV untuk men-download file CSV dari data yang sedang ditampilkan.


Catatan teknis & perbaikan yang direkomendasikan

Bug/Issue yang perlu diperhatikan

Saat ini `sc.js` menggunakan `datePicker` di dalam event listener (`resetDateFilter`) tetapi `datePicker` dideklarasikan secara lokal di `initApp()` dan/atau didefinisikan setelah `eventListener()` dipanggil. Ini dapat menyebabkan `ReferenceError` saat menekan tombol reset.

Perbaikan cepat: deklarasikan `let datePicker;` di scope atas (global modul) lalu inisialisasi di `initApp()`:

```js
// di bagian atas sc.js
let datePicker;

function initApp() {
  loadFromLocalStorage();
  // ...
  datePicker = flatpickr('#dateRange', { mode: 'range', dateFormat: 'Y-m-d', maxRange: 31, onChange: (...) => { /* ... */ } });
}
```

Alternatif: Pindahkan pendaftaran event `resetDateFilter` agar dibuat setelah `datePicker` didefinisikan.

Ketidaksesuaian kategori awal

`index.html` sudah berisi opsi kategori awal, tetapi `sc.js` merender ulang opsi kategori berdasarkan objek `categories`. Pastikan nilai `value` pada opsi HTML konsisten atau biarkan JavaScript yang menangani rendering kategori sepenuhnya.

Rekomendasi fitur lanjutan

- Tambahkan chart (mis. Chart.js atau Recharts) untuk visualisasi pemasukan vs pengeluaran.
- Autentikasi sederhana + backend (Node / Firebase) untuk menyimpan data multi-device.
- Import CSV, undo action, dan pagination riwayat transaksi.
- Versi PWA agar bisa diinstall sebagai aplikasi mobile.
- Unit tests untuk fungsi util (formatCurrency, exportToCSV, applyFilter).


Styling & kustomisasi cepat

- Ubah palet warna pada `style.css` (background linear-gradient dan variabel border-top pada kartu ringkasan).
- Kustomisasi daftar kategori di `sc.js` pada konstanta `categories`.
- Untuk mengubah format mata uang, update formatting di `render()` dan `summary()` (mengganti `toLocaleString()` jika ingin format berbeda).


Kontribusi

Proyek ini ringkas dan cocok sebagai starting point. Jika ingin kontribusi atau saran fitur baru, buat branch baru, tambahkan deskripsi di PR, dan sertakan demo singkat.

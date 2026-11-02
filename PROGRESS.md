# PROGRESS.md - Memori Kerja Dinamis Proyek (Short-Term Project Memory)

*Terakhir Diperbarui: 2 November 2026*  
*Status Sistem: **STABIL & TERVERIFIKASI (Build 100% Lolos, 7/7 Unit Test Lolos, Seluruh Task 1-8 plan.md Selesai Diimplementasikan)***

Dokumen ini berfungsi sebagai ringkasan kondisi sistem terkini agar AI dan pengembang dapat langsung memahami konteks proyek tanpa perlu memindai seluruh berkas kode.

---

## 1. Ringkasan Eksekutif Sistem
* **Nama Aplikasi**: Portal Informasi & Akademik Digital MI Al-Huda Gorontalo
* **Teknologi**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Lucide React
* **Status Port**: Dev server aktif pada port `3000` (`http://localhost:3000/`)
* **State Persistence**: Browser `localStorage` sinkron penuh untuk data pengumuman, jadwal, kalender, dokumen, warta, galeri, akun pengguna, dan log audit.
* **Autentikasi Internal**: Login khusus Staf Madrasah (**Admin** dan **Dewan Guru**) dengan delay 2 detik animasi putar key-code, rotasi otomatis key-code 60 detik, dan profil badge terintegrasi di navbar atas. Default pengunjung adalah **Tamu Publik** (`tamu`) tanpa login.
* **Hak Akses CRUD**: Baik **Admin** maupun **Dewan Guru** memiliki hak CRUD lengkap (Create, Read, Update, Delete) di semua modul konten portal.

---

## 2. Fitur Baru yang Telah Selesai (Done)

- [x] **Eksekusi Penuh Rencana Kerja `plan.md` (Task 1 s/d Task 8)**:
  - **Task 1 (Data Persistence & Default Role)**: `localStorage` reaktif terpasang pada semua state utama di `App.tsx`. Mode awal aplikasi saat dibuka adalah **Tamu Publik** (`tamu`).
  - **Task 2 (Identitas Penulis Konten Asli)**: Pengumuman dan warta berita yang dibuat staf mengambil nama lengkap (`currentUser.name`) dan NIP asli pengguna yang sedang login.
  - **Task 3 (Metrik Dashboard & Hero Urgent Dinamis)**: Angka staf di `RealtimeDashboard.tsx` dihitung otomatis dari data staf nyata; pita warta penting di `HeroBanner.tsx` menampilkan judul pengumuman penting/pinned secara dinamis.
  - **Task 4 (Unggah Foto Asli Galeri)**: Modul `SchoolGallery.tsx` mendukung upload file foto kegiatan langsung dari komputer lokal dengan pratinjau thumbnail.
  - **Task 5 (Pencarian & Filter Warta dan Kalender)**: Ditambahkan kolom pencarian teks dan filter kategori pada modul Warta Berita (`NewsManager.tsx`) dan Kalender Akademik (`AcademicCalendar.tsx`).
  - **Task 6 (Counter `viewsCount` Pengumuman)**: Angka pembaca bertambah otomatis (+1) saat kartu pengumuman dibuka.
  - **Task 7 (Pembersihan Teks & Navigasi Footer Aktif)**: Teks sisa "siswa/NISN" dibersihkan; tautan menu pada `Footer.tsx` aktif dan dapat diklik untuk berpindah halaman secara mulus.
  - **Task 8 (Code Hygiene & Vite 8 Config)**: Mengganti `__dirname` menjadi `import.meta.dirname` di `vite.config.ts`, menghapus tipe tak terpakai `OtpSession`, dan memperbaiki tipe timer browser.

- [x] **Pembaruan Halaman Pengumuman & Visual Showcase Kampus**:
  - Tombol redundan "Lihat Pengumuman" di `HeroBanner.tsx` telah dihapus secara bersih beserta kodenya.
  - Foto resmi gedung madrasah (`/gedung-mi-alhuda.jpg`) telah ditambahkan di bagian atas halaman pengumuman (`DigitalBoard.tsx`).
  - Dilengkapi efek **Light Sweep** (`animate-light-sweep`) berupa kilatan sapuan cahaya diagonal periodik di atas gambar, badge gedung representatif, dan tag keunggulan madrasah.

- [x] **Efek Transisi Antar Halaman & Animasi Auth**:
  - Konten antar tab terbungkus animasi transisi halus (`animate-page-enter`) dengan perpindahan mulus (fade-in & subtle vertical translation).
  - Ditambahkan efek animasi visual pop-up megah saat Login Berhasil (`ShieldCheck`, emerald glow, info staf aktif) dan saat Logout (`LogOut`, amber glow, beralih ke mode pengunjung publik tanpa login).

- [x] **Pembaruan Aturan Sistem (`RULES.md`)**:
  - Sinkronisasi aturan RBAC tanpa login siswa; akses santri & wali murid murni publik tanpa kredensial.

- [x] **CRUD Penuh untuk Admin dan Dewan Guru di Semua Halaman**:
  - **Papan Pengumuman Digital (`DigitalBoard.tsx`)**: Tambah pengumuman baru, baca rincian, edit pengumuman, dan hapus pengumuman dengan konfirmasi modal.
  - **Jadwal Pelajaran KBM (`ScheduleModule.tsx`)**: Tambah sesi KBM baru (kelas 1A-6A, hari, jam ke-, rentang waktu, mapel, guru pengampu, ruang kelas, rumpun PAI), edit sesi, dan hapus sesi.
  - **Kalender Akademik (`AcademicCalendar.tsx`)**: Tambah agenda madrasah baru, edit agenda, dan hapus agenda.
  - **Pusat Unduhan Dokumen (`AdminDocuments.tsx`)**: Unggah berkas asli PDF/Word/Excel dari perangkat lokal, edit metadata & kode surat, unduh berkas biner valid, dan hapus berkas.
  - **Warta & Publikasi Guru (`NewsManager.tsx`)**: Tulis artikel warta baru, baca lengkap, edit naskah/ringkasan, dan hapus warta.
  - **Galeri Dokumentasi Santri (`SchoolGallery.tsx`)**: Tambah dokumentasi album kegiatan, edit dokumentasi, lihat rincian, dan hapus dokumentasi.

- [x] **Pembersihan Tuntas Fitur "Tambah Santri dan Wali" dari Dashboard & Akun**:
  - Tombol dan form "Tambah Santri & Wali" telah dihapus sepenuhnya dari web dan codebase.
  - Modul Manajemen Akun (`UserManagementModule.tsx`) sekarang murni mengelola staf internal madrasah: Dewan Guru & Tenaga Kependidikan serta Administrator Madrasah.
  - Dashboard statistik (`RealtimeDashboard.tsx`) dibersihkan dari metrik penambahan santri/wali dan diselaraskan untuk pemantauan staf dan kunjungan publik.
  - Tipe `StudentRegistrationData` dan fungsi validasi santri lama telah dihapus dari codebase.

- [x] **Unit Testing Murni Terverifikasi (7/7)**:
  - `src/utils/portalLogic.test.ts` memverifikasi 7 test case:
    1. Hak akses RBAC & `canManageContent` untuk Admin & Guru (keduanya dapat CRUD).
    2. Generator & validasi Key Code login dengan rotasi.
    3. Generator OTP numerik 6 digit.
    4. Validasi input dan keunikan NIP staf baru / edit.
    5. Proteksi akun Admin Utama saat penghapusan akun.
    6. Verifikasi perubahan kata sandi mandiri.
    7. Generator biner dokumen asli (PDF, Word, Excel).
  - Status: **7 pass, 0 fail**.

---

## 3. Peta Berkas Kunci (Key Files Map)

| Berkas | Deskripsi & Tanggung Jawab |
| :--- | :--- |
| `src/App.tsx` | State global aplikasi, penyedia data reaktif untuk semua modul, audit log otomatis, toast feedback |
| `src/types/index.ts` | Definisi interface TypeScript (`UserRole`, `UserProfile`, `Announcement`, `ScheduleItem`, `AcademicEvent`, `AdminDocument`, `NewsArticle`, `GalleryItem`, `AuditLog`) |
| `src/data/mockData.ts` | Basis data awal: akun Admin dan Dewan Guru, jadwal pelajaran lengkap 6 kelas, agenda kalender, berkas administrasi |
| `src/utils/portalLogic.ts` | Logika murni: `canManageContent`, `hasRoleAccess`, Key Code generator/validator, edit & delete user account |
| `src/utils/documentGenerator.ts` | Generator berkas asli (PDF 1.4, Word doc, Excel CSV) yang dapat diunduh dan dibuka langsung di komputer pengguna |
| `src/utils/portalLogic.test.ts` | Unit tests otomatis via Node.js native test runner (`node:test`) |
| `src/components/LoginModal.tsx` | Dialog login staf internal (Admin & Guru) dengan key-code timer 60 detik & tombol reload beranimasi putar 2 detik |
| `src/components/Header.tsx` | Navigasi atas, logo resmi MI Al-Huda, status sesi akun, dan tombol keluar (logout) |
| `src/components/DigitalBoard.tsx` | Papan pengumuman digital dengan dukungan CRUD Admin & Dewan Guru |
| `src/components/ScheduleModule.tsx` | Jadwal pelajaran KBM dengan filter kelas/hari dan dukungan CRUD Admin & Dewan Guru |
| `src/components/AcademicCalendar.tsx` | Kalender akademik dengan dukungan CRUD Admin & Dewan Guru |
| `src/components/AdminDocuments.tsx` | Repositori berkas resmi dengan unggah nyata dari perangkat dan dukungan CRUD Admin & Dewan Guru |
| `src/components/NewsManager.tsx` | Warta madrasah dengan dukungan CRUD Admin & Dewan Guru |
| `src/components/SchoolGallery.tsx` | Galeri dokumentasi dengan dukungan CRUD Admin & Dewan Guru |
| `src/components/RealtimeDashboard.tsx` | Dashboard telemetri kunjungan & log audit real-time khusus Admin |
| `src/components/UserManagementModule.tsx` | Manajemen staf & dewan guru madrasah (Tambah, Edit, Ganti Sandi, Hapus) |

---

## 4. Akun Bawaan (Default Credentials)

| Peran | Username / ID | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `123456` | Administrator MI Al-Huda (Akses Penuh & Kelola Akun Staf) |
| **Guru** | `198904152014021003` | `123456` | Ustadz Moh. Farhan Gobel, S.Pd. (Wali Kelas 5A & PAI) |
| **Guru** | `198701242011012015` | `123456` | Ustadzah Sitti Fatimah, M.Pd. (Waka Kurikulum) |
| **Tamu** | *Tanpa Login* | - | Pengunjung publik (akses baca pengumuman, jadwal, unduh berkas) |

# Portal Informasi & Akademik Digital MI Al-Huda Gorontalo

Portal web resmi berbasis digital untuk **Madrasah Ibtidaiyah (MI) Al-Huda Kota Gorontalo** (*Pondok Pesantren Al-Huda Gorontalo*), mengusung motto *"Membentuk Generasi Qur'ani, Berakhlak Mulia, dan Berprestasi"*.

---

## 🌟 Fitur Utama

- **Papan Pengumuman Digital**: Warta edaran madrasah, pengumuman penting, dan lampiran dokumen resmi dengan dukungan filter kategori dan pencarian.
- **Showcase Kampus Hijau**: Tampilan gedung madrasah 3 lantai representatif dengan efek animasi *Light Sweep* berkilau.
- **Jadwal Pelajaran KBM Terpadu**: Jadwal roster mata pelajaran per kelas (1A s/d 6A) dan per hari (Senin s/d Sabtu).
- **Kalender Akademik & Agenda**: Penandaan agenda ujian, hari libur nasional/keagamaan, serta kegiatan madrasah.
- **Pusat Unduhan Dokumen Administrasi**: Pengunggahan berkas nyata dan pengunduhan langsung dokumen PDF, Word, dan Excel (Formulir PPDB, Juknis Kemenag, Surat Keterangan).
- **Warta Berita & Opini Guru**: Publikasi artikel prestasi, kegiatan islami, dan opini tenaga pendidik.
- **Galeri Dokumentasi Santri**: Dokumentasi album kegiatan ekstrakurikuler, pramuka, dan tahfidz Al-Qur'an.
- **Akses Publik Bebas Login untuk Siswa & Wali**: Seluruh jadwal, pengumuman, agenda, dan dokumen dapat diakses secara langsung oleh siswa dan wali santri tanpa perlu membuat akun atau login (*frictionless access*).
- **Autentikasi Staf Terpadu (Admin & Guru)**: Dilengkapi verifikasi keamanan **Dynamic Key Code** anti-bot (rotasi otomatis 60 detik) dan proteksi akun root admin.
- **Dashboard Analitik & Audit Log Real-Time (Khusus Admin)**: Pemantauan statistik kunjungan, unduhan, dan log aktivitas operasional staf madrasah.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Backend & REST API**: [Express.js](https://expressjs.com/) (`server.ts` & `server/index.ts`)
- **Basis Data Relasional**: SQLite 3 (`node:sqlite DatabaseSync`) di `./data/alhuda.db` & Skema MySQL 8.0+ DDL (`database/schema.sql`)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: Node.js Native Test Runner (`node:test` + `tsx`)

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 22 ke atas direkomendasikan)
- npm atau yarn

### Langkah Menjalankan

1. **Pasang dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Backend REST API & Database Server**:
   ```bash
   npm run server
   ```
   Server REST API aktif pada: `http://localhost:3001/api/v1/health`

3. **Jalankan Frontend Portal (Dev Server)**:
   ```bash
   npm run dev
   ```
   Buka browser dan akses: `http://localhost:3000/`

4. **Menjalankan Pengujian (Testing - 11 Test Suites)**:
   ```bash
   npm test
   ```

5. **Build Produksi**:
   ```bash
   npm run build
   ```

---

## 🔐 Kredensial Bawaan Sistem

| Peran | Username / NIP | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `123456` | Akses penuh, manajemen akun staf & log audit |
| **Dewan Guru** | `198904152014021003` | `123456` | Ustadz Moh. Farhan Gobel, S.Pd. (Wali Kelas 5A) |
| **Dewan Guru** | `198701242011012015` | `123456` | Ustadzah Sitti Fatimah, M.Pd. (Waka Kurikulum) |
| **Siswa / Publik** | *Tanpa Login* | - | Mode tamu terbuka langsung saat portal dibuka |

---

## 📄 Lisensi & Hak Cipta
© 2026 MI Al-Huda Gorontalo. Seluruh Hak Cipta Dilindungi.

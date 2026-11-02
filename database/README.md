# Panduan Basis Data & REST API Produksi — MI Al-Huda Gorontalo

Dokumen ini merangkum arsitektur basis data relasional dan backend REST API yang telah diterapkan ke dalam sistem **Portal Digital MI Al-Huda Gorontalo**.

---

## 1. Arsitektur Basis Data Saat Ini

Sistem menggunakan mesin basis data relasional **SQLite 3** berbasis modul standar Node.js (`node:sqlite DatabaseSync`) yang tersimpan di berkas:
`./data/alhuda.db`

### Keunggulan:
* **Zero Dependency / Zero Setup**: Tidak memerlukan instalasi server MySQL/PostgreSQL tambahan untuk pengujian dan pengembangan lokal.
* **ACID-Compliant & WAL Mode**: Mengaktifkan mode *Write-Ahead Logging* (`PRAGMA journal_mode = WAL`) untuk konkurensi tinggi.
* **Auto-Seed**: Saat pertama kali server dijalankan, tabel otomatis dibuat dan diisi data awal (*initial seeds*) jika kosong.
* **Kompatibel Penuh dengan MySQL / MariaDB**: Skema DDL produksi (`database/schema.sql`) dapat di-import langsung ke MySQL 8.0+ atau MariaDB 10.6+ untuk deployment cPanel madrasah.

---

## 2. Struktur Tabel Relasional (14 Tabel)

| No | Nama Tabel | Deskripsi & Isi Data |
| :- | :--- | :--- |
| 1 | `users` | Akun staf internal (Admin Madrasah & Dewan Guru) |
| 2 | `roles` | Definisi RBAC (admin, guru, tamu) |
| 3 | `categories` | Taksonomi pengumuman, warta berita, dan berkas |
| 4 | `announcements` | Papan pengumuman digital resmi madrasah |
| 5 | `announcement_attachments` | Berkas lampiran pengumuman |
| 6 | `class_schedules` | Roster jadwal pelajaran KBM kelas 1A - 6A |
| 7 | `academic_calendars` | Agenda madrasah, ujian, dan kalender libur Kemenag |
| 8 | `administrative_documents` | Pusat unduhan dokumen resmi (PPDB, juknis, format SPTJM) |
| 9 | `news_articles` | Warta kegiatan madrasah dan opini dewan guru |
| 10 | `gallery_items` | Album dokumentasi kegiatan santri & tahfidz |
| 11 | `system_audit_logs` | Jejak audit keamanan & aktivitas operasional staf |
| 12 | `visitor_traffic_hourly` | Agregasi statistik kunjungan per jam (WITA) |
| 13 | `cbt_exams` & `cbt_questions` | Modul bank soal & sesi ujian online mandiri |
| 14 | `cbt_student_attempts` | Lembar jawaban & kalkulasi skor otomatis CBT |

---

## 3. Menjalankan Backend REST API

Untuk menjalankan backend REST API dan server database:

```bash
# Menjalankan server backend di port 3001
npm run server
```

Server akan aktif pada:
* **REST API Endpoint**: `http://localhost:3001/api/v1/`
* **Health Check**: `http://localhost:3001/api/v1/health`

### Menjalankan Frontend & Backend Bersamaan:
Buka dua terminal:
* **Terminal 1**: `npm run server` (Port 3001)
* **Terminal 2**: `npm run dev` (Port 3000)

*Catatan: Vite telah dikonfigurasi dengan proxy otomatis di `vite.config.ts`, sehingga panggilan frontend ke `/api/*` langsung diarahkan ke port 3001 tanpa kendala CORS.*

---

## 4. Migrasi ke MySQL / MariaDB (Untuk cPanel Hosting)

1. Buka **phpMyAdmin** atau konsol MySQL di server hosting.
2. Buat database baru, contoh: `db_mi_alhuda`.
3. Buka tab **Import**, lalu pilih berkas `database/schema.sql`.
4. Eksekusi import DDL. Seluruh 14 tabel relasional berindeks komposit akan terbentuk secara otomatis.


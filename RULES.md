# RULES.md - Panduan & Aturan Statis Sistem Portal MI Al-Huda Gorontalo

Dokumen ini berisi aturan arsitektur, batasan hak akses (RBAC), konvensi kode, dan panduan operasional untuk Portal Informasi & Akademik Digital Madrasah Ibtidaiyah Al-Huda Gorontalo.

---

## 1. Identitas & Branding Madrasah
* **Nama Institusi**: MI Al-Huda Gorontalo (Pondok Pesantren Al-Huda Gorontalo).
* **Motto**: *"Membentuk Generasi Qur'ani, Berakhlak Mulia, dan Berprestasi"*.
* **Aset Logo Resmi**:
  - Path utama: `/logo-mi-alhuda.png` (sumber: `/public/assets/aistudio/image_24f0559e.png`).
  - Bentuk: Perisai segilima biru dengan lambang Al-Qur'an, kubah masjid kuning, padi & rantai hijau, bulan sabit bintang, dan tulisan kaligrafi Ma'had at-Tarbiyah al-Islamiyyah Al-Huda Gorontalo.
* **Palet Warna**:
  - **Primer (Hijau Islami)**: `#14532d` (Emerald-900), `#1e3a29` (Deep Madrasah Green), `#15803d` (Green-700).
  - **Aksen (Keemasan Prestasi)**: `#ca8a04` (Amber-600), `#eab308` (Yellow-500).
  - **Latar Belakang & Netral**: `#f8fafc` (Slate-50), `#f0fdf4` (Green-50), `#0f172a` (Slate-900).

---

## 2. Arsitektur Teknis
* **Teknologi**:
  - Frontend: **React 19** + **TypeScript** + **Vite 8**
  - Styling: **Tailwind CSS v4** (`@import "tailwindcss";`)
  - Ikon: **Lucide React** (`lucide-react`)
  - State Persistence: Browser `localStorage` & in-memory state reaktif (dengan initial seed terstruktur di `src/data/mockData.ts`)
  - Unit Testing: Node.js native test runner (`node:test` + `tsx`) di `src/utils/portalLogic.test.ts`
* **Prinsip Modularitas**:
  - Komponen UI terpisah dalam direktori `src/components/`.
  - Type definitions terpusat di `src/types/index.ts`.
  - Fungsi bisnis murni (pure logic) berada di `src/utils/portalLogic.ts` tanpa ketergantungan DOM agar 100% testable.

---

## 3. Kebijakan & Aturan Hak Akses Pengguna (Role-Based Access Control / RBAC)

Sistem dirancang terbuka dan ramah publik bagi peserta didik dan orang tua/wali murid, dengan autentikasi yang difokuskan secara ketat hanya untuk staf internal madrasah.

### Penetapan Peran (Roles):

| Peran (Role) | Kategori Pengguna | Mekanisme Akses | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Admin** | Administrator Madrasah (`admin`) | Login Akun & Key Code | • Akses Penuh ke Seluruh Fitur, Navigasi & Modul<br>• Dashboard Analitik & Telemetri Kunjungan Real-Time<br>• Manajemen Pengguna Staf (Tambah, Edit, Ganti Sandi, Hapus Guru & Tenaga Kependidikan)<br>• CRUD Lengkap: Pengumuman, Jadwal KBM, Kalender Akademik, Dokumen, Warta, & Galeri<br>• Pemantauan System Audit Log |
| **Teacher** *(Dewan Guru)* | Tenaga Pendidik & Staf (`guru`) | Login Akun (NIP) & Key Code | • Kelola & Publikasi Jadwal Pelajaran (Roster KBM 1A s/d 6A)<br>• Buat, Edit, & Hapus Pengumuman Madrasah<br>• Tulis, Edit, & Terbitkan Warta Berita & Opini Guru<br>• Unggah Dokumen Administrasi / Materi Ajar Asli (PDF/DOCX/XLSX)<br>• Kelola Agenda Kalender Akademik & Album Galeri Madrasah<br>• Ganti Kata Sandi Akun Pribadi |
| **Guest / Publik** *(Siswa, Santri, Wali Murid, Umum)* | Publik & Peserta Didik (`tamu`) | **Tanpa Login (Akses Terbuka Langsung)** | • Membaca seluruh Pengumuman Resmi & Warta Madrasah<br>• Meninjau Jadwal Pelajaran Lengkap per Kelas & per Hari<br>• Meninjau Kalender Akademik & Agenda Madrasah<br>• Mengunduh langsung Dokumen Resmi, Panduan PPDB, Surat Keterangan, dan Formulir<br>• Melihat Dokumentasi Kegiatan Santri & Galeri Madrasah |

---

## 4. Aturan Keamanan & Kebijakan Autentikasi

1. **Peniadaan Login Siswa & Wali Murid**:
   - Seluruh informasi akademik, pengumuman, jadwal pelajaran, dan unduhan dokumen dapat diakses secara langsung oleh siswa dan wali murid tanpa perlu registrasi atau login akun.
   - Peniadaan akun siswa bertujuan mencegah hambatan akses (frictionless access) bagi wali murid serta menyederhanakan pemeliharaan akun di madrasah.

2. **Login Khusus Staf Internal (Admin & Dewan Guru)**:
   - Form modal masuk sistem hanya menyediakan dua pilihan peran: **Administrator** dan **Dewan Guru**.
   - Identitas masuk menggunakan Username/ID Admin atau Nomor Induk Pegawai (NIP/NUPTK) Guru beserta kata sandi.

3. **Verifikasi Keamanan Key Code (Anti-Brute Force Captcha)**:
   - Setiap upaya login wajib memverifikasi kode alfanumerik acak 6 karakter (format: `ALH-XXX`).
   - Kode berganti otomatis setiap 60 detik dengan penghitung mundur real-time.
   - Tombol refresh manual dilengkapi animasi putar selama 2 detik untuk memastikan proteksi terhadap bot otomatis.

4. **Pengelolaan Akun Terpusat oleh Admin**:
   - Registrasi mandiri publik ditiadakan. Akun Dewan Guru dan Staf baru ditambahkan secara terpusat oleh Administrator melalui tab *Dashboard & Akun* (`UserManagementModule.tsx`).
   - Administrator dapat menyetel NIP, nama lengkap, penugasan mata pelajaran/wali kelas, email, nomor HP, dan kata sandi staf.

5. **Pemulihan & Pengubahan Kata Sandi**:
   - Pemulihan mandiri via OTP email untuk siswa telah ditiadakan seiring peniadaan login siswa.
   - Staf Dewan Guru atau Admin yang sedang aktif dapat memperbarui kata sandi secara mandiri lewat tombol *Ganti Sandi* di header bar (`ChangePasswordModal.tsx`).
   - Jika staf lupa kata sandi, pengaturan ulang kata sandi dilakukan langsung oleh Administrator melalui menu Edit Akun Staf.

6. **Perlindungan Akun Root Admin**:
   - Akun root admin bawaan (`usr-admin-01` / identifier: `admin`) diproteksi secara permanen di layer logika (`portalLogic.ts`) dan tidak dapat dihapus untuk mencegah *system lockout*.
   - Akun yang sedang dalam kondisi aktif digunakan juga dicegah dari penghapusan mandiri.

---

## 5. Konvensi Kode & Standar Kualitas

* **TypeScript Strictness**: Tidak menggunakan tipe `any` implisit. Semua interface terdefinisi di `src/types/index.ts`.
* **Desain UI/UX**: Mengikuti palet resmi MI Al-Huda (Emerald Deep, Amber Gold, Slate Neutral) dengan komponen responsif mobile-first.
* **Testing**: Setiap perubahan fungsi murni pada `src/utils/portalLogic.ts` wajib lulus verifikasi unit test di `src/utils/portalLogic.test.ts` (`npm run test` atau `npx tsx --test`).

# PLAN.md — Master Prompt Audit Sistem & Rencana Implementasi (Untuk Junior Programmer / Model AI Ekonomis)

> **Cara Menggunakan Dokumen Ini:**
> 1. **Bagian 1** berisi **Master Prompt** yang dapat Anda *copy-paste* kapan saja ke model AI untuk memerintahkannya bertindak sebagai *System Tester / QA Analyst* atau untuk mengeksekusi *task* satu per satu menggunakan model AI yang murah/hemat token.
> 2. **Bagian 2** berisi **Hasil Audit Menyeluruh (System Tester Report)** terhadap kode proyek `portal-digital-mi-al-huda-gorontalo` saat ini — menjabarkan seluruh fitur yang belum terimplementasi, *bug* logika, *dead code*, dan ketidaksesuaian dengan `RULES.md`.
> 3. **Bagian 3** berisi **Daftar Tugas Langkah-demi-Langkah (Atomic Tasks)** yang sudah dipecah menjadi instruksi sangat spesifik (lengkap dengan nama berkas, baris kode, dan contoh kode) agar dapat langsung dikerjakan oleh **Junior Programmer** atau **Model AI Murah (Flash / Haiku / Mini)** tanpa salah langkah.

---

## BAGIAN 1: KUMPULAN PROMPT SIAP PAKAI (COPY-PASTE)

### 1A. Prompt untuk Menyuruh Model AI Menganalisis Project Sebagai System Tester
*(Gunakan prompt ini jika Anda ingin meminta AI melakukan audit ulang atas seluruh repositori)*

```text
Bertindaklah sebagai Senior System Tester (QA Lead) dan System Analyst.
Tugasmu adalah melakukan audit menyeluruh terhadap seluruh kode sumber proyek "Portal Informasi & Akademik Digital MI Al-Huda Gorontalo" di workspace ini.

Langkah kerja yang WAJIB kamu lakukan:
1. Baca dokumen aturan utama di `RULES.md` dan memori progres di `PROGRESS.md`.
2. Periksa seluruh file di dalam `src/types/`, `src/utils/`, `src/data/`, `src/components/`, dan `src/App.tsx`, serta konfigurasi `package.json` dan `vite.config.ts`.
3. Bandingkan klaim fitur di `RULES.md` & `PROGRESS.md` dengan implementasi nyata di kode.
4. Identifikasi dan jabarkan secara jujur semua kelemahan berikut:
   - Fitur yang diklaim ada namun belum diimplementasikan (misal: penyimpanan localStorage, upload gambar/file, dll).
   - Bug logika atau perilaku default yang salah (misal: role awal saat web dibuka, data yang masih hardcoded, counter yang tidak bertambah).
   - Sisa kode lama (dead code / unused components / sisa atribut login siswa yang sudah dihapus).
   - Ketidaksesuaian UI/UX dan fitur pencarian/filter yang belum merata antar halaman.
5. Susun hasil temuanmu ke dalam file `plan.md` dengan format daftar tugas (Task 1, Task 2, dst.) yang sangat rinci dan atomik.
6. Pastikan setiap Task di `plan.md` mencantumkan:
   - Nama file lengkap dan nomor baris.
   - Penjelasan masalah secara singkat.
   - Instruksi perubahan kode langkah demi langkah (Before & After code snippet) yang sangat jelas sehingga dapat dikerjakan oleh Junior Programmer atau Model AI murah/kecil tanpa kebingungan.
   - Kriteria selesai (Definition of Done) dan perintah pengujian (`npm run lint`, `npm test`, `npm run build`).
```

---

### 1B. Prompt Eksekusi untuk Diberikan ke Model AI Murah / Junior Programmer
*(Copy-paste prompt ini ke model AI murah seperti Gemini Flash / Flash-Lite, Claude Haiku, atau GPT-4o-mini untuk mengerjakan isi `plan.md` secara bertahap)*

```text
Kamu adalah Junior Frontend Developer yang teliti.
Baca file `plan.md` dan `RULES.md` di proyek ini.
Tugasmu sekarang adalah mengerjakan HANYA [SEBUTKAN NOMOR TASK, misal: Task 1 dan Task 2] yang tertulis di Bagian 3 pada `plan.md`.

Aturan Ketat:
1. Ikuti instruksi file dan potongan kode yang ada di `plan.md` secara presisi. Jangan mengubah fitur lain yang tidak diminta.
2. Jangan merusak desain warna Emerald/Amber khas MI Al-Huda Gorontalo.
3. Ingat bahwa sistem ini TIDAK menggunakan login siswa (hanya Admin, Guru, dan Tamu/Publik).
4. Setelah selesai mengedit file, wajib jalankan perintah verifikasi:
   - `npm run lint`
   - `npm test`
   - `npm run build`
5. Pastikan ketiganya lulus (0 error) sebelum melaporkan hasil pekerjaanmu.
```

---

## BAGIAN 2: LAPORAN HASIL AUDIT SYSTEM TESTER (TEMUAN MENYELURUH)

Berdasarkan pemeriksaan menyeluruh terhadap seluruh berkas di dalam `src/`, berikut adalah daftar kekurangan, *gap* implementasi, dan *bug* yang ditemukan pada sistem saat ini:

| No | Kategori | Tingkat | Lokasi File | Deskripsi Masalah / Kekurangan Sistem |
| :- | :--- | :--- | :--- | :--- |
| **1** | **Data Persistence (`localStorage`)** | 🔴 **Tinggi** | `src/App.tsx` (Baris 57–64)<br>`RULES.md` (Baris 25) | `RULES.md` menyatakan *"State Persistence: Browser localStorage"*, namun di `src/App.tsx` seluruh state (`userAccounts`, `announcements`, `documents`, `articles`, `schedules`, `academicEvents`, `galleryItems`, `auditLogs`) hanya memakai `useState` biasa. **Akibatnya: Saat browser di-refresh (F5), semua data yang baru ditambah/diedit/dihapus oleh Admin atau Guru langsung hilang!** |
| **2** | **Default Role Saat Buka Web** | 🔴 **Tinggi** | `src/App.tsx` (Baris 51–52) | State awal aplikasi di-set `useState<UserRole>('admin')` dan `useState<UserProfile>(USER_PROFILES.admin)`. Ini membuat setiap pengunjung yang baru membuka web langsung masuk sebagai **Admin penuh tanpa login**. Seharusnya saat pertama kali dibuka, pengunjung berstatus `'tamu'` (`USER_PROFILES.tamu`), atau membaca sesi login terakhir dari `localStorage`. |
| **3** | **Identitas Penulis Guru Hardcoded** | 🟠 **Sedang** | `src/components/DigitalBoard.tsx` (Baris 155–156)<br>`src/components/NewsManager.tsx` (Baris 62–63) | Saat Guru yang sedang login membuat Pengumuman atau Warta Berita, nama penulis di-hardcode menjadi `'Dewan Guru MI Al-Huda'` dengan NIP `'198904152014021003'`. Seharusnya sistem mengambil nama asli (`currentUser.name`) dan NIP asli (`currentUser.identifier`) dari Guru yang sedang aktif login. |
| **4** | **Metrik Dashboard & Banner Urgent Statis** | 🟠 **Sedang** | `src/components/RealtimeDashboard.tsx` (Baris 116–119)<br>`src/components/HeroBanner.tsx` (Baris 80–97) | 1) Di `RealtimeDashboard.tsx`, jumlah akun staf tertulis statis `26 (24 Dewan Guru · 2 Admin Utama)`, tidak dihitung dari jumlah `userAccounts` sebenarnya.<br>2) Di `HeroBanner.tsx`, pita pengumuman penting ("PENTING: Pelaksanaan Asesmen...") tertulis statis (hardcoded), tidak mengambil judul pengumuman terbaru yang di-pin (`isPinned`) atau berkategori `'Penting'` dari state `announcements`. |
| **5** | **Upload Foto Galeri Belum Ada (Hanya Gradien Warna)** | 🟠 **Sedang** | `src/components/SchoolGallery.tsx`<br>`src/types/index.ts` (Baris 101–109) | Modul Galeri (`SchoolGallery.tsx`) saat ini hanya menampilkan kotak warna gradien dan ikon, belum mendukung **unggah foto kegiatan asli** (`<input type="file" accept="image/*" />` atau input URL gambar) sehingga galeri tidak menampilkan foto dokumentasi nyata. |
| **6** | **Lampiran Pengumuman Hanya Simulasi Teks** | 🟠 **Sedang** | `src/components/DigitalBoard.tsx` (Baris 59, 158–167) | Saat membuat/mengedit pengumuman, kolom lampiran hanya meminta ketik nama file teks lalu memberi ukuran palsu `'640 KB'` dan `url: '#download'`. Belum mendukung pilih file asli (`<input type="file">`) seperti yang sudah berhasil diterapkan di `AdminDocuments.tsx`. |
| **7** | **Counter `viewsCount` Pengumuman Tidak Bertambah** | 🟡 **Rendah** | `src/components/DigitalBoard.tsx`<br>`src/App.tsx` | Setiap kartu pengumuman memiliki angka `viewsCount` (misal: `342x dilihat`), tetapi ketika pengguna mengeklik pengumuman untuk membaca detailnya, angka `viewsCount` tidak bertambah (+1). |
| **8** | **Sisa Referensi "Siswa" & Tautan Mati di Footer** | 🟡 **Rendah** | `src/components/Footer.tsx` (Baris 68–74)<br>`src/components/ChangePasswordModal.tsx` (Baris 86)<br>`src/data/mockData.ts` (Baris 501, 510) | 1) `Footer.tsx` baris 71 masih menulis *"Manajemen Akun Guru & Siswa"* dan item Layanan Digital tidak bisa diklik untuk pindah tab.<br>2) `ChangePasswordModal.tsx` baris 86 masih menulis *"ID / NIP / NISN"* dan kondisi role `'Siswa'`.<br>3) `mockData.ts` masih menyisakan 2 log audit ber-role `'siswa'`. |
| **9** | **Fitur Cari/Filter di Warta & Kalender Belum Ada** | 🟡 **Rendah** | `src/components/NewsManager.tsx`<br>`src/components/AcademicCalendar.tsx` | Halaman Pengumuman dan Dokumen sudah punya kolom pencarian & filter kategori, namun halaman **Warta Berita** (`NewsManager.tsx`) dan **Kalender Akademik** (`AcademicCalendar.tsx`) belum memiliki kolom pencarian kata kunci maupun filter kategori. |
| **10** | **Dead Code & Peringatan Konfigurasi Build** | 🟢 **Teknis** | `src/components/SystemAnalystView.tsx`<br>`src/data/systemAnalystDoc.ts`<br>`vite.config.ts` (Baris 11)<br>`src/components/LoginModal.tsx` (Baris 55–56) | 1) `SystemAnalystView.tsx` & `systemAnalystDoc.ts` (~51 KB) tidak pernah di-import di mana pun.<br>2) `OtpSession` di `src/types/index.ts` tidak dipakai.<br>3) `vite.config.ts` memakai `__dirname` yang memicu warning pada Vite 8 (`Use import.meta.dirname`).<br>4) `LoginModal.tsx` memakai tipe `NodeJS.Timeout` di browser. |

---

## BAGIAN 3: DAFTAR TUGAS IMPLEMENTASI (ATOMIC TASKS UNTUK JUNIOR DEV / AI MURAH)

Kerjakan tugas-tugas di bawah ini secara berurutan dari **Task 1** hingga **Task 10**. Setiap task berdiri sendiri dan wajib diverifikasi dengan `npm run lint` dan `npm test`.

---

### TASK 1: Implementasi Penyimpanan `localStorage` & Perbaikan Default Role Menjadi `'tamu'`
- **Prioritas**: 🔴 Kritis
- **File yang Diubah**: `src/App.tsx`
- **Masalah**:
  1. Saat halaman di-refresh, semua data CRUD kembali ke awal karena belum disimpan ke `localStorage`.
  2. Saat pertama kali membuka web, `currentRole` langsung `'admin'`, padahal seharusnya `'tamu'` (publik) kecuali sudah login sebelumnya.
- **Instruksi Langkah demi Langkah**:
  1. Buka `src/App.tsx`. Buat fungsi helper generic di atas komponen `App()` untuk memuat dan menyimpan state ke `localStorage`:
     ```tsx
     function loadFromStorage<T>(key: string, fallback: T): T {
       try {
         const saved = localStorage.getItem(key);
         return saved ? (JSON.parse(saved) as T) : fallback;
       } catch {
         return fallback;
       }
     }
     ```
  2. Ubah inisialisasi state di dalam `App()` agar membaca dari `localStorage` dengan key berawalan `alhuda_`:
     - `currentRole`: `useState<UserRole>(() => loadFromStorage<UserRole>('alhuda_role', 'tamu'))`
     - `currentUser`: `useState<UserProfile>(() => loadFromStorage<UserProfile>('alhuda_user', USER_PROFILES.tamu))`
     - `userAccounts`: `useState<UserProfile[]>(() => loadFromStorage('alhuda_users', INITIAL_USER_ACCOUNTS))`
     - `announcements`: `useState<Announcement[]>(() => loadFromStorage('alhuda_announcements', INITIAL_ANNOUNCEMENTS))`
     - `documents`: `useState<AdminDocument[]>(() => loadFromStorage('alhuda_documents', ADMIN_DOCUMENTS))`
     - `articles`: `useState<NewsArticle[]>(() => loadFromStorage('alhuda_articles', NEWS_ARTICLES))`
     - `schedules`: `useState<ScheduleItem[]>(() => loadFromStorage('alhuda_schedules', SCHEDULE_DATABASE))`
     - `academicEvents`: `useState<AcademicEvent[]>(() => loadFromStorage('alhuda_events', ACADEMIC_EVENTS))`
     - `galleryItems`: `useState<GalleryItem[]>(() => loadFromStorage('alhuda_gallery', GALLERY_ITEMS))`
     - `auditLogs`: `useState<AuditLog[]>(() => loadFromStorage('alhuda_logs', INITIAL_AUDIT_LOGS))`
  3. Tambahkan `useEffect` (jangan lupa import `useEffect` dari `'react'`) untuk menyinkronkan perubahan state ke `localStorage`:
     ```tsx
     useEffect(() => { localStorage.setItem('alhuda_role', JSON.stringify(currentRole)); }, [currentRole]);
     useEffect(() => { localStorage.setItem('alhuda_user', JSON.stringify(currentUser)); }, [currentUser]);
     useEffect(() => { localStorage.setItem('alhuda_users', JSON.stringify(userAccounts)); }, [userAccounts]);
     useEffect(() => { localStorage.setItem('alhuda_announcements', JSON.stringify(announcements)); }, [announcements]);
     useEffect(() => {
       // Hindari menyimpan objek Blob mentah ke JSON localStorage
       const serializableDocs = documents.map(({ fileBlob, ...rest }) => rest);
       localStorage.setItem('alhuda_documents', JSON.stringify(serializableDocs));
     }, [documents]);
     useEffect(() => { localStorage.setItem('alhuda_articles', JSON.stringify(articles)); }, [articles]);
     useEffect(() => { localStorage.setItem('alhuda_schedules', JSON.stringify(schedules)); }, [schedules]);
     useEffect(() => { localStorage.setItem('alhuda_events', JSON.stringify(academicEvents)); }, [academicEvents]);
     useEffect(() => { localStorage.setItem('alhuda_gallery', JSON.stringify(galleryItems)); }, [galleryItems]);
     useEffect(() => { localStorage.setItem('alhuda_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
     ```
- **Kriteria Selesai**: Saat web pertama kali dibuka di tab incognito, status pengguna adalah Tamu ("Masuk Portal"). Setelah login dan menambah data, data tetap ada walau halaman di-refresh (F5).

---

### TASK 2: Gunakan Nama & NIP Asli Pengguna yang Login Saat Membuat Pengumuman & Berita
- **Prioritas**: 🟠 Sedang
- **File yang Diubah**:
  1. `src/components/DigitalBoard.tsx`
  2. `src/components/NewsManager.tsx`
  3. `src/App.tsx`
- **Masalah**: Nama penulis (`authorName` / `author`) dan NIP (`authorNip`) masih di-hardcode saat membuat pengumuman atau berita baru.
- **Instruksi Langkah demi Langkah**:
  1. Di `src/components/DigitalBoard.tsx`:
     - Tambahkan prop opsional `currentUser?: UserProfile` pada `DigitalBoardProps` (import `UserProfile` dari `'../types'`).
     - Terima `currentUser` di parameter komponen `DigitalBoard`.
     - Pada fungsi `handleCreateSubmit`, ubah:
       ```tsx
       authorName: currentUser?.name || (currentRole === 'admin' ? 'Administrator MI Al-Huda' : 'Dewan Guru MI Al-Huda'),
       authorRole: currentUser?.subjectOrPosition || (currentRole === 'admin' ? 'Admin Madrasah' : 'Staf Pengajar'),
       ```
  2. Di `src/components/NewsManager.tsx`:
     - Tambahkan prop opsional `currentUser?: UserProfile` pada `NewsManagerProps` (import `UserProfile` dari `'../types'`).
     - Terima `currentUser` di parameter komponen `NewsManager`.
     - Pada fungsi `handleCreateSubmit` (sekitar baris 62–63), ubah:
       ```tsx
       author: currentUser?.name || (currentRole === 'admin' ? 'Administrator MI Al-Huda' : 'Dewan Guru MI Al-Huda'),
       authorNip: currentUser?.identifier || (currentRole === 'admin' ? 'admin' : '-'),
       ```
  3. Di `src/App.tsx`:
     - Kirimkan prop `currentUser={currentUser}` ke `<DigitalBoard ... />` dan `<NewsManager ... />`.
- **Kriteria Selesai**: Jika login sebagai Ustadzah Sitti Fatimah lalu menerbitkan pengumuman atau berita, nama penulis yang tampil adalah "Ustadzah Sitti Fatimah, M.Pd.", bukan nama hardcoded.

---

### TASK 3: Buat Metrik Staf di Dashboard & Pita Pengumuman Penting di HeroBanner Menjadi Dinamis
- **Prioritas**: 🟠 Sedang
- **File yang Diubah**:
  1. `src/components/RealtimeDashboard.tsx`
  2. `src/components/HeroBanner.tsx`
  3. `src/App.tsx`
- **Masalah**:
  1. Jumlah akun staf di `RealtimeDashboard.tsx` masih statis `26`.
  2. Judul pengumuman penting di `HeroBanner.tsx` masih statis.
- **Instruksi Langkah demi Langkah**:
  1. Buka `src/components/RealtimeDashboard.tsx`:
     - Tambahkan prop `users?: UserProfile[]` pada `RealtimeDashboardProps` (import `UserProfile` dari `'../types'`).
     - Hitung jumlah staf secara dinamis di dalam komponen:
       ```tsx
       const totalStaff = users ? users.length : 7;
       const totalGuru = users ? users.filter((u) => u.role === 'guru').length : 6;
       const totalAdmin = users ? users.filter((u) => u.role === 'admin').length : 1;
       ```
     - Ganti angka hardcoded `26` (baris 116) menjadi `{totalStaff}` dan teks `24 Dewan Guru · 2 Admin Utama` (baris 119) menjadi `{totalGuru} Dewan Guru · {totalAdmin} Admin`.
  2. Buka `src/components/HeroBanner.tsx`:
     - Tambahkan prop `latestUrgentTitle?: string` pada `HeroBannerProps`.
     - Pada bagian *Live Urgent Bulletin Strip* (baris 88), ganti teks hardcoded menjadi:
       ```tsx
       {latestUrgentTitle || 'Pelaksanaan Asesmen Madrasah (AM) & PPDB 2026 Gelombang I Telah Dibuka'}
       ```
  3. Buka `src/App.tsx`:
     - Cari pengumuman penting terbaru:
       ```tsx
       const latestUrgentAnnouncement = announcements.find(
         (a) => a.category === 'Penting' || a.isPinned
       );
       ```
     - Kirim prop `latestUrgentTitle={latestUrgentAnnouncement?.title}` ke `<HeroBanner ... />`.
     - Kirim prop `users={userAccounts}` ke `<RealtimeDashboard ... />`.
- **Kriteria Selesai**: Saat Admin menambah atau menghapus akun guru, angka pada kartu "Akun Staf & Pengajar" di Dashboard langsung berubah secara real-time.

---

### TASK 4: Tambahkan Fitur Upload Gambar Asli pada Galeri Dokumentasi (`SchoolGallery.tsx`)
- **Prioritas**: 🟠 Sedang
- **File yang Diubah**:
  1. `src/types/index.ts`
  2. `src/components/SchoolGallery.tsx`
- **Masalah**: Item galeri hanya menampilkan latar gradien warna tanpa foto dokumentasi nyata.
- **Instruksi Langkah demi Langkah**:
  1. Buka `src/types/index.ts`:
     - Pada interface `GalleryItem` (sekitar baris 101), tambahkan field opsional:
       ```ts
       imageUrl?: string;
       ```
  2. Buka `src/components/SchoolGallery.tsx`:
     - Tambahkan state `newImageUrl` (`useState<string>('')`) untuk modal tambah, dan `editImageUrl` (`useState<string>('')`) untuk modal edit.
     - Buat fungsi handler upload file gambar yang mengubah file menjadi Data URL (Base64) agar bisa disimpan di state & `localStorage`:
       ```tsx
       const handleImageFileChange = (
         e: React.ChangeEvent<HTMLInputElement>,
         setter: (val: string) => void
       ) => {
         const file = e.target.files?.[0];
         if (!file) return;
         const reader = new FileReader();
         reader.onload = () => {
           if (typeof reader.result === 'string') {
             setter(reader.result);
           }
         };
         reader.readAsDataURL(file);
       };
       ```
     - Pada form Modal Tambah dan Modal Edit di `SchoolGallery.tsx`, tambahkan input `<input type="file" accept="image/*" ... />` beserta pratinjau kecil (`<img>`) jika `newImageUrl` / `editImageUrl` terisi.
     - Saat merender kartu galeri dan modal detail galeri: jika `item.imageUrl` ada, tampilkan `<img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />` sebagai latar kartu; jika tidak ada, tetap tampilkan gradien warna & ikon seperti semula.
- **Kriteria Selesai**: Admin dan Guru dapat mengunggah foto kegiatan dari komputer saat menambah/mengedit item galeri, dan foto tersebut tampil di kartu galeri.

---

### TASK 5: Tambahkan Fitur Pencarian & Filter Kategori di Warta Berita & Kalender Akademik
- **Prioritas**: 🟡 Rendah
- **File yang Diubah**:
  1. `src/components/NewsManager.tsx`
  2. `src/components/AcademicCalendar.tsx`
- **Masalah**: Pengunjung tidak bisa mencari judul berita atau memfilter kategori agenda di Kalender Akademik.
- **Instruksi Langkah demi Langkah**:
  1. Di `src/components/NewsManager.tsx`:
     - Tambahkan state `selectedCategory` (`useState<string>('Semua')`) dan `searchQuery` (`useState<string>('')`).
     - Buat daftar kategori: `['Semua', 'Prestasi', 'Kegiatan Madrasah', 'Kultum & Opini', 'Informasi Kemenag']`.
     - Filter `articles` berdasarkan `selectedCategory` dan `searchQuery` (cocokkan pada `title`, `excerpt`, atau `author`).
     - Render tombol filter kategori dan input pencarian (`Search` icon dari `lucide-react`) di bagian header `NewsManager`.
  2. Di `src/components/AcademicCalendar.tsx`:
     - Tambahkan state `selectedCategory` (`useState<string>('semua')`) dan `searchQuery` (`useState<string>('')`).
     - Filter `events` berdasarkan kategori (`'semua' | 'ujian' | 'libur' | 'kegiatan' | 'akademik'`) dan kecocokan teks `searchQuery` pada `title` atau `description`.
     - Render bar filter kategori dan input pencarian di bagian atas kalender.
- **Kriteria Selesai**: Pengguna dapat memfilter warta berita dan agenda kalender berdasarkan kategori maupun kata kunci pencarian.

---

### TASK 6: Tambahkan Increment `viewsCount` Saat Pengumuman Dibaca
- **Prioritas**: 🟡 Rendah
- **File yang Diubah**:
  1. `src/components/DigitalBoard.tsx`
- **Masalah**: Saat tombol "Baca Selengkapnya" atau kartu pengumuman diklik untuk membuka modal baca, jumlah `viewsCount` tidak bertambah.
- **Instruksi Langkah demi Langkah**:
  1. Di `src/components/DigitalBoard.tsx`, buat fungsi `handleReadAnnouncement(item: Announcement)`:
     ```tsx
     const handleReadAnnouncement = (item: Announcement) => {
       const incremented = { ...item, viewsCount: item.viewsCount + 1 };
       setReadingAnnouncement(incremented);
       if (onEditAnnouncement) {
         onEditAnnouncement(incremented);
       }
     };
     ```
  2. Ganti pemanggilan `setReadingAnnouncement(item)` pada kartu pengumuman menjadi `handleReadAnnouncement(item)`.
- **Kriteria Selesai**: Setiap kali pengumuman dibuka, angka dilihat (`viewsCount`) bertambah 1.

---

### TASK 7: Bersihkan Sisa Referensi "Siswa" di Footer, Modal Ganti Sandi, & Audit Log, Serta Aktifkan Navigasi Footer
- **Prioritas**: 🟡 Rendah
- **File yang Diubah**:
  1. `src/components/Footer.tsx`
  2. `src/components/ChangePasswordModal.tsx`
  3. `src/data/mockData.ts`
  4. `src/App.tsx`
- **Masalah**: Masih ada teks sisa konsep lama ("Manajemen Akun Guru & Siswa", "NISN", dan log `'siswa'`), serta daftar layanan di Footer belum bisa diklik.
- **Instruksi Langkah demi Langkah**:
  1. Buka `src/components/Footer.tsx`:
     - Tambahkan prop opsional `onNavigateTab?: (tab: string) => void` pada `Footer`.
     - Pada baris 71, ubah `"Manajemen Akun Guru & Siswa"` menjadi `"Warta Guru & Galeri Kegiatan"`.
     - Ubah kelima item `<li>` pada Layanan Digital menjadi `<button onClick={() => { onNavigateTab?.('...'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-300 transition-colors text-left">` yang mengarah ke tab `'pengumuman'`, `'jadwal'`, `'warta'`, `'dokumen'`, dan `'jadwal'`.
  2. Buka `src/App.tsx`:
     - Oper prop `onNavigateTab={setActiveTab}` ke komponen `<Footer onNavigateTab={setActiveTab} />`.
  3. Buka `src/components/ChangePasswordModal.tsx`:
     - Pada baris 86, ubah teks `ID / NIP / NISN:` menjadi `ID / NIP Staf:` dan sederhanakan label role menjadi `{currentUser.role === 'admin' ? 'Administrator' : 'Dewan Guru'}`.
  4. Buka `src/data/mockData.ts`:
     - Pada `INITIAL_AUDIT_LOGS` (baris 498–514), ubah 2 log yang memiliki `userRole: 'siswa'` menjadi aktivitas `'guru'` atau `'tamu'` agar 100% konsisten dengan `RULES.md`.
- **Kriteria Selesai**: Tidak ada lagi teks menyesatkan tentang akun/login siswa di UI, dan tautan di Footer dapat diklik untuk berpindah halaman.

---

### TASK 8: Bersihkan Konfigurasi Build (`vite.config.ts`), Tipe Timer Browser, & Dead Code
- **Prioritas**: 🟢 Teknis / Code Hygiene
- **File yang Diubah**:
  1. `vite.config.ts`
  2. `src/components/LoginModal.tsx`
  3. `src/types/index.ts`
- **Masalah**:
  1. `vite.config.ts` memunculkan warning pada Vite 8 karena memakai `__dirname`.
  2. `LoginModal.tsx` memakai tipe `NodeJS.Timeout` di lingkungan DOM browser.
  3. Interface `OtpSession` di `src/types/index.ts` sudah tidak digunakan lagi.
- **Instruksi Langkah demi Langkah**:
  1. Buka `vite.config.ts`:
     - Ganti `path.resolve(__dirname, '.')` pada baris 11 menjadi `path.resolve(import.meta.dirname, '.')`.
  2. Buka `src/components/LoginModal.tsx`:
     - Pada baris 55–56, ganti `useRef<NodeJS.Timeout | null>(null)` menjadi `useRef<ReturnType<typeof setInterval> | null>(null)` dan `useRef<ReturnType<typeof setTimeout> | null>(null)`.
  3. Buka `src/types/index.ts`:
     - Hapus `export interface OtpSession { ... }` (baris 19–24) karena fitur OTP siswa sudah ditiadakan.
- **Kriteria Selesai**: Saat menjalankan `npm run build` dan `npm run lint`, tidak ada lagi warning `__dirname` dari Vite maupun error TypeScript.

---

## BAGIAN 4: CHECKLIST VERIFIKASI AKHIR (QA SIGN-OFF)

Setelah Junior Programmer atau Model AI menyelesaikan seluruh Task di atas, jalankan perintah berikut di terminal:

```bash
npm run lint
npm test
npm run build
```

Pastikan semua indikator berikut terpenuhi:
- [ ] `npm run lint` menghasilkan 0 error TypeScript.
- [ ] `npm test` meluluskan seluruh unit test (`pass 7`, `fail 0`).
- [ ] `npm run build` sukses membuat bundle produksi di folder `dist/` tanpa warning `__dirname`.
- [ ] Saat pertama kali dibuka, pengguna berada dalam mode **Tamu Publik** (bukan langsung Admin).
- [ ] Perubahan data (Tambah/Edit/Hapus Pengumuman, Jadwal, Kalender, Dokumen, Warta, Galeri, Akun Staf) tersimpan di `localStorage` dan tidak hilang saat di-refresh.


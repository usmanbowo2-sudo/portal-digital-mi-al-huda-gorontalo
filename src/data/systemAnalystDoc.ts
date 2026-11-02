export interface PRDSection {
  id: string;
  title: string;
  summary: string;
  content: string;
}

export const SYSTEM_ANALYST_PRD = {
  projectTitle: 'PRD & Cetak Biru Sistem Informasi Terpadu & Papan Pengumuman Digital MI Al-Huda Gorontalo',
  author: 'Tim Sistem Analis & Arsitek Perangkat Lunak',
  version: 'v1.4.0 (Enterprise Architecture)',
  date: 'November 2026',
  institution: 'Madrasah Ibtidaiyah (MI) Al-Huda Kota Gorontalo - Kemenag RI',
  executiveSummary: `Dokumen Product Requirement Document (PRD) ini merinci rancangan sistem informasi digital berbasis web untuk MI Al-Huda Gorontalo. Sistem ini menggabungkan papan pengumuman digital publik, portal akademik siswa, kalender akademik terpadu, sistem manajemen berita dewan guru, modul ujian mandiri (CBT Online), pusat unduhan dokumen administrasi, serta dashboard monitoring statistik kunjungan dan aktivitas pengguna secara real-time.`,

  phpFrameworkAnalysis: {
    title: 'Analisis Teknis: Slim Framework 4 vs CodeIgniter 4',
    recommendation: 'CodeIgniter 4 untuk Sistem Terpadu Madrasah (atau Slim 4 untuk Pure Micro-API Gateway)',
    comparison: [
      {
        aspect: 'Filosofi & Ukuran (Footprint)',
        slim4: 'Micro-framework murni (PSR-7/PSR-15). Sangat ramping (~3MB). Hanya menyediakan HTTP router & middleware pipeline.',
        ci4: 'Lightweight Full-stack / API framework (~12MB). Sudah dilengkapi DB Query Builder, Migration, Seeder, Validation, & CLI Sparks.',
        analystNote: 'Untuk tim madrasah dengan kebutuhan cepat deploy di hosting cPanel lokal, CI4 menghemat 60% waktu setup tanpa perlu rakit library luar.'
      },
      {
        aspect: 'Performa & Kecepatan Respons',
        slim4: 'Sangat cepat: ~1.200 - 1.800 req/sec pada PHP 8.2 FPM (OPcache aktif). Memory baseline ~2.5 MB/request.',
        ci4: 'Cepat & efisien: ~950 - 1.400 req/sec pada PHP 8.2 FPM. Memory baseline ~4.2 MB/request.',
        analystNote: 'Keduanya memenuhi kriteria "performa cepat dan efisien". Jauh lebih ringan dibanding Laravel monolitik (yang butuh ~15-25 MB/request).'
      },
      {
        aspect: 'Dukungan REST API Modular',
        slim4: 'Sangat modular karena dibangun di atas Container PSR-11 (PHP-DI) dan middleware PSR-15 terpisah per modul.',
        ci4: 'Memiliki built-in ResourceController, API ResponseTrait, dan API Filters yang siap pakai untuk REST API standar.',
        analystNote: 'CI4 memiliki fitur `ResponseTrait` yang mempermudah format JSON `$this->respond($data)` dan validasi otomatis.'
      },
      {
        aspect: 'Kemudahan Maintenance di Sekolah',
        slim4: 'Membutuhkan pemahaman arsitektur Composer lanjut (memilih ORM seperti Eloquent/Doctrine, Monolog, Validator pihak ketiga).',
        ci4: 'Dokumentasi sangat ramah bagi programmer di lingkungan dinas/sekolah, mudah dimigrasikan ke hosting shared maupun VPS.',
        analystNote: 'Rekomendasi Utama: Gunakan **CodeIgniter 4** untuk kemudahan pemeliharaan jangka panjang bagi staf IT sekolah, atau **Slim 4** jika murni diposisikan sebagai stateless API backend backend murni.'
      }
    ]
  },

  databaseDDL: `-- =========================================================================
-- SKEMA DATABASE RELASIONAL RESMI: PORTAL DIGITAL MI AL-HUDA GORONTALO
-- DBMS: MySQL 8.0+ / MariaDB 10.6+ / PostgreSQL 15+
-- Engine: InnoDB, Charset: utf8mb4_unicode_ci
-- Didesain dengan Composite Indexing untuk pencarian cepat & zero dead-lock CBT
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabel Peran Pengguna (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,       -- 'super_admin', 'guru', 'siswa', 'wali', 'tamu'
    label VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Pengguna (Users)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id TINYINT UNSIGNED NOT NULL,
    identifier VARCHAR(50) NOT NULL UNIQUE, -- NISN untuk siswa, NIP/NUPTK untuk guru, NIK/Email
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NULL,
    grade_class VARCHAR(20) NULL,           -- e.g. 'Kelas 5A'
    avatar_url VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_user_role_active (role_id, is_active),
    INDEX idx_user_identifier (identifier)
) ENGINE=InnoDB;

-- 3. Tabel Kategori Pengumuman & Berita
CREATE TABLE IF NOT EXISTS categories (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    slug VARCHAR(80) NOT NULL UNIQUE,
    type ENUM('announcement', 'news', 'document') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_type (type, slug)
) ENGINE=InnoDB;

-- 4. Tabel Papan Pengumuman Digital
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content MEDIUMTEXT NOT NULL,
    category_id SMALLINT UNSIGNED NOT NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    target_audience ENUM('Semua', 'Siswa', 'Guru', 'Wali Murid') DEFAULT 'Semua',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    views_count INT UNSIGNED DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    published_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ann_pinned_published (is_pinned, published_at DESC),
    INDEX idx_ann_audience_status (target_audience, status),
    FULLTEXT idx_ann_search (title, content)
) ENGINE=InnoDB;

-- 5. Tabel Lampiran Pengumuman (File Attachments)
CREATE TABLE IF NOT EXISTS announcement_attachments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    announcement_id BIGINT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_kb INT UNSIGNED NOT NULL,
    file_mime_type VARCHAR(100) NOT NULL,
    download_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
    INDEX idx_att_announcement (announcement_id)
) ENGINE=InnoDB;

-- 6. Tabel Jadwal Pelajaran (Class Schedules)
CREATE TABLE IF NOT EXISTS class_schedules (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    grade_class VARCHAR(20) NOT NULL,      -- '1A', '5A', '6B'
    day_name ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL,
    period_number TINYINT UNSIGNED NOT NULL, -- Jam ke-1, 2, dst
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    classroom VARCHAR(60) NOT NULL,
    academic_year VARCHAR(15) NOT NULL,    -- '2025/2026'
    semester ENUM('Ganjil', 'Genap') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_sched_grade_day (grade_class, day_name, period_number),
    INDEX idx_sched_teacher (teacher_id, day_name)
) ENGINE=InnoDB;

-- 7. Tabel Kalender Akademik (Madrasah Agenda)
CREATE TABLE IF NOT EXISTS academic_calendars (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    date_start DATE NOT NULL,
    date_end DATE NULL,
    category ENUM('ujian', 'libur', 'kegiatan', 'akademik') NOT NULL,
    location VARCHAR(120) NULL,
    academic_year VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cal_dates (date_start, date_end),
    INDEX idx_cal_category (category)
) ENGINE=InnoDB;

-- 8. Modul CBT: Sesi Ujian (Exams)
CREATE TABLE IF NOT EXISTS cbt_exams (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    grade_class VARCHAR(20) NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 60,
    total_questions SMALLINT UNSIGNED NOT NULL DEFAULT 20,
    passing_score DECIMAL(5,2) NOT NULL DEFAULT 75.00,
    status ENUM('draft', 'scheduled', 'active', 'finished') DEFAULT 'draft',
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    randomize_questions BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_exam_grade_status (grade_class, status, start_time)
) ENGINE=InnoDB;

-- 9. Modul CBT: Butir Soal (Questions)
CREATE TABLE IF NOT EXISTS cbt_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT UNSIGNED NOT NULL,
    question_type ENUM('multiple_choice', 'short_essay') DEFAULT 'multiple_choice',
    question_text TEXT NOT NULL,
    option_a TEXT NULL,
    option_b TEXT NULL,
    option_c TEXT NULL,
    option_d TEXT NULL,
    correct_answer VARCHAR(50) NOT NULL, -- 'A', 'B', 'C', 'D' atau teks kunci
    explanation TEXT NULL,
    score_weight DECIMAL(5,2) DEFAULT 10.00,
    order_index SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    FOREIGN KEY (exam_id) REFERENCES cbt_exams(id) ON DELETE CASCADE,
    INDEX idx_q_exam_order (exam_id, order_index)
) ENGINE=InnoDB;

-- 10. Modul CBT: Riwayat Pengerjaan Siswa (Attempts & Results)
CREATE TABLE IF NOT EXISTS cbt_student_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    started_at DATETIME NOT NULL,
    finished_at DATETIME NULL,
    total_score DECIMAL(5,2) DEFAULT 0.00,
    correct_count SMALLINT UNSIGNED DEFAULT 0,
    incorrect_count SMALLINT UNSIGNED DEFAULT 0,
    unanswered_count SMALLINT UNSIGNED DEFAULT 0,
    is_passed BOOLEAN DEFAULT FALSE,
    status ENUM('in_progress', 'submitted', 'graded', 'timed_out') DEFAULT 'in_progress',
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES cbt_exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_exam (exam_id, student_id),
    INDEX idx_attempt_student (student_id, is_passed)
) ENGINE=InnoDB;

-- 11. Modul CBT: Jawaban Siswa per Soal (Student Answers)
CREATE TABLE IF NOT EXISTS cbt_student_answers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    student_answer VARCHAR(255) NULL,
    is_doubt BOOLEAN DEFAULT FALSE,
    is_correct BOOLEAN DEFAULT FALSE,
    earned_score DECIMAL(5,2) DEFAULT 0.00,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES cbt_student_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES cbt_questions(id) ON DELETE CASCADE,
    UNIQUE KEY uq_attempt_question (attempt_id, question_id)
) ENGINE=InnoDB;

-- 12. Tabel Berita Sekolah & Artikel Staf Pengajar
CREATE TABLE IF NOT EXISTS news_articles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    category_id SMALLINT UNSIGNED NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at DATETIME NULL,
    views_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_news_status_published (status, published_at DESC)
) ENGINE=InnoDB;

-- 13. Tabel Dokumen Administrasi & Download Center
CREATE TABLE IF NOT EXISTS administrative_documents (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,       -- 'DOC-PPDB-01'
    title VARCHAR(200) NOT NULL,
    category ENUM('PPDB', 'Kurikulum', 'Surat Keterangan', 'Juknis Kemenag') NOT NULL,
    file_format ENUM('PDF', 'DOCX', 'XLSX') NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_kb INT UNSIGNED NOT NULL,
    download_count INT UNSIGNED DEFAULT 0,
    description TEXT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_docs_category (category, is_public)
) ENGINE=InnoDB;

-- 14. Tabel Audit Log & Statistik Kunjungan Real-time
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(30) NOT NULL,
    action_type VARCHAR(60) NOT NULL,       -- 'LOGIN', 'CBT_SUBMIT', 'DOWNLOAD_DOC'
    action_target VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_time (created_at DESC),
    INDEX idx_audit_user (user_id, action_type)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS visitor_traffic_hourly (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    log_date DATE NOT NULL,
    hour_interval TINYINT UNSIGNED NOT NULL, -- 0 s/d 23
    page_views INT UNSIGNED DEFAULT 0,
    unique_visitors INT UNSIGNED DEFAULT 0,
    UNIQUE KEY uq_date_hour (log_date, hour_interval)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
`,

  restApiCatalog: [
    {
      method: 'POST',
      endpoint: '/api/v1/auth/login',
      auth: 'Public',
      desc: 'Autentikasi pengguna (NISN/NIP + Password), mengembalikan JWT Token & role payload.',
      payload: '{ "identifier": "0134982710", "password": "••••••" }',
      response: '{ "status": "success", "token": "eyJhbGciOi...", "user": { "id": 1, "role": "siswa" } }'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/announcements',
      auth: 'Optional Bearer',
      desc: 'Mengambil daftar pengumuman terbit dengan filter kategori, pagination, & target audiens.',
      payload: 'Query: ?category=Akademik&page=1&limit=10&audience=Siswa',
      response: '{ "status": "success", "data": [...], "meta": { "total": 24, "page": 1 } }'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/announcements',
      auth: 'Bearer (Admin/Guru)',
      desc: 'Membuat pengumuman digital baru beserta opsi lampiran file dokumen.',
      payload: '{ "title": "...", "content": "...", "category_id": 1, "is_pinned": true }',
      response: '{ "status": "success", "message": "Pengumuman berhasil diterbitkan", "id": 8 }'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/schedules/:gradeClass',
      auth: 'Public',
      desc: 'Mendapatkan jadwal pelajaran berdasarkan kelas (contoh: 5A) per hari (Senin - Sabtu).',
      payload: 'Param: gradeClass="5A"',
      response: '{ "status": "success", "data": { "Senin": [...], "Selasa": [...] } }'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/academic-calendar',
      auth: 'Public',
      desc: 'Mengambil daftar kegiatan dan kalender akademik madrasah bulan/tahun berjalan.',
      payload: 'Query: ?year=2026&month=3',
      response: '{ "status": "success", "events": [...] }'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/cbt/exams/active',
      auth: 'Bearer (Siswa)',
      desc: 'Mendapatkan daftar ujian CBT aktif yang dialokasikan untuk kelas siswa.',
      payload: 'Header: Authorization: Bearer <TOKEN>',
      response: '{ "status": "success", "exams": [...] }'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/cbt/exams/:id/submit',
      auth: 'Bearer (Siswa)',
      desc: 'Mengirimkan seluruh jawaban lembar ujian CBT dan kalkulasi skor otomatis.',
      payload: '{ "answers": { "1": "C", "2": "A", "3": "Gorontalo" }, "time_spent_seconds": 720 }',
      response: '{ "status": "success", "score": 90, "is_passed": true, "correct_count": 4 }'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/documents',
      auth: 'Public',
      desc: 'Daftar dokumen administrasi yang dapat diunduh (PPDB, Kalender, Format SPTJM).',
      payload: 'Query: ?category=PPDB',
      response: '{ "status": "success", "documents": [...] }'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/dashboard/realtime-stats',
      auth: 'Bearer (Super Admin)',
      desc: 'Statistik kunjungan per jam, pengguna aktif, unduhan teratas, dan audit trail log.',
      payload: 'Header: Authorization: Bearer <ADMIN_TOKEN>',
      response: '{ "status": "success", "visitors_today": 1420, "active_now": 48, ... }'
    }
  ],

  moscowPriorities: [
    {
      category: 'Must Have (P0 - Wajib Rilis Tahap 1)',
      items: [
        'Papan Pengumuman Digital dengan status Pinned & Filter Kategori',
        'Sistem Login Berbasis Peran (RBAC: Admin, Guru, Siswa, Wali)',
        'Jadwal Pelajaran Interaktif per Kelas (1-6) dan Hari',
        'Pusat Unduhan Dokumen Administrasi Sekolah (PDF/DOCX)',
        'REST API Core Authentication & CRUD Pengumuman',
        'Desain Frontend Responsif Mobile-First dengan Tailwind CSS khas MI Al-Huda'
      ]
    },
    {
      category: 'Should Have (P1 - Sangat Penting Tahap 2)',
      items: [
        'Modul Ujian Online CBT Mandiri (Pilihan Ganda & Auto-Grading & Timer)',
        'Integrasi Kalender Akademik Madrasah (Agenda Kemenag & Libur Nasional)',
        'Dashboard Real-time Statistik Kunjungan & Aktivitas Pengguna',
        'Manajemen Berita & Artikel untuk Dewan Guru (Draft & Publish)'
      ]
    },
    {
      category: 'Could Have (P2 - Pengayaan Tahap 3)',
      items: [
        'Notifikasi Push Web & Telegram Bot untuk Siswa/Wali Murid',
        'Cetak Jadwal Pelajaran & Kartu Ujian Format PDF Otomatis',
        'Galeri Video Dokumentasi & Virtual Tour Kelas Madrasah',
        'Sinkronisasi API ke Aplikasi EMIS Kemenag'
      ]
    },
    {
      category: 'Won\'t Have (P3 - Di Luar Ruang Lingkup Versi Awal)',
      items: [
        'Sistem Pembayaran SPP Online Payment Gateway',
        'Modul Penggajian Guru & Payroll Kompleks',
        'Video Conference Tatap Muka Terintegrasi'
      ]
    }
  ]
};

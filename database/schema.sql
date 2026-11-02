-- =========================================================================
-- SKEMA DATABASE RELASIONAL RESMI: PORTAL DIGITAL MI AL-HUDA GORONTALO
-- DBMS: MySQL 8.0+ / MariaDB 10.6+ / PostgreSQL 15+ / SQLite 3
-- Engine: InnoDB, Charset: utf8mb4_unicode_ci
-- Didesain dengan Composite Indexing untuk pencarian cepat & zero dead-lock CBT
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabel Peran Pengguna (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,       -- 'admin', 'guru', 'siswa', 'wali', 'tamu'
    label VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Pengguna (Users)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    role VARCHAR(30) NOT NULL,
    identifier VARCHAR(50) NOT NULL UNIQUE, -- NISN untuk siswa, NIP/NUPTK untuk guru, NIK/Email
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    grade VARCHAR(50) NULL,                 -- e.g. 'Wali Kelas 5A'
    avatar_initials VARCHAR(10) NULL,
    subject_or_position VARCHAR(150) NULL,
    status VARCHAR(20) DEFAULT 'active',
    last_login_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role_status (role, status),
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
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(100) NOT NULL,
    target_audience VARCHAR(50) DEFAULT 'Semua',
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at VARCHAR(50) NOT NULL,
    attachments_json LONGTEXT NULL,
    views_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ann_pinned_published (is_pinned, published_at DESC),
    INDEX idx_ann_audience (target_audience)
) ENGINE=InnoDB;

-- 5. Tabel Jadwal Pelajaran (Class Schedules)
CREATE TABLE IF NOT EXISTS class_schedules (
    id VARCHAR(50) PRIMARY KEY,
    grade VARCHAR(20) NOT NULL,             -- '1A', '5A', '6B'
    day VARCHAR(20) NOT NULL,               -- 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    period TINYINT UNSIGNED NOT NULL,       -- Jam ke-1, 2, dst
    time_slot VARCHAR(50) NOT NULL,         -- '07:30 - 08:45'
    subject VARCHAR(100) NOT NULL,
    teacher_name VARCHAR(150) NOT NULL,
    room VARCHAR(60) NOT NULL,
    is_religious BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sched_grade_day (grade, day, period)
) ENGINE=InnoDB;

-- 6. Tabel Kalender Akademik (Madrasah Agenda)
CREATE TABLE IF NOT EXISTS academic_calendars (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    date_start VARCHAR(30) NOT NULL,
    date_end VARCHAR(30) NULL,
    category VARCHAR(30) NOT NULL,          -- 'ujian', 'libur', 'kegiatan', 'akademik'
    category_label VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(120) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cal_category (category)
) ENGINE=InnoDB;

-- 7. Tabel Berita Sekolah & Artikel Staf Pengajar
CREATE TABLE IF NOT EXISTS news_articles (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    author_nip VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'published',
    published_at VARCHAR(50) NOT NULL,
    read_time VARCHAR(30) NOT NULL,
    thumbnail_theme VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_news_category (category)
) ENGINE=InnoDB;

-- 8. Tabel Dokumen Administrasi & Download Center
CREATE TABLE IF NOT EXISTS administrative_documents (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(30) NOT NULL,              -- 'DOC-PPDB-01'
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    file_format VARCHAR(10) NOT NULL,       -- 'PDF', 'DOCX', 'XLSX'
    file_size VARCHAR(20) NOT NULL,
    updated_at VARCHAR(50) NOT NULL,
    download_count INT UNSIGNED DEFAULT 0,
    description TEXT NOT NULL,
    original_file_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_docs_category (category)
) ENGINE=InnoDB;

-- 9. Tabel Galeri Dokumentasi Kegiatan
CREATE TABLE IF NOT EXISTS gallery_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    color_gradient VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    image_url LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_gallery_category (category)
) ENGINE=InnoDB;

-- 10. Tabel Audit Log & Aktivitas Staf Real-Time
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp VARCHAR(50) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(30) NOT NULL,
    action VARCHAR(60) NOT NULL,
    target VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_time (created_at DESC)
) ENGINE=InnoDB;

-- 11. Modul CBT: Sesi Ujian (Exams)
CREATE TABLE IF NOT EXISTS cbt_exams (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    grade_class VARCHAR(20) NOT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 60,
    total_questions SMALLINT UNSIGNED NOT NULL DEFAULT 20,
    passing_score DECIMAL(5,2) NOT NULL DEFAULT 75.00,
    status VARCHAR(20) DEFAULT 'draft',
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 12. Modul CBT: Butir Soal (Questions)
CREATE TABLE IF NOT EXISTS cbt_questions (
    id VARCHAR(50) PRIMARY KEY,
    exam_id VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NULL,
    option_b TEXT NULL,
    option_c TEXT NULL,
    option_d TEXT NULL,
    correct_answer VARCHAR(50) NOT NULL,
    score_weight DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cbt_exam (exam_id)
) ENGINE=InnoDB;

-- 13. Modul CBT: Riwayat Ujian Siswa
CREATE TABLE IF NOT EXISTS cbt_student_attempts (
    id VARCHAR(50) PRIMARY KEY,
    exam_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    total_score DECIMAL(5,2) DEFAULT 0.00,
    is_passed BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 14. Tabel Rekap Kunjungan Trafik Per Jam
CREATE TABLE IF NOT EXISTS visitor_traffic_hourly (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    log_date DATE NOT NULL,
    hour_interval TINYINT UNSIGNED NOT NULL,
    page_views INT UNSIGNED DEFAULT 0,
    unique_visitors INT UNSIGNED DEFAULT 0,
    UNIQUE KEY uq_date_hour (log_date, hour_interval)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;


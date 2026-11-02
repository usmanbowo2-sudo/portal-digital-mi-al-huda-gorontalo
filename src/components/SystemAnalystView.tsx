import React, { useState } from 'react';
import { SYSTEM_ANALYST_PRD } from '../data/systemAnalystDoc';
import {
  FileCode2,
  Database,
  Network,
  ClipboardList,
  Copy,
  Check,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const SystemAnalystView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analisis' | 'database' | 'api' | 'prd' | 'android'>('analisis');
  const [copiedSQL, setCopiedSQL] = useState(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SYSTEM_ANALYST_PRD.databaseDDL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Analyst Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                System Analyst Blueprint
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {SYSTEM_ANALYST_PRD.version}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display mt-1">
              Dokumen Arsitektur &amp; Analisis Sistem Terpadu
            </h2>
            <p className="text-xs text-slate-500">
              Spesifikasi teknis, skema basis data efisien, desain modular REST API, serta komparasi framework PHP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'database' && (
              <button
                onClick={handleCopySQL}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSQL ? 'SQL Tersalin!' : 'Salin Skema DDL'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-3 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('analisis')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'analisis'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>1. Analisis PHP: Slim vs CI4</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'database'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Skema Database Efisien</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'api'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>3. Arsitektur REST API Modular</span>
          </button>

          <button
            onClick={() => setActiveTab('prd')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'prd'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>4. Dokumen PRD &amp; User Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'android'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>5. Arsitektur Android &amp; Hosting</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Analisis Framework PHP (Slim 4 vs CodeIgniter 4) */}
      {activeTab === 'analisis' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Zap className="w-5 h-5" />
              <h3 className="text-base font-bold font-display">
                Jawaban Sistem Analis: "Bisakah sistem ini saya bikin dengan PHP dan framework ringan seperti CodeIgniter atau Slim?"
              </h3>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-2">
              <p className="font-semibold text-emerald-900">
                JAWABAN TEGAS: SANGAT BISA, BAHKAN INI ADALAH PILIHAN YANG SANGAT CERDAS &amp; TEPAT SASARAN.
              </p>
              <p>
                Untuk institusi madrasah (MI Al-Huda Gorontalo) yang umumnya menggunakan shared hosting cPanel atau server lokal dengan sumber daya hemat, memilih framework ringan seperti <strong>CodeIgniter 4</strong> atau <strong>Slim Framework 4</strong> jauh lebih efisien dibandingkan memaksakan monolitik berat (seperti Laravel full-stack) yang memakan RAM besar dan boot-time lambat.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-1/4">Parameter Evaluasi</th>
                    <th className="p-3 w-1/3 text-emerald-800">Slim Framework 4 (Micro)</th>
                    <th className="p-3 w-1/3 text-blue-800">CodeIgniter 4 (Lightweight)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {SYSTEM_ANALYST_PRD.phpFrameworkAnalysis.comparison.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                        {item.aspect}
                        <div className="text-[11px] font-normal text-slate-500 mt-1">
                          Catatan Analis: {item.analystNote}
                        </div>
                      </td>
                      <td className="p-3 bg-emerald-50/20 text-slate-800 leading-relaxed">
                        {item.slim4}
                      </td>
                      <td className="p-3 bg-blue-50/20 text-slate-800 leading-relaxed">
                        {item.ci4}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recommendation Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Rekomendasi Arsitek Sistem untuk MI Al-Huda Gorontalo:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                <li>
                  <strong>PILIHAN UTAMA: CodeIgniter 4</strong> — Mengapa? Karena CI4 sudah memiliki Query Builder, Database Migrations bawaan, ResourceController untuk REST API, CORS Filter, serta dokumentasi bahasa Indonesia yang sangat melimpah. Jika suatu saat staf pengajar atau teknisi madrasah berganti, kurva belajarnya jauh lebih mudah.
                </li>
                <li>
                  <strong>PILIHAN ALTERNATIF: Slim Framework 4</strong> — Pilih Slim 4 jika Anda ingin arsitektur <em>pure headless microservices</em> di mana Slim murni hanya melayani route JSON REST API dan diakses oleh frontend decoupled (seperti React/Vite yang saat ini kita bangun).
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Skema Database Relasional Efisien */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Skema Relasional MySQL 8.0+ / MariaDB / PostgreSQL
                </h3>
                <p className="text-xs text-slate-500">
                  Didesain normalisasi 3NF, Foreign Keys terindeks, dan teknik Zero-Deadlock untuk modul CBT concurrent
                </p>
              </div>

              <button
                onClick={handleCopySQL}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs shrink-0"
              >
                {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSQL ? 'Tersalin ke Clipboard' : 'Salin Kode SQL DDL'}</span>
              </button>
            </div>

            {/* Table Highlights Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block">14 Tabel Terstruktur</span>
                <span className="text-slate-500">RBAC, Jadwal, CBT, Berita</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block">Composite Indexing</span>
                <span className="text-slate-500">Pencarian &lt; 5ms</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block">CBT Session Isolation</span>
                <span className="text-slate-500">Anti-bentrok saat ujian serentak</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block">Audit Log Terpadu</span>
                <span className="text-slate-500">Rekam jejak kunjungan &amp; unduhan</span>
              </div>
            </div>

            {/* SQL Code Block */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>schema_mi_alhuda_gorontalo.sql</span>
                <span>InnoDB · UTF8MB4</span>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed text-emerald-300">
                <code>{SYSTEM_ANALYST_PRD.databaseDDL}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Arsitektur REST API Modular */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Katalog Endpoint REST API Modular (OpenAPI 3.0 Standard)
              </h3>
              <p className="text-xs text-slate-500">
                Desain arsitektur API decoupled untuk mendukung frontend web, mobile app wali santri, dan papan display madrasah
              </p>
            </div>

            {/* API Directory Structure Blueprint */}
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs space-y-1">
              <span className="text-amber-400 font-bold">// Struktur Direktori Backend Modular (CodeIgniter 4 / Slim 4):</span>
              <p className="text-slate-400">app/</p>
              <p className="text-slate-400">├── Controllers/Api/V1/ (AuthController, AnnouncementController, CbtController, ScheduleController)</p>
              <p className="text-slate-400">├── Middleware/Filters/ (CorsFilter, JwtAuthFilter, RolePermissionFilter, RateLimitFilter)</p>
              <p className="text-slate-400">├── Models/ (AnnouncementModel, ScheduleModel, ExamModel, StudentAttemptModel)</p>
              <p className="text-slate-400">├── Services/ (CbtGradingService, NotificationService, AuditLoggerService)</p>
              <p className="text-slate-400">└── Config/Routes.php (Grup route v1 dengan format standar JSON)</p>
            </div>

            {/* Endpoints Table */}
            <div className="space-y-3">
              {SYSTEM_ANALYST_PRD.restApiCatalog.map((api, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded ${
                          api.method === 'GET'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {api.method}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {api.endpoint}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Autentikasi: {api.auth}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{api.desc}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 truncate">
                      <span className="text-slate-400 block font-sans">Request / Query:</span>
                      <span className="text-slate-800">{api.payload}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 truncate">
                      <span className="text-slate-400 block font-sans">Sample Response:</span>
                      <span className="text-emerald-700">{api.response}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Dokumen PRD & Alur Pengguna */}
      {activeTab === 'prd' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Product Requirement Document (PRD)
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                {SYSTEM_ANALYST_PRD.projectTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Lembaga: {SYSTEM_ANALYST_PRD.institution} · Tanggal: {SYSTEM_ANALYST_PRD.date}
              </p>
            </div>

            {/* Executive Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">Ringkasan Eksekutif:</span>
              {SYSTEM_ANALYST_PRD.executiveSummary}
            </div>

            {/* User Flow Diagrams (Step by Step) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Alur Pengguna Utama (User Journeys)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Journey 1 */}
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                  <span className="font-bold text-emerald-950 block">Alur 1: Siswa Mengakses Ujian CBT</span>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
                    <li>Siswa login menggunakan NISN &amp; password.</li>
                    <li>Sistem memvalidasi token JWT &amp; alokasi kelas.</li>
                    <li>Pilih daftar ujian aktif &amp; klik Mulai.</li>
                    <li>Pengerjaan soal dengan live countdown timer.</li>
                    <li>Auto-grade menghitung skor &amp; simpan ke log audit.</li>
                  </ol>
                </div>

                {/* Journey 2 */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <span className="font-bold text-blue-950 block">Alur 2: Guru Menerbitkan Pengumuman</span>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
                    <li>Guru login dengan NIP/NUPTK.</li>
                    <li>Akses tombol "Terbitkan Pengumuman".</li>
                    <li>Input judul, kategori, audiens, &amp; lampiran PDF.</li>
                    <li>Backend menyimpan ke database &amp; kirim broadcast.</li>
                    <li>Pengumuman langsung terbit di papan digital.</li>
                  </ol>
                </div>

                {/* Journey 3 */}
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                  <span className="font-bold text-purple-950 block">Alur 3: Orang Tua Unduh Dokumen</span>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
                    <li>Wali murid membuka tab "Dokumen Administrasi".</li>
                    <li>Filter kategori "PPDB" atau "Surat Keterangan".</li>
                    <li>Klik "Unduh Berkas Sekarang".</li>
                    <li>Sistem menambah counter unduhan &amp; catat IP log.</li>
                    <li>File PDF/DOCX terunduh ke perangkat wali.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Prioritas Fitur MoSCoW */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Prioritas Pengembangan Fitur (Metode MoSCoW)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SYSTEM_ANALYST_PRD.moscowPriorities.map((group, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block border-b border-slate-100 pb-1.5">
                      {group.category}
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {group.items.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold shrink-0">✓</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Arsitektur Android & Panduan Kebutuhan Hosting */}
      {activeTab === 'android' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-emerald-800">
              <Layers className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold font-display">
                Analisis Sistem: "Jika Dibikin Jadi Aplikasi Android, Apakah Masih Perlu Hosting?"
              </h3>
            </div>

            {/* Verdict Box */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-2">
              <p className="font-extrabold text-emerald-900 text-sm sm:text-base">
                JAWABAN SISTEM ANALIS: YA, TETAP MUTLAK MEMBUTUHKAN HOSTING / SERVER.
              </p>
              <p>
                Aplikasi Android (file <code>.apk</code> yang dipasang di HP siswa, guru, dan wali santri) hanya berfungsi sebagai <strong>tampilan layar (Frontend Client)</strong>. Aplikasi Android tidak bisa menyimpan data bersama untuk seluruh pengguna tanpa adanya <strong>Pusat Data Terpadu (Backend Server di Hosting)</strong>.
              </p>
            </div>

            {/* Visual Architecture Diagram */}
            <div className="p-5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono font-bold text-amber-300 block uppercase tracking-wider">
                Diagram Alur Arsitektur Android Client-Server MI Al-Huda
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                {/* Box 1: Android Client */}
                <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-1.5">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span>📱 1. HP Android Pengguna</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                    Dipasang di ratusan HP santri &amp; dewan guru. Berisi UI antarmuka (Kotlin, Flutter, atau PWA).
                  </p>
                  <span className="text-[10px] text-amber-300/80 block">Menyimpan: Token Login JWT</span>
                </div>

                {/* Box 2: Internet API Bridge */}
                <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-1.5">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <span>🌐 2. Hosting / Server Backend</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                    Menjalankan REST API PHP (CodeIgniter 4 / Slim 4). Menghitung nilai ujian CBT, validasi hak akses, dan broadcast notifikasi.
                  </p>
                  <span className="text-[10px] text-cyan-300/80 block">Protokol: HTTPS / JSON REST API</span>
                </div>

                {/* Box 3: Central Database */}
                <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 space-y-1.5">
                  <div className="text-purple-400 font-bold flex items-center gap-1.5">
                    <span>🗄️ 3. Database &amp; Storage Pusat</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                    Database MySQL menyimpan seluruh pengumuman, jadwal kelas 1-6, bank soal ujian, dan arsip PDF berkas PPDB.
                  </p>
                  <span className="text-[10px] text-purple-300/80 block">Lokasi: Server Hosting MI Al-Huda</span>
                </div>
              </div>
            </div>

            {/* 4 Reasons Why Hosting is Mandatory */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                4 Alasan Krusial Mengapa Aplikasi Android Wajib Menggunakan Hosting:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">1. Sinkronisasi Data Bersama (Centralized Data)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Ketika Ustadz Farhan menerbitkan pengumuman darurat, pengumuman tersebut harus tersimpan di database server agar seluruh siswa yang membuka aplikasi Android di rumahnya masing-masing langsung menerima update terbaru.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">2. Keamanan Kunci Jawaban &amp; Ujian CBT</span>
                  <p className="text-slate-600 leading-relaxed">
                    Jika tidak ada server, soal dan kunci jawaban terpaksa ditanam di dalam file APK Android siswa. Ini sangat bahaya karena siswa yang melek IT bisa membongkar (decompile) file APK dan melihat kunci jawaban sebelum ujian. Dengan hosting, kunci jawaban tersimpan aman di server!
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">3. Ukuran File Aplikasi Tetap Kecil (&lt; 15 MB)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Dokumen administrasi (PDF formulir PPDB, silabus, juknis Kemenag) dan foto galeri kegiatan madrasah disimpan di harddisk hosting. Santri hanya mengunduh berkas saat mereka butuhkan, sehingga memori HP santri tidak cepat penuh.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">4. Pengiriman Notifikasi Push (Firebase FCM)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Agar aplikasi Android santri berdering atau memunculkan notifikasi pop-up saat ada pengumuman libur mendadak, server hosting perlu mengirimkan sinyal pemicu (trigger) melalui Google Firebase Cloud Messaging (FCM).
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Budget-Friendly Hosting Options for Madrasah */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3 Opsi Pilihan Hosting Paling Hemat &amp; Efisien untuk MI Al-Huda Gorontalo:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Option 1 */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Paling Praktis
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-1">Shared Hosting cPanel</h5>
                    <p className="text-slate-500 font-mono text-xs">Biaya: ~Rp 25.000 - 50.000 / bulan</p>
                    <p className="text-slate-600 leading-relaxed pt-1">
                      Cocok untuk tahap awal. Mudah dikelola staf madrasah melalui antarmuka cPanel (upload file PHP CodeIgniter 4 dan database MySQL via phpMyAdmin).
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">Trafik: Cukup s/d 2.000 santri/hari</span>
                </div>

                {/* Option 2 */}
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-300 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-white bg-emerald-800 px-2 py-0.5 rounded">
                      Rekomendasi Analis
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-1">Cloud VPS Murah (1GB RAM)</h5>
                    <p className="text-slate-500 font-mono text-xs">Biaya: ~Rp 70.000 - 90.000 / bulan</p>
                    <p className="text-slate-600 leading-relaxed pt-1">
                      Sangat stabil untuk ujian online CBT serentak tanpa takut kehabisan kuota RAM. Menggunakan Linux Ubuntu + Nginx + PHP 8.2-FPM.
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold">Kecepatan: Respons &lt; 20ms</span>
                </div>

                {/* Option 3 */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Rp 0 / Tanpa Sewa
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-1">Server Lab Sekolah Sendiri</h5>
                    <p className="text-slate-500 font-mono text-xs">Biaya Bulanan: Rp 0 (Gratis)</p>
                    <p className="text-slate-600 leading-relaxed pt-1">
                      Manfaatkan 1 unit komputer di Lab Madrasah MI Al-Huda sebagai server lokal, lalu gunakan <strong>Cloudflare Tunnel</strong> agar bisa diakses dari HP Android santri di luar sekolah.
                    </p>
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold">Syarat: Internet Lab Madrasah Aktif</span>
                </div>
              </div>
            </div>

            {/* Smart Analyst Tip: PWA Alternative */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5 text-amber-950">
              <span className="font-bold block text-amber-900">
                💡 Saran Cerdas Sistem Analis (Hemat Biaya Rp 400.000 Akun Google Play Store):
              </span>
              <p className="leading-relaxed">
                Daripada harus membayar biaya pendaftaran <em>Google Play Console</em> ($25 atau sekitar Rp 400.000) untuk mengunggah aplikasi ke Play Store, Anda bisa menerapkan teknologi <strong>PWA (Progressive Web App)</strong>.
              </p>
              <p className="leading-relaxed">
                Dengan PWA, siswa atau wali santri cukup membuka link website madrasah di Chrome Android, lalu muncul tombol otomatis <em>"Tambahkan ke Layar Utama"</em>. Seketika ikon MI Al-Huda akan muncul di menu HP santri, terbuka secara *full-screen* tanpa address bar seperti aplikasi Android native!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

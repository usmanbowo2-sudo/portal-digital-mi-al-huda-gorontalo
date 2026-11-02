import React, { useState } from 'react';
import { Announcement, UserRole, UserProfile } from '../types';
import { filterAnnouncements, canManageContent } from '../utils/portalLogic';
import {
  Search,
  Pin,
  FileText,
  Download,
  PlusCircle,
  Calendar,
  User,
  X,
  Edit3,
  Trash2,
  AlertTriangle,
  Building2,
  Sparkles,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface DigitalBoardProps {
  announcements: Announcement[];
  currentRole: UserRole;
  currentUser?: UserProfile;
  onAddAnnouncement: (newAnn: Announcement) => void;
  onEditAnnouncement?: (updatedAnn: Announcement) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onDownloadAttachment: (attachmentName: string) => void;
}

export const DigitalBoard: React.FC<DigitalBoardProps> = ({
  announcements,
  currentRole,
  currentUser,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onDownloadAttachment,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAudience, setSelectedAudience] = useState<string>('Semua');
  const [readingAnnouncement, setReadingAnnouncement] = useState<Announcement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Edit State
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<'Akademik' | 'Kesiswaan' | 'Penting' | 'Keagamaan' | 'Administrasi'>('Akademik');
  const [editAudience, setEditAudience] = useState<'Semua' | 'Siswa' | 'Guru'>('Semua');
  const [editIsPinned, setEditIsPinned] = useState(false);
  const [editAttachmentName, setEditAttachmentName] = useState('');

  // Delete State
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);

  // New announcement form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Akademik' | 'Kesiswaan' | 'Penting' | 'Keagamaan' | 'Administrasi'>('Akademik');
  const [newAudience, setNewAudience] = useState<'Semua' | 'Siswa' | 'Guru'>('Semua');
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const categories = ['Semua', 'Penting', 'Akademik', 'Keagamaan', 'Kesiswaan', 'Administrasi'];

  const filteredItems = filterAnnouncements(
    announcements,
    activeCategory,
    searchQuery,
    selectedAudience
  );

  const canManage = canManageContent(currentRole);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: newContent.trim(),
      category: newCategory,
      targetAudience: newAudience,
      isPinned: newIsPinned,
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' WITA',
      authorName: currentUser?.name || (currentRole === 'admin' ? 'Administrator MI Al-Huda' : 'Dewan Guru MI Al-Huda'),
      authorRole: currentUser?.subjectOrPosition || (currentRole === 'admin' ? 'Admin Madrasah' : 'Staf Pengajar'),
      viewsCount: 1,
      attachments: newAttachmentName.trim()
        ? [
            {
              name: newAttachmentName.trim(),
              size: '640 KB',
              type: 'PDF',
              url: '#download',
            },
          ]
        : undefined,
    };

    onAddAnnouncement(newAnnouncement);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewAttachmentName('');
  };

  const openEditModal = (item: Announcement) => {
    setEditingAnnouncement(item);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category);
    setEditAudience(item.targetAudience);
    setEditIsPinned(item.isPinned);
    setEditAttachmentName(item.attachments?.[0]?.name || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editTitle.trim() || !editContent.trim()) return;

    const updated: Announcement = {
      ...editingAnnouncement,
      title: editTitle.trim(),
      slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: editContent.trim(),
      category: editCategory,
      targetAudience: editAudience,
      isPinned: editIsPinned,
      attachments: editAttachmentName.trim()
        ? [
            {
              name: editAttachmentName.trim(),
              size: editingAnnouncement.attachments?.[0]?.size || '520 KB',
              type: 'PDF',
              url: '#download',
            },
          ]
        : undefined,
    };

    if (onEditAnnouncement) {
      onEditAnnouncement(updated);
    }
    setEditingAnnouncement(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingAnnouncement) return;
    if (onDeleteAnnouncement) {
      onDeleteAnnouncement(deletingAnnouncement.id);
    }
    setDeletingAnnouncement(null);
  };

  const handleReadAnnouncement = (item: Announcement) => {
    const incremented: Announcement = {
      ...item,
      viewsCount: (item.viewsCount || 0) + 1,
    };
    setReadingAnnouncement(incremented);
    if (onEditAnnouncement) {
      onEditAnnouncement(incremented);
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Campus Showcase Card with Light Sweep Effect */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-900/30 shadow-xl bg-slate-950 group">
        {/* Responsive Image with Hover Zoom */}
        <div className="relative h-64 sm:h-80 md:h-[390px] w-full overflow-hidden">
          <img
            src="/gedung-mi-alhuda.jpg"
            alt="Gedung Kampus Hijau MI Al-Huda Gorontalo"
            className="w-full h-full object-cover object-[center_60%] group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Light Sweep (Kilatan Cahaya Menyapu Diagonal) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-light-sweep absolute top-0 -left-1/3 transform -skew-x-25 filter blur-[2px]" />
          </div>

          {/* Multi-layered Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent z-10 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-transparent to-transparent z-10" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-900/85 backdrop-blur-md border border-emerald-500/50 rounded-full text-emerald-200 text-xs font-semibold shadow-md">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Gedung Pembelajaran &amp; Asrama Santri</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 backdrop-blur-md border border-amber-300 text-emerald-950 text-xs font-bold rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
              <span>Kampus Hijau Al-Huda</span>
            </div>
          </div>

          {/* Bottom Captions & Highlights */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Kota Gorontalo • Bumi Serambi Madinah</span>
              <span className="hidden sm:inline text-emerald-500">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Terakreditasi Unggul
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight leading-snug drop-shadow-md">
              Pusat Pendidikan Islami &amp; Tahfidz Al-Qur'an Terpadu
            </h3>

            <p className="text-xs sm:text-sm text-slate-200/90 max-w-2xl leading-relaxed hidden sm:block">
              Fasilitas ruang kelas representatif, asrama santri berwawasan lingkungan hijau, serta sarana pembelajaran berbasis teknologi digital untuk kemajuan generasi qur'ani.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-lg text-[11px] font-semibold text-white">
                🏛️ Gedung 3 Lantai
              </span>
              <span className="px-2.5 py-1 bg-emerald-600/40 backdrop-blur-md border border-emerald-400/40 rounded-lg text-[11px] font-semibold text-emerald-200">
                🌿 Lingkungan Asri &amp; Nyaman
              </span>
              <span className="px-2.5 py-1 bg-amber-500/30 backdrop-blur-md border border-amber-400/40 rounded-lg text-[11px] font-semibold text-amber-200">
                📖 Program Tahfidz Mandiri
              </span>
              <span className="px-2.5 py-1 bg-teal-600/40 backdrop-blur-md border border-teal-400/40 rounded-lg text-[11px] font-semibold text-teal-200">
                🌐 Portal Terbuka Tanpa Login Siswa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Papan Pengumuman Digital Madrasah
              </h2>
              {canManage && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Mode CRUD Aktif ({currentRole === 'admin' ? 'Admin' : 'Dewan Guru'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat warta resmi, edaran akademik, dan agenda MI Al-Huda Gorontalo
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Terbitkan Pengumuman</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
              />
            </div>

            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              aria-label="Filter target audiens"
            >
              <option value="Semua">Semua Sasaran</option>
              <option value="Siswa">Untuk Siswa &amp; Wali</option>
              <option value="Guru">Untuk Dewan Guru</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">Tidak ada pengumuman yang sesuai</h4>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs hover:shadow-xs ${
                item.isPinned
                  ? 'border-amber-300/80 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-medium">
                    {item.isPinned && (
                      <span className="flex items-center gap-1 text-amber-700 font-semibold">
                        <Pin className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                        Disematkan
                      </span>
                    )}
                    {item.isPinned && <span aria-hidden="true">·</span>}
                    <span className="text-emerald-800 font-semibold">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Sasaran: {item.targetAudience}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.publishedAt}</span>
                  </div>

                  <h3
                    onClick={() => handleReadAnnouncement(item)}
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer leading-snug"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  {/* Attachments Section */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      {item.attachments.map((att, i) => (
                        <button
                          key={i}
                          onClick={() => onDownloadAttachment(att.name)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors border border-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                          <span className="truncate max-w-[200px]">{att.name}</span>
                          <span className="text-[10px] text-slate-500 tabular-nums">({att.size})</span>
                          <Download className="w-3 h-3 text-slate-600 ml-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Author & Action Buttons */}
                <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-xs text-slate-500 text-left sm:text-right">
                    <span className="font-medium text-slate-800 block">{item.authorName}</span>
                    <span className="text-[11px] text-slate-400 block">{item.authorRole}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReadAnnouncement(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Baca &rarr;
                    </button>

                    {/* CRUD Actions for Admin and Dewan Guru */}
                    {canManage && (
                      <>
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Pengumuman"
                          className="p-1.5 text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-lg transition-colors border border-blue-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAnnouncement(item)}
                          title="Hapus Pengumuman"
                          className="p-1.5 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 rounded-lg transition-colors border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Reading Detail Modal */}
      {readingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <span>{readingAnnouncement.category}</span>
                <span aria-hidden="true">·</span>
                <span>Sasaran: {readingAnnouncement.targetAudience}</span>
              </div>
              <button
                onClick={() => setReadingAnnouncement(null)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {readingAnnouncement.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 py-1 border-y border-slate-100">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {readingAnnouncement.authorName} ({readingAnnouncement.authorRole})
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {readingAnnouncement.publishedAt}
                </span>
              </div>

              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed space-y-3">
                {readingAnnouncement.content}
              </div>

              {readingAnnouncement.attachments && readingAnnouncement.attachments.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
                    Lampiran Dokumen Resmi:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {readingAnnouncement.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-800 truncate">{att.name}</p>
                            <p className="text-[11px] text-slate-400">{att.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onDownloadAttachment(att.name)}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>MI Al-Huda Gorontalo · Papan Informasi Digital</span>
              <button
                onClick={() => setReadingAnnouncement(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Terbitkan Pengumuman Baru</h3>
                <p className="text-xs text-emerald-200">Hak Akses: {currentRole === 'admin' ? 'Administrator' : 'Dewan Guru'}</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Ujian Tengah Semester Genap 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Penting">Penting</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Administrasi">Administrasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sasaran Pembaca
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e: any) => setNewAudience(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Semua">Semua Warga Madrasah</option>
                    <option value="Siswa">Khusus Siswa &amp; Wali</option>
                    <option value="Guru">Khusus Dewan Guru</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pengumuman
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan detail pengumuman secara lengkap dan jelas..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lampiran Dokumen (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surat_Edaran_Libur_2026.pdf"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newIsPinned}
                  onChange={(e) => setNewIsPinned(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
                <label htmlFor="pinCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Sematkan di bagian teratas (Pinned Announcement)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Terbitkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {editingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Edit Pengumuman</h3>
                <p className="text-xs text-blue-200">Perbarui rincian pengumuman digital</p>
              </div>
              <button
                onClick={() => setEditingAnnouncement(null)}
                className="p-1 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e: any) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Penting">Penting</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Administrasi">Administrasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sasaran Pembaca
                  </label>
                  <select
                    value={editAudience}
                    onChange={(e: any) => setEditAudience(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-700"
                  >
                    <option value="Semua">Semua Warga Madrasah</option>
                    <option value="Siswa">Khusus Siswa &amp; Wali</option>
                    <option value="Guru">Khusus Dewan Guru</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pengumuman
                </label>
                <textarea
                  required
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lampiran Dokumen (Opsional)
                </label>
                <input
                  type="text"
                  value={editAttachmentName}
                  onChange={(e) => setEditAttachmentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editPinCheck"
                  checked={editIsPinned}
                  onChange={(e) => setEditIsPinned(e.target.checked)}
                  className="rounded text-blue-700 focus:ring-blue-600 w-4 h-4"
                />
                <label htmlFor="editPinCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Sematkan di bagian teratas (Pinned Announcement)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAnnouncement(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white font-display">Hapus Pengumuman</h3>
              </div>
              <button
                onClick={() => setDeletingAnnouncement(null)}
                className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-rose-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus pengumuman berikut dari papan informasi digital?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{deletingAnnouncement.title}</h4>
                <p className="text-xs text-emerald-800 font-medium">Kategori: {deletingAnnouncement.category}</p>
                <p className="text-xs text-slate-400">Diterbitkan: {deletingAnnouncement.publishedAt}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingAnnouncement(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Hapus Pengumuman
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { NewsArticle, UserRole } from '../types';
import { canManageContent } from '../utils/portalLogic';
import {
  Newspaper,
  PlusCircle,
  Clock,
  User,
  BookOpen,
  X,
  Edit3,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface NewsManagerProps {
  articles: NewsArticle[];
  currentRole: UserRole;
  onAddArticle: (article: NewsArticle) => void;
  onEditArticle?: (updatedArticle: NewsArticle) => void;
  onDeleteArticle?: (id: string) => void;
}

export const NewsManager: React.FC<NewsManagerProps> = ({
  articles,
  currentRole,
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit State
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<'Prestasi' | 'Kegiatan Madrasah' | 'Kultum & Opini' | 'Informasi Kemenag'>('Kegiatan Madrasah');

  // Delete State
  const [deletingArticle, setDeletingArticle] = useState<NewsArticle | null>(null);

  // New article form
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Prestasi' | 'Kegiatan Madrasah' | 'Kultum & Opini' | 'Informasi Kemenag'>('Kegiatan Madrasah');

  const canManage = canManageContent(currentRole);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newArticle: NewsArticle = {
      id: `news-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      author: currentRole === 'admin' ? 'Administrator MI Al-Huda' : 'Dewan Guru MI Al-Huda',
      authorNip: currentRole === 'admin' ? 'admin' : '198904152014021003',
      category: category,
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '3 menit baca',
      thumbnailTheme: 'from-emerald-700 to-teal-900',
    };

    onAddArticle(newArticle);
    setIsCreateOpen(false);
    setTitle('');
    setExcerpt('');
    setContent('');
  };

  const openEditModal = (item: NewsArticle) => {
    setEditingArticle(item);
    setEditTitle(item.title);
    setEditExcerpt(item.excerpt);
    setEditContent(item.content);
    setEditCategory(item.category);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editTitle.trim() || !editContent.trim()) return;

    const updated: NewsArticle = {
      ...editingArticle,
      title: editTitle.trim(),
      slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: editExcerpt.trim() || editTitle.trim(),
      content: editContent.trim(),
      category: editCategory,
    };

    if (onEditArticle) {
      onEditArticle(updated);
    }
    setEditingArticle(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingArticle) return;
    if (onDeleteArticle) {
      onDeleteArticle(deletingArticle.id);
    }
    setDeletingArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Warta &amp; Publikasi Madrasah
              </h2>
              {canManage && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Hak Kelola CRUD ({currentRole === 'admin' ? 'Admin' : 'Dewan Guru'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dokumentasi capaian santri, opini keislaman guru, dan kabar terbaru madrasah
            </p>
          </div>

          {canManage && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Thematic Header Visual Box */}
              <div className={`h-36 bg-gradient-to-br ${item.thumbnailTheme} p-4 flex flex-col justify-between text-white relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded text-emerald-200 border border-white/10">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-white/80 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {item.readTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-emerald-300" />
                  <span className="text-xs font-mono text-emerald-100">MI Al-Huda Gorontalo</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="font-medium text-slate-700">{item.author}</span>
                  <span>·</span>
                  <span>{item.publishedAt}</span>
                </div>

                <h3
                  onClick={() => setSelectedArticle(item)}
                  className="text-base font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(item)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Baca Selengkapnya</span>
              </button>

              {/* CRUD Actions for Admin and Dewan Guru */}
              {canManage && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit Artikel"
                    className="p-1.5 text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-lg transition-colors border border-blue-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingArticle(item)}
                    title="Hapus Artikel"
                    className="p-1.5 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 rounded-lg transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Read Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <span className="font-semibold uppercase">{selectedArticle.category}</span>
                <span>·</span>
                <span>{selectedArticle.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="font-medium text-slate-800">{selectedArticle.author}</span>
                <span>·</span>
                <span>{selectedArticle.publishedAt}</span>
              </div>

              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed space-y-3">
                {selectedArticle.content}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Article Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Tulis Artikel Warta Baru</h3>
                <p className="text-xs text-emerald-300">Hak Akses: {currentRole === 'admin' ? 'Administrator' : 'Dewan Guru'}</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Artikel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembiasaan Sholat Dhuha Berjamaah Menumbuhkan Karakter Disiplin"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Warta
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 bg-white"
                >
                  <option value="Kegiatan Madrasah">Kegiatan Madrasah</option>
                  <option value="Prestasi">Prestasi &amp; Kejuaraan</option>
                  <option value="Kultum & Opini">Kultum &amp; Opini Pendidik</option>
                  <option value="Informasi Kemenag">Informasi Kemenag</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ringkasan / Excerpt
                </label>
                <input
                  type="text"
                  placeholder="Satu atau dua kalimat ringkas sebagai gambaran artikel..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Lengkap Artikel <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi berita, liputan kegiatan, atau pesan moral secara lengkap..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Terbitkan Warta Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Edit Warta Madrasah</h3>
                <p className="text-xs text-blue-200">Perbarui naskah atau kategori warta</p>
              </div>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Artikel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Warta
                </label>
                <select
                  value={editCategory}
                  onChange={(e: any) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 bg-white"
                >
                  <option value="Kegiatan Madrasah">Kegiatan Madrasah</option>
                  <option value="Prestasi">Prestasi &amp; Kejuaraan</option>
                  <option value="Kultum & Opini">Kultum &amp; Opini Pendidik</option>
                  <option value="Informasi Kemenag">Informasi Kemenag</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ringkasan
                </label>
                <input
                  type="text"
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Artikel <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white font-display">Hapus Artikel Warta</h3>
              </div>
              <button
                onClick={() => setDeletingArticle(null)}
                className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-rose-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus artikel warta madrasah ini?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{deletingArticle.title}</h4>
                <p className="text-xs text-emerald-800 font-medium">Penulis: {deletingArticle.author} ({deletingArticle.publishedAt})</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingArticle(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Hapus Artikel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

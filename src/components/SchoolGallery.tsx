import React, { useState } from 'react';
import { GalleryItem, UserRole } from '../types';
import { canManageContent } from '../utils/portalLogic';
import {
  Camera,
  Calendar,
  Sparkles,
  BookOpen,
  Compass,
  FlaskConical,
  Trophy,
  X,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface SchoolGalleryProps {
  items: GalleryItem[];
  currentRole?: UserRole;
  onAddGalleryItem?: (newItem: GalleryItem) => void;
  onEditGalleryItem?: (updatedItem: GalleryItem) => void;
  onDeleteGalleryItem?: (id: string) => void;
}

export const SchoolGallery: React.FC<SchoolGalleryProps> = ({
  items,
  currentRole = 'admin',
  onAddGalleryItem,
  onEditGalleryItem,
  onDeleteGalleryItem,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('Semua');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Tahfidz' | 'Pramuka' | 'Classmeeting' | 'Peringatan Hari Besar' | 'Akademik'>('Tahfidz');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('BookOpen');

  // Edit Modal
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<'Tahfidz' | 'Pramuka' | 'Classmeeting' | 'Peringatan Hari Besar' | 'Akademik'>('Tahfidz');
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('BookOpen');

  // Delete Modal
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  const canManage = canManageContent(currentRole);

  const categories = ['Semua', 'Tahfidz', 'Pramuka', 'Classmeeting', 'Peringatan Hari Besar', 'Akademik'];

  const filteredItems = items.filter(
    (item) => selectedCat === 'Semua' || item.category === selectedCat
  );

  const renderIcon = (name: string) => {
    switch (name) {
      case 'BookOpen':
        return <BookOpen className="w-8 h-8 text-amber-300" />;
      case 'Compass':
        return <Compass className="w-8 h-8 text-amber-300" />;
      case 'FlaskConical':
        return <FlaskConical className="w-8 h-8 text-cyan-300" />;
      case 'Trophy':
        return <Trophy className="w-8 h-8 text-amber-300" />;
      default:
        return <Sparkles className="w-8 h-8 text-amber-300" />;
    }
  };

  const getGradientForCategory = (cat: string) => {
    switch (cat) {
      case 'Tahfidz':
        return 'from-emerald-800 to-teal-900';
      case 'Pramuka':
        return 'from-amber-800 to-yellow-950';
      case 'Classmeeting':
        return 'from-blue-800 to-indigo-950';
      case 'Peringatan Hari Besar':
        return 'from-rose-800 to-red-950';
      default:
        return 'from-emerald-900 to-slate-900';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate.trim() || new Date().toISOString().split('T')[0],
      description: newDescription.trim() || `Dokumentasi kegiatan ${newTitle.trim()} santri MI Al-Huda Gorontalo`,
      colorGradient: getGradientForCategory(newCategory),
      iconName: newIcon,
    };

    if (onAddGalleryItem) {
      onAddGalleryItem(newItem);
    }
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDate('');
    setNewDescription('');
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditDate(item.date);
    setEditDescription(item.description);
    setEditIcon(item.iconName);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;

    const updated: GalleryItem = {
      ...editingItem,
      title: editTitle.trim(),
      category: editCategory,
      date: editDate.trim(),
      description: editDescription.trim(),
      colorGradient: getGradientForCategory(editCategory),
      iconName: editIcon,
    };

    if (onEditGalleryItem) {
      onEditGalleryItem(updated);
    }
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    if (onDeleteGalleryItem) {
      onDeleteGalleryItem(deletingItem.id);
    }
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Galeri Kegiatan &amp; Dokumentasi Santri
              </h2>
              {canManage && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Hak Kelola CRUD ({currentRole === 'admin' ? 'Admin' : 'Dewan Guru'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rekam jejak aktivitas keagamaan, kepanduan pramuka, sains, dan ekstrakurikuler MI Al-Huda Gorontalo
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Dokumentasi</span>
              </button>
            )}
            <span className="text-xs text-slate-500">
              {items.length} Dokumentasi Unggulan
            </span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Graphic Container (Visual Header) */}
              <div
                onClick={() => setActiveItem(item)}
                className={`h-44 bg-gradient-to-br ${item.colorGradient} p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden`}
              >
                <div className="flex items-center justify-between text-white/90 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-white/80">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center my-auto z-10 group-hover:scale-110 transition-transform duration-300">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                    {renderIcon(item.iconName)}
                  </div>
                </div>

                <div className="text-[10px] text-white/70 font-mono z-10">
                  Dokumentasi MI Al-Huda Gorontalo
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-1.5">
                <h4
                  onClick={() => setActiveItem(item)}
                  className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                >
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveItem(item)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors"
              >
                Lihat Rincian &rarr;
              </button>

              {canManage && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit Dokumentasi"
                    className="p-1.5 text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-lg transition-colors border border-blue-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    title="Hapus Dokumentasi"
                    className="p-1.5 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 rounded-lg transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Item */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className={`p-6 bg-gradient-to-br ${activeItem.colorGradient} text-white relative`}>
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                  {activeItem.category}
                </span>
                <span className="text-xs text-white/80 font-mono">{activeItem.date}</span>
              </div>
              <h3 className="text-xl font-bold font-display">{activeItem.title}</h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeItem.description}
              </p>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-emerald-950">
                  <span className="font-bold block">Pondok Pesantren &amp; MI Al-Huda Gorontalo</span>
                  <span className="text-[11px] text-emerald-700">Mencetak Generasi Qur'ani, Berakhlak Mulia, dan Unggul Prestasi</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Tambah Dokumentasi Galeri</h3>
                <p className="text-xs text-emerald-300">Unggah agenda santri ke album madrasah</p>
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
                  Judul Kegiatan / Album <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Wisuda Tahfidz Juz 30 Angkatan X"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Kegiatan
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 bg-white"
                  >
                    <option value="Tahfidz">Tahfidz &amp; Keagamaan</option>
                    <option value="Pramuka">Pramuka &amp; Kepanduan</option>
                    <option value="Classmeeting">Classmeeting &amp; Olahraga</option>
                    <option value="Peringatan Hari Besar">Peringatan Hari Besar</option>
                    <option value="Akademik">Akademik &amp; Sains</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 12 Februari 2026"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ikon Representasi
                </label>
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 bg-white"
                >
                  <option value="BookOpen">Buku / Al-Qur'an (Tahfidz)</option>
                  <option value="Compass">Kompas / Kepanduan (Pramuka)</option>
                  <option value="FlaskConical">Laboratorium Sains</option>
                  <option value="Trophy">Piala / Kejuaraan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Dokumentasi
                </label>
                <textarea
                  rows={3}
                  placeholder="Ringkasan liputan kegiatan santri..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 resize-none"
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
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs transition-all shadow-xs"
                >
                  Simpan Dokumentasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Edit Dokumentasi Galeri</h3>
                <p className="text-xs text-blue-200">Perbarui rincian kegiatan santri</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Kegiatan / Album <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Kegiatan
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e: any) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 bg-white"
                  >
                    <option value="Tahfidz">Tahfidz &amp; Keagamaan</option>
                    <option value="Pramuka">Pramuka &amp; Kepanduan</option>
                    <option value="Classmeeting">Classmeeting &amp; Olahraga</option>
                    <option value="Peringatan Hari Besar">Peringatan Hari Besar</option>
                    <option value="Akademik">Akademik &amp; Sains</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ikon Representasi
                </label>
                <select
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 bg-white"
                >
                  <option value="BookOpen">Buku / Al-Qur'an (Tahfidz)</option>
                  <option value="Compass">Kompas / Kepanduan (Pramuka)</option>
                  <option value="FlaskConical">Laboratorium Sains</option>
                  <option value="Trophy">Piala / Kejuaraan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Dokumentasi
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs transition-all shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white font-display">Hapus Dokumentasi</h3>
              </div>
              <button
                onClick={() => setDeletingItem(null)}
                className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-rose-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus dokumentasi kegiatan ini dari galeri madrasah?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{deletingItem.title}</h4>
                <p className="text-xs text-emerald-800 font-medium">Kategori: {deletingItem.category}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Hapus Dokumentasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

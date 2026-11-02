import React, { useState } from 'react';
import { AcademicEvent, UserRole } from '../types';
import { canManageContent } from '../utils/portalLogic';
import {
  Calendar as CalendarIcon,
  Tag,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  Search,
} from 'lucide-react';

interface AcademicCalendarProps {
  events: AcademicEvent[];
  currentRole?: UserRole;
  onAddEvent?: (newEvent: AcademicEvent) => void;
  onEditEvent?: (updatedEvent: AcademicEvent) => void;
  onDeleteEvent?: (id: string) => void;
}

export const AcademicCalendar: React.FC<AcademicCalendarProps> = ({
  events,
  currentRole = 'admin',
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDateStart, setNewDateStart] = useState('');
  const [newDateEnd, setNewDateEnd] = useState('');
  const [newCategory, setNewCategory] = useState<'ujian' | 'libur' | 'kegiatan' | 'akademik'>('kegiatan');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // Edit Modal
  const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDateStart, setEditDateStart] = useState('');
  const [editDateEnd, setEditDateEnd] = useState('');
  const [editCategory, setEditCategory] = useState<'ujian' | 'libur' | 'kegiatan' | 'akademik'>('kegiatan');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // Delete Modal
  const [deletingEvent, setDeletingEvent] = useState<AcademicEvent | null>(null);

  const canManage = canManageContent(currentRole);

  const categories = [
    { key: 'semua', label: 'Semua Agenda' },
    { key: 'ujian', label: 'Ujian & Asesmen' },
    { key: 'kegiatan', label: 'Kegiatan Keagamaan' },
    { key: 'libur', label: 'Hari Libur Resmi' },
    { key: 'akademik', label: 'Administrasi & Rapor' },
  ];

  const filteredEvents = events.filter((ev) => {
    const matchCat = filterCategory === 'semua' ? true : ev.category === filterCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      q === '' ||
      ev.title.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      (ev.location && ev.location.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'ujian':
        return 'border-rose-200 bg-rose-50/60 text-rose-800';
      case 'kegiatan':
        return 'border-emerald-200 bg-emerald-50/60 text-emerald-800';
      case 'libur':
        return 'border-amber-200 bg-amber-50/60 text-amber-800';
      default:
        return 'border-blue-200 bg-blue-50/60 text-blue-800';
    }
  };

  const getCategoryLabel = (category: 'ujian' | 'libur' | 'kegiatan' | 'akademik') => {
    switch (category) {
      case 'ujian':
        return 'Asesmen & Ujian';
      case 'kegiatan':
        return 'Kegiatan Santri';
      case 'libur':
        return 'Hari Libur';
      case 'akademik':
        return 'Administrasi Rapor';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDateStart.trim()) return;

    const newEvent: AcademicEvent = {
      id: `ev-${Date.now()}`,
      title: newTitle.trim(),
      dateStart: newDateStart.trim(),
      dateEnd: newDateEnd.trim() || undefined,
      category: newCategory,
      categoryLabel: getCategoryLabel(newCategory),
      description: newDescription.trim() || 'Agenda resmi MI Al-Huda Gorontalo',
      location: newLocation.trim() || 'Kampus MI Al-Huda Gorontalo',
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDateStart('');
    setNewDateEnd('');
    setNewDescription('');
    setNewLocation('');
  };

  const openEditModal = (ev: AcademicEvent) => {
    setEditingEvent(ev);
    setEditTitle(ev.title);
    setEditDateStart(ev.dateStart);
    setEditDateEnd(ev.dateEnd || '');
    setEditCategory(ev.category);
    setEditDescription(ev.description);
    setEditLocation(ev.location || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editTitle.trim()) return;

    const updated: AcademicEvent = {
      ...editingEvent,
      title: editTitle.trim(),
      dateStart: editDateStart.trim(),
      dateEnd: editDateEnd.trim() || undefined,
      category: editCategory,
      categoryLabel: getCategoryLabel(editCategory),
      description: editDescription.trim(),
      location: editLocation.trim(),
    };

    if (onEditEvent) {
      onEditEvent(updated);
    }
    setEditingEvent(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingEvent) return;
    if (onDeleteEvent) {
      onDeleteEvent(deletingEvent.id);
    }
    setDeletingEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Kalender Akademik &amp; Agenda Madrasah
              </h2>
              {canManage && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Hak Kelola CRUD ({currentRole === 'admin' ? 'Admin' : 'Dewan Guru'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Jadwal pelaksanaan evaluasi, libur nasional/keagamaan, dan kegiatan santri MI Al-Huda Gorontalo
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda</span>
              </button>
            )}
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Tahun Ajaran 2025 / 2026
            </div>
          </div>
        </div>

        {/* Filter Categories & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setFilterCategory(cat.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  filterCategory === cat.key
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari agenda, lokasi, kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Events Timeline / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all hover:shadow-xs flex flex-col justify-between ${getCategoryStyles(
              item.category
            )}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 border border-current/20">
                  {item.categoryLabel}
                </span>

                <div className="flex items-center gap-1 text-xs font-semibold font-mono">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{item.dateStart}</span>
                  {item.dateEnd && <span> - {item.dateEnd}</span>}
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-current/15 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1 truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.location || 'Kampus MI Al-Huda'}</span>
              </div>

              {canManage && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit Agenda"
                    className="p-1 text-blue-700 hover:text-white bg-white hover:bg-blue-700 rounded-lg transition-colors border border-blue-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingEvent(item)}
                    title="Hapus Agenda"
                    className="p-1 text-rose-700 hover:text-white bg-white hover:bg-rose-700 rounded-lg transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Tambah Agenda Madrasah</h3>
                <p className="text-xs text-emerald-300">Kalender Akademik MI Al-Huda</p>
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
                  Nama Agenda / Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penilaian Akhir Semester (PAS) Genap"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 15 Mei 2026"
                    value={newDateStart}
                    onChange={(e) => setNewDateStart(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Selesai (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 22 Mei 2026"
                    value={newDateEnd}
                    onChange={(e) => setNewDateEnd(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Agenda
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 bg-white"
                  >
                    <option value="kegiatan">Kegiatan Keagamaan &amp; Santri</option>
                    <option value="ujian">Ujian &amp; Asesmen</option>
                    <option value="libur">Hari Libur Resmi</option>
                    <option value="akademik">Administrasi &amp; Rapor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Masjid / Aula Madrasah"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Keterangan singkat mengenai agenda..."
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Edit Agenda Madrasah</h3>
                <p className="text-xs text-blue-200">Perbarui tanggal atau deskripsi kegiatan</p>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Agenda / Kegiatan <span className="text-rose-500">*</span>
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
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editDateStart}
                    onChange={(e) => setEditDateStart(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="text"
                    value={editDateEnd}
                    onChange={(e) => setEditDateEnd(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Agenda
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e: any) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 bg-white"
                  >
                    <option value="kegiatan">Kegiatan Keagamaan &amp; Santri</option>
                    <option value="ujian">Ujian &amp; Asesmen</option>
                    <option value="libur">Hari Libur Resmi</option>
                    <option value="akademik">Administrasi &amp; Rapor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan
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
                  onClick={() => setEditingEvent(null)}
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

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white font-display">Hapus Agenda</h3>
              </div>
              <button
                onClick={() => setDeletingEvent(null)}
                className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-rose-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus agenda kegiatan ini dari kalender akademik?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{deletingEvent.title}</h4>
                <p className="text-xs text-slate-600 font-mono">Waktu: {deletingEvent.dateStart}</p>
                <p className="text-xs text-emerald-800 font-medium">Kategori: {deletingEvent.categoryLabel}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingEvent(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Hapus Agenda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

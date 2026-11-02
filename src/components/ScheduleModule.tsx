import React, { useState } from 'react';
import { ScheduleItem, UserRole } from '../types';
import { canManageContent } from '../utils/portalLogic';
import {
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Download,
  Printer,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';

interface ScheduleModuleProps {
  schedules: ScheduleItem[];
  currentRole?: UserRole;
  onAddSchedule?: (newSchedule: ScheduleItem) => void;
  onEditSchedule?: (updatedSchedule: ScheduleItem) => void;
  onDeleteSchedule?: (id: string) => void;
  onDownloadNotice: (msg: string) => void;
}

export const ScheduleModule: React.FC<ScheduleModuleProps> = ({
  schedules,
  currentRole = 'admin',
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onDownloadNotice,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('5A');
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Senin');

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('07:30 - 08:45');
  const [newRoom, setNewRoom] = useState('Ruang Kelas 5A');
  const [newPeriod, setNewPeriod] = useState(1);
  const [newIsReligious, setNewIsReligious] = useState(false);

  // Edit Modal
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editPeriod, setEditPeriod] = useState(1);
  const [editIsReligious, setEditIsReligious] = useState(false);

  // Delete Modal
  const [deletingItem, setDeletingItem] = useState<ScheduleItem | null>(null);

  const canManage = canManageContent(currentRole);

  const gradeOptions = ['1A', '1B', '2A', '3A', '4A', '5A', '5B', '6A'];
  const dayOptions: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu')[] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const filteredSchedules = schedules.filter(
    (item) => item.grade === selectedGrade && item.day === selectedDay
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTeacherName.trim()) return;

    const newItem: ScheduleItem = {
      id: `sch-${Date.now()}`,
      grade: selectedGrade,
      day: selectedDay,
      period: Number(newPeriod),
      timeSlot: newTimeSlot.trim() || '07:30 - 08:45',
      subject: newSubject.trim(),
      teacherName: newTeacherName.trim(),
      room: newRoom.trim() || `Ruang Kelas ${selectedGrade}`,
      isReligious: newIsReligious,
    };

    if (onAddSchedule) {
      onAddSchedule(newItem);
    }
    setIsCreateOpen(false);
    setNewSubject('');
    setNewTeacherName('');
  };

  const openEditModal = (item: ScheduleItem) => {
    setEditingItem(item);
    setEditSubject(item.subject);
    setEditTeacherName(item.teacherName);
    setEditTimeSlot(item.timeSlot);
    setEditRoom(item.room);
    setEditPeriod(item.period);
    setEditIsReligious(item.isReligious);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editSubject.trim()) return;

    const updated: ScheduleItem = {
      ...editingItem,
      subject: editSubject.trim(),
      teacherName: editTeacherName.trim(),
      timeSlot: editTimeSlot.trim(),
      room: editRoom.trim(),
      period: Number(editPeriod),
      isReligious: editIsReligious,
    };

    if (onEditSchedule) {
      onEditSchedule(updated);
    }
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    if (onDeleteSchedule) {
      onDeleteSchedule(deletingItem.id);
    }
    setDeletingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Jadwal Pelajaran &amp; KBM Terpadu
              </h2>
              {canManage && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Hak Kelola CRUD ({currentRole === 'admin' ? 'Admin' : 'Dewan Guru'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kurikulum Merdeka Kemenag RI terintegrasi pembiasaan sholat dhuha dan tahfidz Al-Qur'an
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jadwal</span>
              </button>
            )}
            <button
              onClick={() => onDownloadNotice(`Jadwal_KBM_Kelas_${selectedGrade}_Al_Huda.pdf`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Jadwal</span>
            </button>
          </div>
        </div>

        {/* Grade & Day Selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Grade Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 shrink-0">Pilih Kelas:</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {gradeOptions.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedGrade === grade
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Kelas {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Day Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {dayOptions.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedDay === day
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Routine Daily Program Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-900 block">
              06.45 - 07.25 WITA: Sholat Dhuha &amp; Zikir Pagi
            </span>
            <span className="text-emerald-700 text-[11px]">
              Dilaksanakan berjamaah di Masjid Al-Huda sebelum jam pertama dimulai
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-950 block">
              11.30 - 12.30 WITA: Istirahat &amp; Sholat Dzuhur Berjamaah
            </span>
            <span className="text-amber-800 text-[11px]">
              Makan siang santri, kultum adab makan, dan sholat fardhu berjamaah
            </span>
          </div>
        </div>
      </div>

      {/* Schedule Items Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Mata Pelajaran Hari {selectedDay} · Kelas {selectedGrade}
          </div>
          <span className="text-xs text-slate-500">
            {filteredSchedules.length} Sesi Pembelajaran
          </span>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs">Tidak ada kegiatan KBM tatap muka untuk hari {selectedDay}.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSchedules.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Period Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                      item.isReligious
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] leading-none uppercase font-mono">Jam</span>
                    <span className="text-sm font-bold font-mono">{item.period}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        {item.subject}
                      </span>
                      {item.isReligious && (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          Pendidikan Agama Islam
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        {item.teacherName}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono font-medium text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.timeSlot} WITA</span>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit Jadwal"
                        className="p-1.5 text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-lg transition-colors border border-blue-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        title="Hapus Jadwal"
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
        )}
      </div>

      {/* Create Schedule Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Tambah Sesi Pembelajaran</h3>
                <p className="text-xs text-emerald-300">Kelas {selectedGrade} · Hari {selectedDay}</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fikih Ibadah, Matematika, Tematik IPA..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guru Pengampu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ustadz Farhan Gobel, S.Pd."
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Ke-
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rentang Waktu
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 07:30 - 08:45"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruang Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ruang Kelas 5A"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="relCheck"
                    checked={newIsReligious}
                    onChange={(e) => setNewIsReligious(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <label htmlFor="relCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Mata pelajaran rumpun Pendidikan Agama Islam (PAI) / Keagamaan
                  </label>
                </div>
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
                  Simpan Jadwal Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Edit Sesi Pembelajaran</h3>
                <p className="text-xs text-blue-200">Kelas {editingItem.grade} · Hari {editingItem.day}</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-blue-300 hover:text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guru Pengampu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTeacherName}
                    onChange={(e) => setEditTeacherName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Ke-
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={editPeriod}
                    onChange={(e) => setEditPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rentang Waktu
                  </label>
                  <input
                    type="text"
                    value={editTimeSlot}
                    onChange={(e) => setEditTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruang Kelas
                  </label>
                  <input
                    type="text"
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-700 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editRelCheck"
                    checked={editIsReligious}
                    onChange={(e) => setEditIsReligious(e.target.checked)}
                    className="rounded text-blue-700 focus:ring-blue-600 w-4 h-4"
                  />
                  <label htmlFor="editRelCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Mata pelajaran rumpun Pendidikan Agama Islam (PAI) / Keagamaan
                  </label>
                </div>
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

      {/* Delete Schedule Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white font-display">Hapus Sesi Jadwal</h3>
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
                Apakah Anda yakin ingin menghapus sesi pelajaran ini dari jadwal KBM?
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{deletingItem.subject}</h4>
                <p className="text-xs text-slate-600 font-mono">Kelas: {deletingItem.grade} · {deletingItem.day} (Jam ke-{deletingItem.period})</p>
                <p className="text-xs text-emerald-800 font-medium">Pengampu: {deletingItem.teacherName}</p>
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
                  Ya, Hapus Sesi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { UserProfile, UserRole, LOGO_AL_HUDA } from '../types';
import { validateNewUser, validateEditUser } from '../utils/portalLogic';
import {
  UserPlus,
  Search,
  UserCheck,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Shield,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface UserManagementModuleProps {
  users: UserProfile[];
  currentUserId?: string;
  onAddUser: (user: UserProfile) => void;
  onEditUser: (updatedUser: Partial<UserProfile> & { id: string }) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({
  users,
  currentUserId,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onToggleUserStatus,
}) => {
  const [activeRoleFilter, setActiveRoleFilter] = useState<'semua' | 'guru' | 'admin'>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal state (Only for internal staff: Dewan Guru & Admin)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createRole, setCreateRole] = useState<'guru' | 'admin'>('guru');

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Delete Confirmation Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);

  // Create Form fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('123456');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('Wali Kelas 1A');
  const [subjectOrPosition, setSubjectOrPosition] = useState('');
  const [formError, setFormError] = useState('');

  // Edit Form fields
  const [editName, setEditName] = useState('');
  const [editIdentifier, setEditIdentifier] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [editSubjectOrPosition, setEditSubjectOrPosition] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editFormError, setEditFormError] = useState('');

  // Only display internal staff (guru and admin)
  const staffList = users.filter((u) => u.role === 'guru' || u.role === 'admin');

  const filteredList = staffList.filter((u) => {
    const roleMatch = activeRoleFilter === 'semua' || u.role === activeRoleFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return roleMatch;
    const queryMatch =
      u.name.toLowerCase().includes(q) ||
      u.identifier.toLowerCase().includes(q) ||
      (u.grade && u.grade.toLowerCase().includes(q)) ||
      (u.subjectOrPosition && u.subjectOrPosition.toLowerCase().includes(q));
    return roleMatch && queryMatch;
  });

  const teacherCount = staffList.filter((u) => u.role === 'guru').length;
  const adminCount = staffList.filter((u) => u.role === 'admin').length;

  // Open Create Modal
  const openCreateModal = () => {
    setCreateRole('guru');
    setName('');
    setIdentifier('');
    setPassword('123456');
    setEmail('');
    setPhone('');
    setGrade('Wali Kelas 1A');
    setSubjectOrPosition('');
    setFormError('');
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditIdentifier(user.identifier);
    setEditPassword('');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditGrade(user.grade || '');
    setEditSubjectOrPosition(user.subjectOrPosition || '');
    setEditFormError('');
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (user: UserProfile) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle Create Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validation = validateNewUser({
      name,
      identifier,
      role: createRole,
      email: email || undefined,
    });

    if (!validation.isValid) {
      setFormError(validation.error || 'Mohon lengkapi data dengan benar.');
      return;
    }

    // Check duplicate identifier
    if (users.some((u) => u.identifier.toLowerCase() === identifier.trim().toLowerCase())) {
      setFormError(`Nomor identitas "${identifier}" sudah terdaftar sebelumnya.`);
      return;
    }

    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      role: createRole,
      identifier: identifier.trim(),
      password: password.trim() || '123456',
      avatarInitials: initials || 'AL',
      email: email.trim() || `${identifier.trim().toLowerCase()}@mialhudagorontalo.sch.id`,
      phone: phone.trim() || '081234567890',
      grade: createRole === 'guru' && grade !== 'Bukan Wali Kelas' ? grade : undefined,
      subjectOrPosition:
        createRole === 'admin'
          ? subjectOrPosition.trim() || 'Administrator Madrasah'
          : subjectOrPosition.trim() || 'Dewan Guru MI Al-Huda',
      status: 'active',
    };

    onAddUser(newUser);
    setIsCreateModalOpen(false);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditFormError('');

    const validation = validateEditUser(users, {
      id: editingUser.id,
      name: editName,
      identifier: editIdentifier,
      email: editEmail,
      password: editPassword || undefined,
    });

    if (!validation.isValid) {
      setEditFormError(validation.error || 'Terjadi kesalahan validasi.');
      return;
    }

    const initials = editName
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const updatedData: Partial<UserProfile> & { id: string } = {
      id: editingUser.id,
      name: editName.trim(),
      identifier: editIdentifier.trim(),
      avatarInitials: initials || editingUser.avatarInitials,
      email: editEmail.trim(),
      phone: editPhone.trim(),
      grade: editGrade.trim() || undefined,
      subjectOrPosition: editSubjectOrPosition.trim() || (editingUser.role === 'admin' ? 'Administrator' : 'Dewan Guru'),
      ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
    };

    onEditUser(updatedData);
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    onDeleteUser(deletingUser.id);
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_AL_HUDA}
              alt="Logo Resmi MI Al-Huda"
              className="w-10 h-10 object-contain drop-shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  Manajemen Akun Staf &amp; Dewan Guru
                </h2>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Admin Madrasah
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola data Dewan Guru, staf kependidikan, NIP/ID login, atur kata sandi, dan status aktif
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Dewan Guru / Staf</span>
            </button>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveRoleFilter('semua')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeRoleFilter === 'semua'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Akun ({staffList.length})
            </button>

            <button
              onClick={() => setActiveRoleFilter('guru')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeRoleFilter === 'guru'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dewan Guru ({teacherCount})</span>
            </button>

            <button
              onClick={() => setActiveRoleFilter('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeRoleFilter === 'admin'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin ({adminCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, NIP, mapel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">
            Daftar Akun Dewan Guru &amp; Tenaga Kependidikan
          </span>
          <span className="text-slate-500">{filteredList.length} Akun Ditemukan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Nama &amp; Peran</th>
                <th className="py-3 px-4">Nomor Identitas (NIP / ID)</th>
                <th className="py-3 px-4">Kata Sandi</th>
                <th className="py-3 px-4">Mata Pelajaran / Tugas Tambahan</th>
                <th className="py-3 px-4">Kontak (Email / Telepon)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.map((user) => {
                const isPrimaryAdmin = user.id === 'usr-admin-01' || user.identifier.toLowerCase() === 'admin';
                const isCurrentLoggedIn = currentUserId === user.id;
                const canDelete = !isPrimaryAdmin && !isCurrentLoggedIn;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-200 text-xs">
                          {user.avatarInitials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{user.name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {user.role === 'admin' ? 'Administrator' : 'Dewan Guru'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {user.identifier}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md max-w-fit">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{user.password ? '••••••••' : '123456'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-slate-800 block">
                          {user.subjectOrPosition || (user.role === 'admin' ? 'Administrator Madrasah' : 'Guru Kelas')}
                        </span>
                        {user.grade && (
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {user.grade}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[170px]">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-[11px] font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-500" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit Akun (Ubah data, NIP/ID, ganti password)"
                          className="p-1.5 text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-lg transition-colors border border-blue-200 hover:border-blue-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() => onToggleUserStatus(user.id)}
                          title={user.status === 'active' ? 'Nonaktifkan akun' : 'Aktifkan akun'}
                          className="px-2 py-1 text-[10px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          {user.status === 'active' ? 'Nonaktif' : 'Aktif'}
                        </button>

                        {/* Delete Button */}
                        {canDelete ? (
                          <button
                            onClick={() => openDeleteModal(user)}
                            title="Hapus Akun Staf"
                            className="p-1.5 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 rounded-lg transition-colors border border-rose-200 hover:border-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            disabled
                            title="Akun utama/aktif tidak dapat dihapus"
                            className="p-1.5 text-slate-300 bg-slate-50 rounded-lg cursor-not-allowed border border-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Dewan Guru / Staf Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Tambah Akun Dewan Guru / Staf Baru
                </h3>
                <p className="text-xs text-emerald-300">Pendaftaran Internal MI Al-Huda Gorontalo</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Beserta Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ustadzah Rahmiati Daud, S.Pd.I"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Peran Akun
                  </label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as 'guru' | 'admin')}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 bg-white"
                  >
                    <option value="guru">Dewan Guru / Pengajar</option>
                    <option value="admin">Administrator Madrasah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NUPTK / ID Login <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 198904..."
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Awal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    placeholder="nama@mialhudagorontalo.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="0812..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran / Posisi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Fikih &amp; Bahasa Arab"
                    value={subjectOrPosition}
                    onChange={(e) => setSubjectOrPosition(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tugas Tambahan (Wali Kelas)
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 bg-white"
                  >
                    <option value="Bukan Wali Kelas">Bukan Wali Kelas (Guru Mapel / Tata Usaha)</option>
                    <option value="Wali Kelas 1A">Wali Kelas 1A</option>
                    <option value="Wali Kelas 1B">Wali Kelas 1B</option>
                    <option value="Wali Kelas 2A">Wali Kelas 2A</option>
                    <option value="Wali Kelas 3A">Wali Kelas 3A</option>
                    <option value="Wali Kelas 4A">Wali Kelas 4A</option>
                    <option value="Wali Kelas 5A">Wali Kelas 5A</option>
                    <option value="Wali Kelas 6A">Wali Kelas 6A</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Simpan Akun Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Akun */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Edit Akun: {editingUser.name}
                </h3>
                <p className="text-xs text-emerald-300">
                  Ubah NIP/ID login, mata pelajaran, kontak, dan kata sandi
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {editFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{editFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor ID / NIP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editIdentifier}
                    onChange={(e) => setEditIdentifier(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ganti Kata Sandi (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      placeholder="Kosongkan jika tidak diubah"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-3 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran / Posisi
                  </label>
                  <input
                    type="text"
                    value={editSubjectOrPosition}
                    onChange={(e) => setEditSubjectOrPosition(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tugas Tambahan / Wali Kelas
                  </label>
                  <input
                    type="text"
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    placeholder="Contoh: Wali Kelas 5A"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Akun */}
      {isDeleteModalOpen && deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white font-display">
                  Konfirmasi Hapus Akun
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingUser(null);
                }}
                className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-rose-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun staf berikut secara permanen?
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-sm font-bold text-slate-900">{deletingUser.name}</div>
                <div className="text-xs text-slate-600 font-mono">
                  Identitas: {deletingUser.identifier}
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  Peran: {deletingUser.role === 'admin' ? 'Administrator' : 'Dewan Guru'} {deletingUser.grade ? `(${deletingUser.grade})` : ''}
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  Perhatian: Tindakan ini tidak dapat dibatalkan. Pengguna ini tidak akan dapat login lagi ke portal madrasah.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingUser(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Ya, Hapus Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

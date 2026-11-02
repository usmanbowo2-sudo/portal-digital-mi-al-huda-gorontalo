import React, { useState } from 'react';
import { UserProfile, LOGO_AL_HUDA } from '../types';
import { changeSelfPassword } from '../utils/portalLogic';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onPasswordChanged: (updatedUser: UserProfile) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPasswordChanged,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = changeSelfPassword(currentUser, oldPassword, newPassword, confirmPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Gagal mengubah kata sandi.');
      return;
    }

    if (res.updatedUser) {
      setSuccessMessage('Kata sandi akun Anda berhasil diperbarui!');
      onPasswordChanged(res.updatedUser);
      setTimeout(() => {
        setSuccessMessage('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_AL_HUDA}
              alt="Logo MI Al-Huda"
              className="w-8 h-8 object-contain drop-shadow-xs"
            />
            <div>
              <h3 className="text-base font-bold text-white font-display">Ganti Kata Sandi Akun</h3>
              <p className="text-[11px] text-emerald-300">Pengaturan Keamanan Mandiri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup jendela ganti sandi"
            className="p-1 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Summary */}
        <div className="px-6 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {currentUser.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-emerald-800 font-mono">
              ID / NIP Staf: {currentUser.identifier} · <span className="capitalize">{currentUser.role === 'admin' ? 'Administrator' : 'Dewan Guru'}</span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi Saat Ini (Lama)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showOld ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi lama Anda"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Default akun demo: 123456</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs"
              >
                Simpan Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

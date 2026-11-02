import React, { useState, useEffect, useRef } from 'react';
import { UserRole, UserProfile, LOGO_AL_HUDA } from '../types';
import {
  generateKeyCode,
  validateKeyCode,
} from '../utils/portalLogic';
import {
  Lock,
  User,
  KeyRound,
  X,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  Clock,
  Info,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  availableUsers: UserProfile[];
  onUserAccountsUpdated?: (updatedUsers: UserProfile[]) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  availableUsers,
}) => {
  // Login Role States: Strictly Admin and Guru only (Students don't need login)
  const [selectedRole, setSelectedRole] = useState<'admin' | 'guru'>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Key Code Security States
  const [loginKeyCode, setLoginKeyCode] = useState('');
  const [inputLoginKeyCode, setInputLoginKeyCode] = useState('');
  const [isRefreshingKeyCode, setIsRefreshingKeyCode] = useState(false);
  const [secondsUntilAutoRotate, setSecondsUntilAutoRotate] = useState(60);

  // Status Alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Refs for timers
  const autoRotateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Function to generate new key code immediately
  const applyNewKeyCode = () => {
    setLoginKeyCode(generateKeyCode());
    setInputLoginKeyCode('');
    setSecondsUntilAutoRotate(60);
  };

  // Manual Refresh Handler: 2-second spin animation and 2-second delay before updating key code
  const handleManualRefreshKeyCode = () => {
    if (isRefreshingKeyCode) return;

    setIsRefreshingKeyCode(true);
    setErrorMessage('');

    // Clear existing 2s timeout if any
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      applyNewKeyCode();
      setIsRefreshingKeyCode(false);
    }, 2000);
  };

  // Lifecycle: Initialize Key Code and setup 1-minute (60s) automatic rotation timer
  useEffect(() => {
    if (isOpen) {
      applyNewKeyCode();
      setErrorMessage('');
      setSuccessMessage('');
      setIsRefreshingKeyCode(false);

      // Auto rotation interval: ticks every 1 second to update countdown & rotates code at 0
      autoRotateIntervalRef.current = setInterval(() => {
        setSecondsUntilAutoRotate((prev) => {
          if (prev <= 1) {
            setLoginKeyCode(generateKeyCode());
            setInputLoginKeyCode('');
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isRefreshingKeyCode) {
      setErrorMessage('Sedang memuat kode keamanan baru, mohon tunggu sebentar...');
      return;
    }

    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      setErrorMessage(
        selectedRole === 'admin'
          ? 'Username atau ID Admin wajib diisi.'
          : 'NIP Guru atau Email resmi wajib diisi.'
      );
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    // Verify Key Code
    if (!validateKeyCode(inputLoginKeyCode, loginKeyCode)) {
      setErrorMessage('Kode Keamanan (Key Code) tidak sesuai. Silakan masukkan kode yang tertera di kotak.');
      handleManualRefreshKeyCode();
      return;
    }

    // Find User (Admin or Guru only)
    const foundUser = availableUsers.find(
      (u) =>
        (u.identifier.toLowerCase() === cleanId ||
          u.email.toLowerCase() === cleanId ||
          u.name.toLowerCase() === cleanId) &&
        (u.role === 'admin' || u.role === 'guru')
    );

    if (!foundUser) {
      setErrorMessage(
        selectedRole === 'admin'
          ? 'Akun Admin tidak ditemukan di sistem. Periksa kembali username Anda.'
          : 'Akun Staf Guru tidak ditemukan. Silakan hubungi Administrator Madrasah jika akun Anda belum terdaftar.'
      );
      return;
    }

    // Role Match Check
    if (foundUser.role !== selectedRole) {
      setErrorMessage(
        `Akun terdaftar sebagai "${foundUser.role === 'admin' ? 'Admin' : 'Dewan Guru'}", namun Anda memilih opsi "${selectedRole === 'admin' ? 'Admin' : 'Guru'}". Silakan sesuaikan pilihan peran di atas.`
      );
      return;
    }

    // Check account status
    if (foundUser.status === 'inactive') {
      setErrorMessage('Akun ini sedang dinonaktifkan oleh Administrator. Hubungi pihak madrasah untuk aktivasi.');
      return;
    }

    // Verify Password
    const expectedPassword = foundUser.password || '123456';
    if (password.trim() !== expectedPassword) {
      setErrorMessage('Kata sandi salah. Silakan coba lagi atau hubungi Administrator Madrasah jika lupa.');
      return;
    }

    // Success
    setSuccessMessage(`Autentikasi berhasil! Selamat datang, ${foundUser.name}.`);
    setTimeout(() => {
      onLoginSuccess(foundUser);
      onClose();
      setIdentifier('');
      setPassword('');
      setInputLoginKeyCode('');
      setErrorMessage('');
      setSuccessMessage('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_AL_HUDA}
              alt="Logo Resmi MI Al-Huda"
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Masuk Portal MI Al-Huda
              </h3>
              <p className="text-[11px] text-emerald-300">
                Khusus Admin &amp; Dewan Guru Madrasah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup jendela masuk"
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Status Alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Selector: Login Sebagai Siapa (Admin vs Guru) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              1. Pilih Peran Masuk:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setErrorMessage('');
                }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                  selectedRole === 'admin'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <ShieldCheck
                  className={`w-6 h-6 mb-1.5 ${
                    selectedRole === 'admin' ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                <span className="text-xs font-bold">Admin</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Manajemen Sistem
                </span>
              </button>

              {/* Guru Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('guru');
                  setErrorMessage('');
                }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                  selectedRole === 'guru'
                    ? 'border-blue-700 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-600/30 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <UserCheck
                  className={`w-6 h-6 mb-1.5 ${
                    selectedRole === 'guru' ? 'text-blue-700' : 'text-slate-400'
                  }`}
                />
                <span className="text-xs font-bold">Dewan Guru</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Staf Pengajar
                </span>
              </button>
            </div>
          </div>

          {/* Informative Callout for Teacher Account Request */}
          {selectedRole === 'guru' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Informasi Staf Pengajar:</p>
                <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                  Bagi Bapak/Ibu Dewan Guru yang belum memiliki akun atau lupa kata sandi, silakan hubungi <strong>Administrator Madrasah</strong> untuk aktivasi akun dan NIP resmi.
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {selectedRole === 'admin' ? 'Username / ID Admin' : 'NIP Guru / Email Resmi'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={
                    selectedRole === 'admin'
                      ? 'Masukkan ID Admin (misal: admin)'
                      : 'Masukkan NIP (misal: 198904152014021003)'
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Kata Sandi (Password)
                </label>
                <span className="text-[10px] text-slate-400">Default: 123456</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Key Code Security Verification with 2-Second Spin Delay and 1-Minute Auto-Rotation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kode Keamanan (Key Code)</span>
                </label>

                {/* Refresh button with circular spin animation and 2s delay */}
                <button
                  type="button"
                  onClick={handleManualRefreshKeyCode}
                  disabled={isRefreshingKeyCode}
                  className={`text-[11px] flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-md transition-colors ${
                    isRefreshingKeyCode
                      ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                      : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                  title="Ganti Kode Keamanan sekarang"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isRefreshingKeyCode ? 'animate-spin text-emerald-600' : ''
                    }`}
                  />
                  <span>{isRefreshingKeyCode ? 'Memperbarui (2s)...' : 'Muat Ulang'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Key Code Display with subtle spinner overlay during 2s refresh */}
                <div className="relative min-w-[100px] text-center px-3 py-2 bg-emerald-950 text-amber-300 font-mono font-extrabold tracking-widest text-sm rounded-lg select-none border border-emerald-800 shadow-inner flex items-center justify-center">
                  {isRefreshingKeyCode ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>...</span>
                    </div>
                  ) : (
                    <span>{loginKeyCode}</span>
                  )}
                </div>

                <input
                  type="text"
                  required
                  placeholder="Ketik kode di samping"
                  value={inputLoginKeyCode}
                  onChange={(e) => setInputLoginKeyCode(e.target.value)}
                  disabled={isRefreshingKeyCode}
                  className="flex-1 px-3 py-2 text-xs font-mono uppercase tracking-wider border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 disabled:bg-slate-100"
                />
              </div>

              {/* Dynamic Auto-Rotation Countdown Status */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>Anti-bot &amp; verifikasi dinamis</span>
                <span className="flex items-center gap-1 font-mono text-emerald-700 font-semibold">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Otomatis berganti: {secondsUntilAutoRotate}s</span>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRefreshingKeyCode}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold rounded-xl text-xs transition-all shadow-xs disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>
                Masuk sebagai {selectedRole === 'admin' ? 'Administrator' : 'Dewan Guru'}
              </span>
            </button>
          </form>

          {/* Quick Help for Teachers */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Lupa password akun Guru? Hubungi Administrator Madrasah untuk reset.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

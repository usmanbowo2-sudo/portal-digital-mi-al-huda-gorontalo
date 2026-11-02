import React from 'react';
import { UserRole, UserProfile, LOGO_AL_HUDA } from '../types';
import { LogIn, LogOut, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  userProfile: UserProfile;
  isBackendConnected?: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenChangePasswordModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  userProfile,
  isBackendConnected = false,
  onOpenLoginModal,
  onLogout,
  onOpenChangePasswordModal,
}) => {
  // Navigation tabs filtered by role (RBAC)
  const navItems = [
    { id: 'pengumuman', label: 'Pengumuman' },
    { id: 'jadwal', label: 'Jadwal & Kalender' },
    { id: 'dokumen', label: 'Dokumen Administrasi' },
    { id: 'warta', label: 'Warta & Galeri' },
    ...(currentRole === 'admin'
      ? [
          { id: 'dashboard', label: 'Dashboard & Akun' },
          { id: 'arsitektur', label: 'Cetak Biru Sistem' },
        ]
      : [{ id: 'arsitektur', label: 'Cetak Biru Sistem' }]),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Official Crest & Brand Wordmark */}
          <button
            onClick={() => setActiveTab('pengumuman')}
            className="flex items-center gap-3 text-left text-emerald-950 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 group"
          >
            <img
              src={LOGO_AL_HUDA}
              alt="Logo Resmi MI Al-Huda Gorontalo"
              className="w-10 h-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-emerald-950 leading-tight">
                MI Al-Huda Gorontalo
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase">
                Bumi Serambi Madinah
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'text-emerald-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-[-22px] left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Authentication & User Profile in Header Bar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Database Engine Status Pill */}
            <button
              onClick={() => setActiveTab('arsitektur')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-xl border transition-all ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title={
                isBackendConnected
                  ? 'Database SQLite & REST API Server Terhubung Aktif'
                  : 'Mode Mandiri: Data tersinkron ke Browser LocalStorage'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isBackendConnected ? 'DB SQLite Aktif' : 'Mode Mandiri'}</span>
            </button>

            {currentRole === 'tamu' ? (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all whitespace-nowrap shadow-xs active:scale-95"
              >
                <LogIn className="w-4 h-4 text-emerald-200" />
                <span>Masuk Portal</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Active User Pill with Avatar & Role Badge */}
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-colors">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      currentRole === 'admin'
                        ? 'bg-emerald-800 shadow-2xs'
                        : 'bg-blue-800 shadow-2xs'
                    }`}
                  >
                    {userProfile.avatarInitials || (currentRole === 'admin' ? 'AD' : 'GR')}
                  </div>

                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 max-w-[130px] sm:max-w-[160px] truncate leading-tight">
                        {userProfile.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                          currentRole === 'admin'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {currentRole === 'admin' ? 'Admin' : 'Guru'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono leading-none">
                      {userProfile.identifier}
                    </span>
                  </div>
                </div>

                {/* Self-service Ganti Sandi Button */}
                <button
                  onClick={onOpenChangePasswordModal}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors whitespace-nowrap"
                  title="Ganti kata sandi akun saya sendiri"
                >
                  <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden md:inline">Ganti Sandi</span>
                </button>

                {/* Integrated Logout Button */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors whitespace-nowrap"
                  title="Keluar dari sesi akun saat ini"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Navigation bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { LOGO_AL_HUDA } from '../types';
import { CalendarDays, FileText } from 'lucide-react';

interface HeroBannerProps {
  onNavigateTab: (tabId: string) => void;
  urgentCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigateTab,
  urgentCount,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white border-b border-emerald-800">
      {/* Karawo Islamic Geometric Backdrop */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#d4af37" strokeWidth="1" />
              <circle cx="20" cy="20" r="4" fill="none" stroke="#ffffff" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        {/* Official Crest & Top Calligraphic Blessing Accent */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-emerald-600/50 shadow-lg flex items-center justify-center mb-3">
            <img
              src={LOGO_AL_HUDA}
              alt="Logo Resmi Pondok Pesantren Al-Huda Gorontalo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div className="font-arabic text-amber-300 text-xl sm:text-2xl tracking-widest opacity-95">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-2" />
          <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
            Madrasah Ibtidaiyah Al-Huda Kota Gorontalo
          </span>
        </div>

        {/* Main Hero Grid */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
            Papan Informasi &amp; Portal Akademik Digital
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
            Mewujudkan generasi santri yang berakhlak karimah, unggul dalam sains dan tahfidz Al-Qur'an,
            berlandaskan falsafah kearifan lokal Serambi Madinah Gorontalo.
          </p>

          {/* Quick Action Navigation CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('jadwal')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-semibold rounded-xl shadow-md transition-all text-sm group"
            >
              <CalendarDays className="w-4 h-4 text-emerald-950" />
              <span>Jadwal Pelajaran &amp; Kalender</span>
            </button>

            <button
              onClick={() => onNavigateTab('dokumen')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium rounded-xl border border-emerald-600/70 shadow-xs transition-colors text-sm"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Unduh Berkas Administrasi</span>
            </button>
          </div>
        </div>

        {/* Live Urgent Bulletin Strip */}
        {urgentCount > 0 && (
          <div className="mt-8 max-w-2xl mx-auto bg-amber-500/15 border border-amber-400/40 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-amber-200 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-amber-500 text-emerald-950 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
                PENTING
              </span>
              <span className="truncate">
                Pelaksanaan Asesmen Madrasah (AM) &amp; PPDB 2026 Gelombang I Telah Dibuka
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('pengumuman')}
              className="text-amber-300 font-semibold hover:underline shrink-0"
            >
              Rincian &rarr;
            </button>
          </div>
        )}

        {/* 4-Item Madrasah Pillar Metrics */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-emerald-800/70 pt-8 text-center">
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-display tabular-nums">
              428+
            </div>
            <div className="text-xs text-emerald-200/80 mt-0.5">Santri MI Al-Huda</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Akreditasi A
            </div>
            <div className="text-xs text-emerald-200/80 mt-0.5">Unggul BAN-S/M Kemenag</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-display tabular-nums">
              3 Juz
            </div>
            <div className="text-xs text-emerald-200/80 mt-0.5">Target Tahfidz Qur'an</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
              100% Digital
            </div>
            <div className="text-xs text-emerald-200/80 mt-0.5">Layanan Terpadu Madrasah</div>
          </div>
        </div>
      </div>
    </div>
  );
};

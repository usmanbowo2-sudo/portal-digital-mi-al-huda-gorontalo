import React from 'react';
import { LOGO_AL_HUDA } from '../types';
import { MapPin, Phone, Mail, Award, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigateTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity & Motto */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={LOGO_AL_HUDA}
                alt="Logo Resmi MI Al-Huda Gorontalo"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  MI Al-Huda Gorontalo
                </h3>
                <span className="text-[11px] text-amber-300 font-semibold tracking-wider uppercase block">
                  Bumi Serambi Madinah
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed max-w-md">
              Madrasah Ibtidaiyah unggulan yang memadukan kurikulum nasional Kemenag RI, penguatan tahfidz Al-Qur'an 3 juz, sains modern, dan budi pekerti luhur berakar kearifan budaya Gorontalo.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Terakreditasi A (Unggul) BAN-S/M</span>
              <span aria-hidden="true">·</span>
              <span>NSM: 111275710008</span>
            </div>
          </div>

          {/* Col 2: Alamat & Kontak */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-display">
              Alamat Kampus
            </h4>
            <div className="text-xs text-emerald-200 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Jl. Pangeran Hidayat No. 45, Kel. Heledulaa, Kec. Kota Timur, Kota Gorontalo, Gorontalo 96114
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>(0435) 821-443 / 0812-4412-8990</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@mialhudagorontalo.sch.id</span>
              </div>
            </div>
          </div>

          {/* Col 3: Layanan Cepat */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-display">
              Layanan Digital
            </h4>
            <ul className="text-xs text-emerald-200/90 space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab?.('pengumuman');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Papan Pengumuman &amp; Warta Resmi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab?.('jadwal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Jadwal KBM &amp; Pembiasaan Ibadah
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab?.('warta');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Warta Guru &amp; Galeri Kegiatan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab?.('dokumen');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Pusat Berkas Administrasi PPDB
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab?.('jadwal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Kalender Akademik Kemenag
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <p>© 2026 MI Al-Huda Gorontalo. Seluruh Hak Cipta Dilindungi.</p>
          <p className="font-arabic text-amber-300/80 text-sm">
            العلم في الصغر كالنقش على الحجر
          </p>
        </div>
      </div>
    </footer>
  );
};

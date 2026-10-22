import React from 'react';
import { CheckCircle2, ArrowRight, Play, Store } from 'lucide-react';

interface HeroSectionProps {
  onStartFree?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartFree }) => {
  return (
    <section className="pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Pelopor Pencatatan Kasbon Warung Cerdas #1 di Indonesia
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.2] tracking-tight">
              Kelola Kasbon Tetangga Rapi,{' '}
              <span className="text-emerald-600 underline decoration-emerald-500/40 decoration-wavy">
                Modal Warung Aman
              </span>{' '}
              & Rezeki Berkah.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Tinggalkan buku tulis kusam yang rentan hilang atau rusak. Catat kasbon seketika, pantau batas pinjaman pelanggan, dan kirim pengingat ramah via WhatsApp tanpa rasa canggung.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={onStartFree}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
              >
                <span>Pakai Gratis Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 transition flex items-center gap-2 shadow-sm">
                <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>Lihat Demo Singkat</span>
              </button>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Gratis & Bebas Iklan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Data Aman Terenkripsi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Siap Pakai 30 Detik</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20"></div>
            
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Warung Berkah Bu Siti</h4>
                    <p className="text-[10px] text-slate-400">Jalan Mawar No. 12 • Online</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-200">
                  Aktif
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-rose-50/70 border border-rose-100 p-3.5 rounded-xl">
                  <p className="text-[11px] text-slate-500 font-medium">Total Kasbon Belum Lunas</p>
                  <p className="text-lg font-extrabold text-rose-600 mt-1">Rp 1.380.000</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                  <p className="text-[11px] text-slate-500 font-medium">Pelanggan Kasbon</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-lg font-extrabold text-slate-800">8 Orang</span>
                    <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">Perlu ditagih</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
                  <span>CATATAN TERBARU</span>
                  <span>STATUS</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">PJ</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Pak Joko (RT 03)</p>
                      <p className="text-[10px] text-slate-400">Telur 1kg, Beras 2kg • Hari ini</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-rose-600">Rp 45.000</p>
                    <span className="text-[9px] text-amber-600 font-medium">Jatuh Tempo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">BR</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Bu Ratna</p>
                      <p className="text-[10px] text-slate-400">Minyak Goreng 2L • 2 hari lalu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-rose-600">Rp 38.000</p>
                    <span className="text-[9px] text-emerald-600 font-medium">Sudah Diingatkan</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">MD</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Mas Dimas</p>
                      <p className="text-[10px] text-slate-400">Rokok & Kopi • Kemarin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600">Rp 25.000</p>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">LUNAS</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={onStartFree}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                + Catat Kasbon Baru (5 Detik)
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
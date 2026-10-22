import React, { useState } from 'react';

interface CalculatorSectionProps {
  onStartFree?: () => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({ onStartFree }) => {
  const [kasbonHarian, setKasbonHarian] = useState<number>(150000);
  const [jumlahPelanggan, setJumlahPelanggan] = useState<number>(10);

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const totalMengendap = kasbonHarian * jumlahPelanggan;
  const estimasiHemat = Math.round(totalMengendap * 0.65);

  return (
    <section id="simulasi" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/40">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Kalkulator Warung
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Simulasi Potensi Uang Kasbon yang Terselamatkan
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Hitung perkiraan perputaran modal warung Anda yang terselamatkan dari kasbon macet setiap bulannya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Rata-rata Kasbon Harian Warung</span>
                  <span className="text-emerald-700 font-bold">{formatRupiah(kasbonHarian)}</span>
                </div>
                <input 
                  type="range" 
                  min="50000" 
                  max="1000000" 
                  step="25000" 
                  value={kasbonHarian}
                  onChange={(e) => setKasbonHarian(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Jumlah Pelanggan yang Kasbon</span>
                  <span className="text-emerald-700 font-bold">{jumlahPelanggan} Orang</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="50" 
                  step="1" 
                  value={jumlahPelanggan}
                  onChange={(e) => setJumlahPelanggan(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            <div className="md:col-span-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Potensi Kasbon Mengendap</p>
                <p className="text-xl font-extrabold text-slate-800">{formatRupiah(totalMengendap)}</p>
              </div>

              <div className="pt-3 border-t border-emerald-200/60">
                <p className="text-xs text-emerald-900 font-bold">Estimasi Modal Terselamatkan</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {formatRupiah(estimasiHemat)} <span className="text-xs font-normal text-slate-600">/ bulan</span>
                </p>
              </div>

              <button 
                onClick={onStartFree}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                Selamatkan Modal Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
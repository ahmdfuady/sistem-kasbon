import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  AlertCircle,
  Bell,
  TrendingUp,
  CheckCircle,
  Download,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Copy
} from 'lucide-react';
import { DashboardMenu, SelectedCustomer } from '../../types/dashboard';

interface BerandaViewProps {
  setActiveMenu: (menu: DashboardMenu) => void;
  selectedCustomer: SelectedCustomer;
  copied: boolean;
  handleCopyText: () => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  setActiveMenu,
  selectedCustomer,
  copied,
  handleCopyText
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
            <span>🗓️ Senin, 14 Oktober 2024</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Toko Buka • Sesi Pagi
            </span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Halo, Bu Siti Aminah 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan kasbon & piutang harian <span className="font-bold text-slate-700">Warung Barokah Berkah</span> terdata rapi hari ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setActiveMenu('transaksi')}
            className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>+ Catat Utang Baru</span>
          </button>

          <button 
            onClick={() => setActiveMenu('transaksi')}
            className="bg-[#05603a] hover:bg-[#044e2f] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>+ Terima Bayar / Cicilan</span>
          </button>

          <button 
            onClick={() => setActiveMenu('laporan')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Laporan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400">Total Piutang Berjalan</p>
              <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Rp 1.250.000</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-bold text-[11px] flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% <span className="text-slate-400 font-normal">vs minggu lalu</span>
            </span>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              8 Pelanggan
            </span>
          </div>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Jatuh Tempo</span>
              </div>
              <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">3 Orang</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs">
            <span className="text-rose-700 font-bold text-[11px]">Total: Rp 630.000</span>
            <span className="bg-rose-200/70 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-md">Prioritas</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400">Kas Masuk Minggu Ini</p>
              <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Rp 450.000</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">6 transaksi lunas/cicil</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              ✓ Tertib
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400">Kelancaran Bayar</p>
              <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">84%</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-[84%] rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-400">Pelanggan tertib tepat waktu</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <h3 className="font-extrabold text-sm text-slate-900">Perlu Segera Ditagih</h3>
              <span className="bg-rose-100 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded-full">3 Orang</span>
            </div>
            <button 
              onClick={() => setActiveMenu('pelanggan')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua Pelanggan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            <div 
              onClick={() => setActiveMenu('pelanggan')}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center shrink-0">PJ</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Pak Joko</h4>
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded">Telat 5 Hari</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">(Bengkel Depan • 0812-3456-7890)</p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-slate-400" />
                    <span>Terakhir: 09 Okt • Rokok Surya 2 bks + Kopi Kapal Api</span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-medium">Total Kasbon</p>
                  <p className="text-sm sm:text-base font-black text-rose-600">Rp 350.000</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka wa.me</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center shrink-0">MS</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Mbak Sri</h4>
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded">Telat 3 Hari</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">(Tetangga RT 03 • 0857-1122-3344)</p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-slate-400" />
                    <span>Terakhir: 11 Okt • Minyak Goreng 2L + Beras 5kg</span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-medium">Total Kasbon</p>
                  <p className="text-sm sm:text-base font-black text-rose-600">Rp 185.000</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka wa.me</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">MD</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Mas Doni</h4>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Jatuh Tempo Hari Ini</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">(Pangkalan Ojek • 0878-9900-1122)</p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-slate-400" />
                    <span>Terakhir: 13 Okt • Bensin 2 Botol + Djarum Super</span>
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-medium">Total Kasbon</p>
                  <p className="text-sm sm:text-base font-black text-rose-600">Rp 95.000</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka wa.me</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 text-lg">💬</span>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Tagihan WA Santun</h3>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              Link Manual wa.me
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Buka link <span className="font-mono text-emerald-700 font-bold">wa.me/62...</span> langsung ke aplikasi/web WhatsApp HP pribadi Bu Siti dengan teks pesan yang sudah terisi otomatis (100% gratis tanpa biaya API).
          </p>

          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 space-y-2">
            <p className="text-[10px] font-bold text-emerald-900 flex items-center gap-1">
              <span>❝</span> Pratinjau Pesan ({selectedCustomer.name}):
            </p>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              {selectedCustomer.waText}
            </p>
          </div>

          <button 
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(selectedCustomer.waText)}`, '_blank')}
            className="w-full bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka wa.me di WhatsApp</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button 
              onClick={handleCopyText}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>{copied ? 'Tersalin! ✓' : 'Salin Teks Pesan'}</span>
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(`https://wa.me/?text=${encodeURIComponent(selectedCustomer.waText)}`);
                alert('Link wa.me tersalin!');
              }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Salin Link wa.me</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700">⏱️</span>
              <h3 className="font-extrabold text-sm text-slate-900">Aktivitas Transaksi Terbaru</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Update Otomatis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold">
                  <th className="pb-3 font-semibold">Pelanggan</th>
                  <th className="pb-3 font-semibold">Rincian Barang</th>
                  <th className="pb-3 font-semibold">Waktu</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">BA</div>
                    <span className="font-bold text-slate-800">Bu Anik</span>
                  </td>
                  <td className="py-3.5 text-slate-600">Pelunasan Tabung Gas 3kg + Telur 1kg</td>
                  <td className="py-3.5 text-slate-400 text-[11px]">Hari ini, 09:40</td>
                  <td className="py-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Lunas</span></td>
                  <td className="py-3.5 text-right font-extrabold text-emerald-600">+Rp 62.000</td>
                </tr>
                <tr>
                  <td className="py-3.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">PY</div>
                    <span className="font-bold text-slate-800">Pak Yanto</span>
                  </td>
                  <td className="py-3.5 text-slate-600">Gula Pasir 1kg, Kopi ABC 1 renceng</td>
                  <td className="py-3.5 text-slate-400 text-[11px]">Hari ini, 08:15</td>
                  <td className="py-3.5"><span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Kasbon Baru</span></td>
                  <td className="py-3.5 text-right font-extrabold text-rose-600">-Rp 34.000</td>
                </tr>
                <tr>
                  <td className="py-3.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center">PJ</div>
                    <span className="font-bold text-slate-800">Pak Joko</span>
                  </td>
                  <td className="py-3.5 text-slate-600">Cicilan kasbon mingguan ke-1</td>
                  <td className="py-3.5 text-slate-400 text-[11px]">Kemarin, 17:30</td>
                  <td className="py-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Cicilan Masuk</span></td>
                  <td className="py-3.5 text-right font-extrabold text-emerald-600">+Rp 50.000</td>
                </tr>
                <tr>
                  <td className="py-3.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">BW</div>
                    <span className="font-bold text-slate-800">Bu Wahyu</span>
                  </td>
                  <td className="py-3.5 text-slate-600">Beras Setra Ramos 5kg + Bumbu Dapur</td>
                  <td className="py-3.5 text-slate-400 text-[11px]">Kemarin, 14:10</td>
                  <td className="py-3.5"><span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Kasbon Baru</span></td>
                  <td className="py-3.5 text-right font-extrabold text-rose-600">-Rp 78.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700">📦</span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Barang Sering Dikasbon</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Bulan Ini</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Tabung Gas LPG 3kg</span>
                  <span className="text-slate-900 font-extrabold">35%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[35%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Beras Medium 5kg</span>
                  <span className="text-slate-900 font-extrabold">28%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[28%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Minyak Goreng 2L</span>
                  <span className="text-slate-900 font-extrabold">20%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[20%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Rokok & Kopi Sachet</span>
                  <span className="text-slate-900 font-extrabold">17%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[17%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#064e3b] to-[#043d2e] text-white rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
              <span>💡 Tips Bu Siti Pekan Ini</span>
            </div>
            <h4 className="font-extrabold text-sm sm:text-base leading-snug">
              Plafon Kasbon Maksimal Rp 200 Ribu per Warga
            </h4>
            <p className="text-[11px] text-emerald-100/90 leading-relaxed">
              Jangan ragu menahan kasbon baru bila tagihan minggu lalu belum dilunasi minimal 50%. Catatan rapi bikin warung panjang umur!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
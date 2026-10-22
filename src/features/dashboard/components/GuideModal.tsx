import React from 'react';
import { X } from 'lucide-react';

/** Jendela "Panduan Kilat KasbonKu" */
export default function GuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => onClose()}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">Panduan Kilat KasbonKu</h3>
          <button onClick={() => onClose()} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
          <li>Tambahkan warga di menu <strong>Buku Pelanggan</strong> (isi nomor WhatsApp supaya bisa menagih).</li>
          <li>Saat warga ngutang, buka <strong>Catat Transaksi</strong> → pilih warga → isi nominal & janji bayar.</li>
          <li>Saat warga bayar, pilih <strong>Terima Bayar / Cicilan</strong>. Kwitansi otomatis bernomor.</li>
          <li>Di <strong>Beranda</strong>, warga yang telat muncul di "Perlu Segera Ditagih". Klik <strong>Buka wa.me</strong> untuk kirim pengingat santun.</li>
          <li>Atur plafon, template WA, dan cadangan data di <strong>Pengaturan</strong>.</li>
        </ol>
      </div>
    </div>
  );
}

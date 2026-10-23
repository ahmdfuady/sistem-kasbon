import { CheckCircle2 } from 'lucide-react';
import type { SaldoPelanggan } from '../../../../lib/types';
import { formatRupiah, formatTanggal } from '../../../../lib/utils';

interface EntrySummaryProps {
  transactionType: 'kasbon' | 'cicilan';
  selectedPelanggan: SaldoPelanggan | null;
  onOpenCustomer?: (id: string) => void;
  utangSebelumnya: number;
  nominal: number;
  batasKasbon: number | null;
  /** persentase utang baru terhadap batas kasbon (0-100) */
  rasioBatas: number;
  totalUtangBaru: number;
  jatuhTempo: string;
}

/** Pratinjau langsung: utang sebelumnya, tambahan/pembayaran, rasio batas, total baru */
export default function EntrySummary({
  transactionType, selectedPelanggan, onOpenCustomer, utangSebelumnya, nominal, batasKasbon, rasioBatas, totalUtangBaru, jatuhTempo,
}: EntrySummaryProps) {
  const ringkasanLabel = transactionType === 'kasbon' ? 'Kasbon' : 'Pembayaran';

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700">📋</span>
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Ringkasan Catatan Baru</h3>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${transactionType === 'kasbon' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
          {transactionType === 'kasbon' ? 'Kasbon Bertambah' : 'Utang Berkurang'}
        </span>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">👤</div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{selectedPelanggan?.nama ?? 'Belum dipilih'}</p>
          <p className="text-[10px] text-slate-400 truncate">{selectedPelanggan ? `${selectedPelanggan.kode}${selectedPelanggan.whatsapp ? ' • ' + selectedPelanggan.whatsapp : ''}` : '-'}</p>
        </div>
        {selectedPelanggan && onOpenCustomer && (
          <button type="button" onClick={() => onOpenCustomer(selectedPelanggan.pelanggan_id)} className="ml-auto text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer shrink-0">Lihat Buku</button>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Utang Sebelumnya:</span>
          <span className="font-bold text-slate-800">{formatRupiah(utangSebelumnya)}</span>
        </div>
        <div className="flex justify-between">
          <span>{transactionType === 'kasbon' ? 'Tambahan Kasbon Ini:' : 'Pembayaran Ini:'}</span>
          <span className={`font-bold ${transactionType === 'kasbon' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {transactionType === 'kasbon' ? '+' : '-'}{formatRupiah(nominal)}
          </span>
        </div>
      </div>

      {batasKasbon ? (
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-slate-400">Rasio Batas Kasbon (Maks {formatRupiah(batasKasbon)})</span>
            <span className={rasioBatas >= 100 ? 'text-rose-600' : rasioBatas >= 70 ? 'text-amber-600' : 'text-emerald-600'}>{rasioBatas}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className={`${rasioBatas >= 100 ? 'bg-rose-500' : rasioBatas >= 70 ? 'bg-amber-500' : 'bg-emerald-500'} h-full rounded-full transition-all duration-300`} style={{ width: `${rasioBatas}%` }}></div>
          </div>
        </div>
      ) : (
        <p className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">Pelanggan ini tanpa batas kasbon.</p>
      )}

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-900">{transactionType === 'kasbon' ? 'Total Utang Baru:' : 'Sisa Utang Baru:'}</p>
          <p className="text-[10px] text-slate-400">Akan tercatat di buku {selectedPelanggan?.nama ?? 'pelanggan'}</p>
        </div>
        <p className={`text-2xl font-black ${totalUtangBaru === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatRupiah(totalUtangBaru)}</p>
      </div>

      {transactionType === 'kasbon' && (
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500 text-[11px]">Jatuh Tempo Pembayaran:</span>
          <span className="font-bold text-emerald-800 flex items-center gap-1">
            <span>🗓️ {formatTanggal(jatuhTempo)}</span>
          </span>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Pencatatan otomatis masuk ke buku {ringkasanLabel.toLowerCase()} <strong>{selectedPelanggan?.nama ?? 'pelanggan'}</strong>. Setelah disimpan, Anda dapat langsung mengirim {transactionType === 'kasbon' ? 'nota tagihan' : 'kwitansi'} via <strong>manual hyperlink wa.me</strong> dari nomor WhatsApp pribadi warung Anda tanpa bot API.
          </span>
        </div>
      </div>
    </div>
  );
}

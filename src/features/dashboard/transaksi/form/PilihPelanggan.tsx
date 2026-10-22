import { useRef, useState } from 'react';
import { UserPlus, ChevronDown, Search, Lock } from 'lucide-react';
import type { SaldoPelanggan } from '../../../../lib/types';
import { formatRupiah, initials } from '../../../../lib/utils';

interface PilihPelangganProps {
  customers: SaldoPelanggan[];
  selectedPelanggan: SaldoPelanggan | null;
  utangSebelumnya: number;
  transactionType: 'kasbon' | 'cicilan';
  /** kasbon baru dikunci karena pelanggan menunggak lebih dari 7 hari */
  terkunci: boolean;
  onSelect: (pelangganId: string) => void;
  onAddNew: () => void;
}

/** Langkah 1: pilih pelanggan (kartu terpilih + kotak cari + daftar hasil) */
export default function PilihPelanggan({
  customers, selectedPelanggan, utangSebelumnya, transactionType, terkunci, onSelect, onAddNew,
}: PilihPelangganProps) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = customerSearch.trim().toLowerCase();
  const filteredCustomers = customers
    .filter((c) => !q || c.nama.toLowerCase().includes(q) || c.kode.toLowerCase().includes(q))
    .slice(0, 8);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-extrabold text-slate-800">Pilih Pelanggan Warung <span className="text-rose-500">*</span></label>
        <button type="button" onClick={() => onAddNew()} className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer">
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Pelanggan Baru</span>
        </button>
      </div>

      {selectedPelanggan ? (
        <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-50/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">{initials(selectedPelanggan.nama)}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900 truncate">{selectedPelanggan.nama}</span>
                <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">{selectedPelanggan.kode}</span>
              </div>
              <p className="text-[11px] text-rose-600 font-bold mt-0.5">Total Utang Sekarang: {formatRupiah(utangSebelumnya)}</p>
            </div>
          </div>
          <button type="button" onClick={() => { setShowDropdown(true); searchRef.current?.focus(); }} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer shrink-0">
            <span>Ganti Pelanggan</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 text-center">
          Belum ada pelanggan dipilih. Cari nama di bawah{customers.length === 0 ? ' atau tambah pelanggan baru.' : '.'}
        </div>
      )}

      {terkunci && transactionType === 'kasbon' && (
        <div className="mt-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold rounded-xl px-3 py-2 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Kasbon baru dikunci: menunggak {selectedPelanggan?.hari_telat} hari (lewat 7 hari). Terima pembayaran dulu.</span>
        </div>
      )}

      <div className="relative mt-2">
        <span className="absolute left-3.5 top-2.5 text-slate-400"><Search className="w-3.5 h-3.5" /></span>
        <input
          ref={searchRef}
          type="text"
          value={customerSearch}
          onChange={(e) => { setCustomerSearch(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Ketik nama pelanggan lain (misal: Bu Nanik, Mas Budi)..."
          className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
        />
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <div
                    key={c.pelanggan_id}
                    onClick={() => { onSelect(c.pelanggan_id); setCustomerSearch(''); setShowDropdown(false); }}
                    className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 flex justify-between items-center"
                  >
                    <span className="text-xs font-bold text-slate-800">{c.nama} <span className="text-[10px] text-slate-400 font-mono ml-1">{c.kode}</span></span>
                    <span className={`text-[11px] font-bold ${c.sisa_utang > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatRupiah(c.sisa_utang)}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-500 text-center">Tidak ditemukan. Klik "+ Pelanggan Baru" untuk menambahkan.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

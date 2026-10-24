import { Search, Bell, User, ChevronDown, ShoppingBag } from 'lucide-react';
import type { SaldoPelanggan, Transaksi } from '../../../lib/types';
import { formatRupiah, formatWaktuRelatif } from '../../../lib/utils';

interface TopBarProps {
  namaWarung: string;
  namaPemilik: string;
  fotoUrl?: string | null;
  saldos: SaldoPelanggan[];
  trans: Transaksi[];
  /** pelanggan yang telat / jatuh tempo hari ini (isi lonceng notifikasi) */
  tagihList: SaldoPelanggan[];
  query: string;
  onQueryChange: (v: string) => void;
  showSearch: boolean;
  onShowSearchChange: (v: boolean) => void;
  showNotif: boolean;
  onShowNotifChange: (v: boolean) => void;
  onOpenCustomer: (id: string) => void;
}

/** Bar atas: nama warung, kotak pencarian, lonceng pengingat, profil pemilik */
export default function TopBar({
  namaWarung, namaPemilik, fotoUrl, saldos, trans, tagihList,
  query, onQueryChange, showSearch, onShowSearchChange, showNotif, onShowNotifChange, onOpenCustomer,
}: TopBarProps) {
  const q = query.trim().toLowerCase();
  const hasilPelanggan = q
    ? saldos.filter((s) => s.nama.toLowerCase().includes(q) || s.kode.toLowerCase().includes(q) || (s.whatsapp ?? '').includes(q)).slice(0, 5)
    : [];
  const hasilBarang = q
    ? trans.filter((t) => (t.barang ?? '').toLowerCase().includes(q)).slice(0, 5)
    : [];

  return (
    <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shrink-0 max-w-[55%] sm:max-w-none">
          {fotoUrl ? (
            <img src={fotoUrl} alt="" className="w-5 h-5 rounded-md object-cover" />
          ) : (
            <span className="text-emerald-600">🏪</span>
          )}
          <span className="truncate">{namaWarung}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>

        <div className="relative max-w-md w-full hidden sm:block">
          <span className="absolute left-3 top-2.5 text-slate-400"><Search className="w-3.5 h-3.5" /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => { onQueryChange(e.target.value); onShowSearchChange(true); }}
            onFocus={() => onShowSearchChange(true)}
            placeholder="Cari nama pelanggan atau barang..."
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
          {showSearch && q && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => onShowSearchChange(false)} />
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto text-xs">
                {hasilPelanggan.length === 0 && hasilBarang.length === 0 && (
                  <p className="p-3 text-center text-slate-400">Tidak ditemukan.</p>
                )}
                {hasilPelanggan.map((s) => (
                  <button key={s.pelanggan_id} onClick={() => onOpenCustomer(s.pelanggan_id)} className="w-full text-left p-3 hover:bg-emerald-50 border-b border-slate-100 flex justify-between items-center cursor-pointer">
                    <span className="font-bold text-slate-800">{s.nama} <span className="font-mono text-[10px] text-slate-400 ml-1">{s.kode}</span></span>
                    <span className={`font-bold ${s.sisa_utang > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatRupiah(s.sisa_utang)}</span>
                  </button>
                ))}
                {hasilBarang.map((t) => (
                  <button key={t.id} onClick={() => onOpenCustomer(t.pelanggan_id)} className="w-full text-left p-3 hover:bg-emerald-50 border-b border-slate-100 cursor-pointer">
                    <p className="font-bold text-slate-800 flex items-center gap-1"><ShoppingBag className="w-3 h-3 text-slate-400" /> {t.barang}</p>
                    <p className="text-[10px] text-slate-400">{t.pelanggan?.nama} • {formatWaktuRelatif(t.created_at)}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => onShowNotifChange(!showNotif)}
            className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {tagihList.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>}
          </button>
          {showNotif && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => onShowNotifChange(false)} />
              <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg text-xs overflow-hidden">
                <p className="px-3 py-2.5 font-extrabold text-slate-900 border-b border-slate-100">Pengingat Jatuh Tempo</p>
                {tagihList.length === 0 && <p className="p-4 text-center text-slate-400">Tidak ada yang menunggak. 🎉</p>}
                {tagihList.slice(0, 6).map((s) => (
                  <button key={s.pelanggan_id} onClick={() => onOpenCustomer(s.pelanggan_id)} className="w-full text-left px-3 py-2.5 hover:bg-rose-50/50 border-b border-slate-100 flex items-center justify-between cursor-pointer">
                    <span>
                      <span className="font-bold text-slate-800 block">{s.nama}</span>
                      <span className="text-[10px] text-rose-600 font-bold">{s.hari_telat > 0 ? `Telat ${s.hari_telat} hari` : 'Jatuh tempo hari ini'}</span>
                    </span>
                    <span className="font-black text-rose-600">{formatRupiah(s.sisa_utang)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-extrabold text-slate-900 leading-tight">{namaPemilik}</p>
            <p className="text-[10px] text-slate-400 font-medium">Pemilik Warung</p>
          </div>
          {fotoUrl ? (
            <img src={fotoUrl} alt="Foto warung" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs"><User className="w-4 h-4" /></div>
          )}
        </div>
      </div>
    </header>
  );
}
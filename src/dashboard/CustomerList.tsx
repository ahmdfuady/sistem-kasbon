import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Download, ExternalLink } from 'lucide-react';
import { listSaldo } from '../lib/api';
import type { SaldoPelanggan } from '../lib/types';
import { buildPesanTagihan, buildWaLink, downloadCsv, formatRupiah, initials, todayISO } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import AddCustomerModal from '../components/AddCustomerModal';

interface CustomerListProps {
  onOpen: (pelangganId: string) => void;
  onRecord: (pelangganId: string, jenis: 'kasbon' | 'cicilan') => void;
}

export default function CustomerList({ onOpen, onRecord }: CustomerListProps) {
  const { warung } = useAuth();
  const [customers, setCustomers] = useState<SaldoPelanggan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'semua' | 'berutang' | 'telat' | 'lunas'>('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    setError('');
    try {
      setCustomers(await listSaldo());
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Gagal memuat daftar pelanggan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filtered = customers
    .filter((c) => !q || c.nama.toLowerCase().includes(q) || c.kode.toLowerCase().includes(q) || (c.whatsapp ?? '').includes(q))
    .filter((c) =>
      filter === 'semua' ? true
      : filter === 'berutang' ? c.sisa_utang > 0
      : filter === 'telat' ? c.sisa_utang > 0 && c.hari_telat > 0
      : c.sisa_utang <= 0
    );

  const hitung = {
    semua: customers.length,
    berutang: customers.filter((c) => c.sisa_utang > 0).length,
    telat: customers.filter((c) => c.sisa_utang > 0 && c.hari_telat > 0).length,
    lunas: customers.filter((c) => c.sisa_utang <= 0).length,
  };

  const waFor = (c: SaldoPelanggan) =>
    buildWaLink(
      c.whatsapp,
      warung
        ? buildPesanTagihan({
            template: warung.template_wa,
            namaWarga: c.nama,
            namaWarung: warung.nama_warung,
            namaPemilik: warung.nama_pemilik,
            nominal: c.sisa_utang,
            jatuhTempo: c.jatuh_tempo_terakhir,
            catatanStruk: warung.catatan_struk,
          })
        : ''
    );

  const exportCsv = () =>
    downloadCsv(`daftar-pelanggan-${todayISO()}.csv`, [
      ['Kode', 'Nama', 'WhatsApp', 'Total Kasbon', 'Total Bayar', 'Sisa Utang', 'Jatuh Tempo', 'Hari Telat'],
      ...customers.map((c) => [c.kode, c.nama, c.whatsapp, c.total_kasbon, c.total_bayar, c.sisa_utang, c.jatuh_tempo_terakhir, c.hari_telat]),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/60 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Buku Daftar Pelanggan & Warga</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola data warga yang biasa berbelanja dan berhutang di warung.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={customers.length === 0}
            className="bg-white hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#05603a] hover:bg-[#044e2f] text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Pelanggan Baru</span>
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative max-w-md w-full">
          <span className="absolute left-3.5 top-3 text-slate-400"><Search className="w-4 h-4" /></span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, kode, atau nomor WA..."
            className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          />
        </div>
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600 overflow-x-auto">
          {([['semua', 'Semua'], ['berutang', 'Berutang'], ['telat', 'Telat'], ['lunas', 'Lunas']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${filter === id ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              {label} ({hitung[id]})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-4 py-3 flex justify-between gap-3">
          <span>{error}</span>
          <button onClick={loadCustomers} className="font-bold underline cursor-pointer">Coba lagi</button>
        </div>
      )}

      {/* Grid Pelanggan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const telat = c.sisa_utang > 0 && c.hari_telat > 0;
          const rasio = c.batas_kasbon && c.batas_kasbon > 0 ? Math.min(Math.round((c.sisa_utang / c.batas_kasbon) * 100), 100) : null;
          return (
            <div key={c.pelanggan_id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-emerald-600 transition flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">{initials(c.nama)}</div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm text-slate-900 truncate">{c.nama}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{c.kode}{c.whatsapp ? ` • ${c.whatsapp}` : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400">Sisa Utang</p>
                    <p className={`text-base font-black ${c.sisa_utang > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatRupiah(c.sisa_utang)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400">Status</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${telat ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
                      {telat ? `Telat ${c.hari_telat}h` : c.sisa_utang > 0 ? 'Berjalan' : 'Lunas'}
                    </span>
                  </div>
                </div>

                {rasio !== null && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Batas {formatRupiah(c.batas_kasbon)}</span>
                      <span className={rasio >= 100 ? 'text-rose-600' : 'text-emerald-600'}>{rasio}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`${rasio >= 100 ? 'bg-rose-500' : 'bg-emerald-500'} h-full rounded-full`} style={{ width: `${rasio}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => onOpen(c.pelanggan_id)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition cursor-pointer">Detail</button>
                <button onClick={() => onRecord(c.pelanggan_id, 'kasbon')} className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer">+Kasbon</button>
                {c.sisa_utang > 0 && (
                  <>
                    <button onClick={() => onRecord(c.pelanggan_id, 'cicilan')} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer">Bayar</button>
                    <a href={waFor(c)} target="_blank" rel="noreferrer" title="Tagih via WhatsApp" className="bg-[#25d366] hover:bg-[#20ba59] text-white px-2.5 py-2 rounded-xl transition">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-xs text-slate-400">
          {customers.length === 0 ? 'Belum ada pelanggan. Klik "+ Tambah Pelanggan Baru" untuk mulai mencatat.' : 'Tidak ada pelanggan yang cocok.'}
        </div>
      )}
      {isLoading && <p className="text-center text-xs text-slate-400">Memuat daftar pelanggan...</p>}

      {isModalOpen && (
        <AddCustomerModal
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            loadCustomers();
          }}
        />
      )}
    </div>
  );
}

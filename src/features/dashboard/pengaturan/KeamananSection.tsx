import React, { useState } from 'react';
import { ShieldCheck, Lock, Download } from 'lucide-react';
import { useAuth, getRememberPref, setRememberPref } from '../../auth/AuthContext';
import { validasiSandiBaru } from '../../../validation';
import { listPelanggan, listTransaksi, ubahSandi } from '../../../api';
import { downloadCsv, formatWaktu, todayISO } from '../../../lib/utils';
import { toggleCls } from './styles';

/**
 * 4. Keamanan akun: ganti kata sandi, "ingat saya", dan unduh cadangan data.
 * Semua state-nya milik bagian ini sendiri (tidak ikut tombol "Simpan Semua Perubahan").
 */
export default function KeamananSection({ sectionRef }: { sectionRef: React.Ref<HTMLDivElement> }) {
  const { warung, user } = useAuth();
  const [rememberMe, setRememberMe] = useState(getRememberPref());
  const [showPw, setShowPw] = useState(false);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const handleGantiSandi = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    const errSandi = validasiSandiBaru(pw1, pw2);
    if (errSandi) return setPwMsg({ ok: false, text: errSandi });
    setPwSaving(true);
    const { error } = await ubahSandi(pw1);
    setPwSaving(false);
    if (error) return setPwMsg({ ok: false, text: error.message });
    setPwMsg({ ok: true, text: 'Kata sandi berhasil diperbarui.' });
    setPw1('');
    setPw2('');
    setTimeout(() => setShowPw(false), 1500);
  };

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const [plg, trx] = await Promise.all([listPelanggan(), listTransaksi()]);
      const tgl = todayISO();
      downloadCsv(`cadangan-pelanggan-${tgl}.csv`, [
        ['Kode', 'Nama', 'WhatsApp', 'Alamat', 'Batas Kasbon', 'Catatan Pribadi', 'Terdaftar'],
        ...plg.map((p) => [p.kode, p.nama, p.whatsapp, p.alamat, p.batas_kasbon, p.catatan_pribadi, formatWaktu(p.created_at)]),
      ]);
      downloadCsv(`cadangan-transaksi-${tgl}.csv`, [
        ['Waktu', 'Kode Pelanggan', 'Pelanggan', 'Jenis', 'Nominal', 'Barang', 'Catatan', 'Jatuh Tempo', 'Metode Bayar', 'No Kwitansi'],
        ...trx.map((t) => [formatWaktu(t.created_at), t.pelanggan?.kode, t.pelanggan?.nama, t.jenis, t.nominal, t.barang, t.catatan, t.jatuh_tempo, t.jenis === 'cicilan' ? t.metode_bayar : '', t.no_kwitansi]),
      ]);
    } catch (err: any) {
      alert(err?.message || 'Gagal membuat file cadangan');
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <div ref={sectionRef} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-24">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">4. Keamanan Akun & Staf Kasir</h3>
          <p className="text-[11px] text-slate-400">Pengaturan hak akses, proteksi ganti kata sandi, dan cadangan data offline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Email Login Kasir Utama</label>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center gap-2 text-xs font-bold text-slate-800">
            <span>✉️</span>
            <span className="truncate">{user?.email ?? '-'}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Email ini terhubung dengan verifikasi akun Supabase.</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Kata Sandi Akun</label>
          <button type="button" onClick={() => { setShowPw((v) => !v); setPwMsg(null); }} className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition cursor-pointer">
            <Lock className="w-3.5 h-3.5" />
            <span>{showPw ? 'Tutup Form Kata Sandi' : 'Perbarui Kata Sandi Akun'}</span>
          </button>
          <p className="text-[10px] text-slate-400 mt-1">Ganti kata sandi secara berkala agar akun tetap aman.</p>
        </div>
      </div>

      {showPw && (
        <form onSubmit={handleGantiSandi} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-start">
          <input type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} placeholder="Kata sandi baru (min. 8 karakter)" className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
          <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Ulangi kata sandi baru" className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
          <button type="submit" disabled={pwSaving} className="bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-60 text-white font-bold text-xs rounded-xl px-3 py-2.5 cursor-pointer">{pwSaving ? 'Menyimpan...' : 'Simpan Kata Sandi'}</button>
          {pwMsg && <p className={`sm:col-span-3 text-[11px] font-bold ${pwMsg.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{pwMsg.text}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Ingat Saya di Komputer Kasir Ini</p>
            <p className="text-[10px] text-slate-400">{warung?.nama_pemilik || 'Anda'} tidak perlu bolak-balik ketik sandi tiap pagi buka warung.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-3">
            <input type="checkbox" checked={rememberMe} onChange={(e) => { setRememberMe(e.target.checked); setRememberPref(e.target.checked); }} className="sr-only peer" />
            <div className={toggleCls}></div>
          </label>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Cadangan Buku Kasbon Warga</p>
            <p className="text-[10px] text-slate-400">Simpan salinan utang warga ke flashdisk atau laptop (XLS / CSV).</p>
          </div>
          <button type="button" disabled={backingUp} onClick={handleBackup} className="bg-white hover:bg-slate-100 disabled:opacity-60 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0 ml-2">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{backingUp ? 'Menyiapkan...' : 'Unduh File'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

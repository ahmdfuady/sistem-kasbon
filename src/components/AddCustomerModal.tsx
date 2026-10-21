import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { createPelanggan, updatePelanggan } from '../lib/api';
import type { Pelanggan } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { formatAngkaInput, parseAngka } from '../lib/format';
import { validasiPelanggan } from '../validation';

interface Props {
  /** kalau diisi -> mode edit */
  initial?: Pelanggan | null;
  onClose: () => void;
  onSaved: (p: Pelanggan) => void;
}

const inputCls =
  'w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition';

export default function AddCustomerModal({ initial, onClose, onSaved }: Props) {
  const { warung } = useAuth();
  const [nama, setNama] = useState(initial?.nama ?? '');
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? '');
  const [alamat, setAlamat] = useState(initial?.alamat ?? '');
  const [catatan, setCatatan] = useState(initial?.catatan_pribadi ?? '');
  // pelanggan baru -> default batas ikut plafon default warung
  const [batas, setBatas] = useState<string>(
    initial ? (initial.batas_kasbon === null ? '' : formatAngkaInput(initial.batas_kasbon)) : warung?.plafon_default ? formatAngkaInput(warung.plafon_default) : ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = validasiPelanggan({
      nama,
      whatsapp,
      batasKasbon: batas.trim() === '' ? null : parseAngka(batas),
    });
    if (err) {
      setError(err);
      return;
    }
    const payload = {
      nama: nama.trim(),
      whatsapp: whatsapp.trim() || null,
      alamat: alamat.trim() || null,
      catatan_pribadi: catatan.trim() || null,
      batas_kasbon: batas.trim() === '' ? null : parseAngka(batas),
    };
    setSaving(true);
    try {
      const saved = initial ? await updatePelanggan(initial.id, payload) : await createPelanggan(payload);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pelanggan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">{initial ? 'Ubah Data Pelanggan' : 'Tambah Pelanggan Baru'}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Nama Pelanggan <span className="text-rose-500">*</span>
            </label>
            <input className={inputCls} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="contoh: Pak Joko (Bengkel Depan)" autoFocus />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Nomor WhatsApp</label>
            <input className={inputCls} type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="contoh: 081234567890" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Alamat / Patokan</label>
            <input className={inputCls} value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="contoh: Samping bengkel, RT 02/04" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Batas Maksimal Kasbon (Rp)</label>
            <input className={inputCls} type="text" inputMode="numeric" value={batas} onChange={(e) => setBatas(formatAngkaInput(e.target.value))} placeholder="Kosongkan = tanpa batas" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Catatan Pribadi</label>
            <textarea className={inputCls + ' resize-none'} rows={2} value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="contoh: biasanya bayar hari Sabtu sore" />
          </div>

          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-3 py-2">{error}</div>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-60 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

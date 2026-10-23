import { useState } from 'react';
import { Edit2, Lock, Save, X } from 'lucide-react';
import { updatePelanggan } from '../../../../api';
import type { Pelanggan } from '../../../../lib/types';

interface SpecialNotesProps {
  pelanggan: Pelanggan;
  namaPemilik: string;
  /** dipanggil setelah catatan berhasil disimpan, dengan data pelanggan terbaru */
  onSaved: (p: Pelanggan) => void;
}

/** Catatan pribadi tentang pelanggan (bisa diedit langsung) */
export default function SpecialNotes({ pelanggan, namaPemilik, onSaved }: SpecialNotesProps) {
  const [editCatatan, setEditCatatan] = useState(false);
  const [catatanDraft, setCatatanDraft] = useState('');
  const [savingCatatan, setSavingCatatan] = useState(false);

  const handleSaveCatatan = async () => {
    setSavingCatatan(true);
    try {
      const upd = await updatePelanggan(pelanggan.id, { catatan_pribadi: catatanDraft.trim() || null });
      onSaved(upd);
      setEditCatatan(false);
    } catch (err: any) {
      alert(err?.message || 'Gagal menyimpan catatan');
    } finally {
      setSavingCatatan(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700">📝</span>
          <h4 className="font-extrabold text-xs text-slate-900">Catatan Khusus Pelanggan</h4>
        </div>
        {!editCatatan ? (
          <button onClick={() => { setCatatanDraft(pelanggan.catatan_pribadi ?? ''); setEditCatatan(true); }} className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer">
            <Edit2 className="w-3 h-3" /><span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <button onClick={() => setEditCatatan(false)} className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer"><X className="w-3 h-3" />Batal</button>
            <button onClick={handleSaveCatatan} disabled={savingCatatan} className="text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"><Save className="w-3 h-3" />{savingCatatan ? '...' : 'Simpan'}</button>
          </div>
        )}
      </div>

      {editCatatan ? (
        <textarea
          rows={3}
          value={catatanDraft}
          onChange={(e) => setCatatanDraft(e.target.value)}
          placeholder="contoh: biasanya bayar hari Sabtu sore"
          className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          autoFocus
        />
      ) : (
        <div className="bg-slate-50 border-l-4 border-emerald-600 p-3 rounded-r-xl text-xs text-slate-700 leading-relaxed italic whitespace-pre-line">
          {pelanggan.catatan_pribadi ? `"${pelanggan.catatan_pribadi}"` : 'Belum ada catatan. Klik Edit untuk menambah (misal: kebiasaan bayar).'}
        </div>
      )}

      <p className="text-[10px] text-slate-400 flex items-center gap-1">
        <Lock className="w-3 h-3 text-slate-400" />
        <span>Hanya terlihat oleh pengelola warung ({namaPemilik})</span>
      </p>
    </div>
  );
}

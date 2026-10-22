import React, { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { ubahSandi } from '../../api';
import { validasiSandiBaru } from '../../validation';
import { useAuth } from './AuthContext';

// Tampil setelah user klik tautan "reset password" dari email (event PASSWORD_RECOVERY)
export default function ResetPassword() {
  const { setRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errSandi = validasiSandiBaru(password, confirm);
    if (errSandi) return setError(errSandi);
    setLoading(true);
    const { error: err } = await ubahSandi(password);
    setLoading(false);
    if (err) return setError(err.message);
    alert('Kata sandi berhasil diperbarui.');
    setRecovery(false); // user sudah punya sesi -> otomatis masuk Dashboard
  };

  const inputCls =
    'w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition';

  return (
    <div className="min-h-screen bg-[#f3f7f5] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Buat Kata Sandi Baru</h1>
        <p className="text-xs text-slate-500 mt-1.5 mb-6">Masukkan kata sandi baru untuk akun warung Anda.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" className={inputCls} placeholder="Kata sandi baru (min. 8 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" className={inputCls} placeholder="Ulangi kata sandi baru" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-3.5 py-2.5">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

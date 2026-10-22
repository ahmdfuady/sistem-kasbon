import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  LogIn, 
  Info, 
  ExternalLink, 
  Lock,
  Cloud,
  CheckCircle
} from 'lucide-react';
import AuthLayout from './AuthLayout';
import { loginDenganSandi } from '../../api';
import { validasiEmail } from '../../validation';
import { getRememberPref, setRememberPref } from './AuthContext';

interface LoginProps {
  onBackToHome?: () => void;
  onNavigateToRegister?: () => void;
  onForgotPassword?: () => void;
  onLoginSuccess?: () => void;
}

export default function Login({ 
  onBackToHome, 
  onNavigateToRegister, 
  onForgotPassword,
  onLoginSuccess 
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(getRememberPref());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const err = validasiEmail(email) ?? (password ? null : 'Kata sandi wajib diisi.');
    if (err) return setErrorMsg(err);
    setIsLoading(true);
    try {
      const { data, error } = await loginDenganSandi(email.trim(), password);
      if (error) throw error;
      setRememberPref(rememberMe);
      if (data.user && onLoginSuccess) onLoginSuccess();
    } catch (err: any) {
      const msg: string = err?.message || '';
      setErrorMsg(
        /invalid login/i.test(msg)
          ? 'Email atau kata sandi salah. Periksa kembali lalu coba lagi.'
          : /email not confirmed/i.test(msg)
          ? 'Email belum dikonfirmasi. Cek kotak masuk email Anda dulu.'
          : msg || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout onLogoClick={() => (onBackToHome)?.()}>
      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md rounded-3xl p-3 sm:p-5 border border-slate-200/60 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* ================= PANEL KIRI (INFO WARUNG) ================= */}
            <div className="lg:col-span-5 bg-gradient-to-b from-emerald-50/70 to-slate-50 border border-emerald-100/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kasir & Pembukuan Warung</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                  Buku Kasbon Rapi, Rezeki Warung Lancar
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Masuk untuk kelola catatan utang pelanggan, pantau jatuh tempo, dan kirim pengingat tagihan via WhatsApp langsung dari meja kasir.
                </p>

                <ul className="space-y-3.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Data utang tetap aman walau HP kasir ganti</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Hitung total piutang otomatis tanpa kalkulator</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Struk digital kasbon siap kirim ke pembeli</span>
                  </li>
                </ul>
              </div>

              {/* Warung Card Mockup & Footer Kiri */}
              <div className="mt-8 pt-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
                  <img 
                    src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80" 
                    alt="Suasana Warung Kelontong" 
                    className="w-full h-36 object-cover opacity-60 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-slate-300 font-medium">Buku Kas Warung Aktif</p>
                        <p className="text-sm font-bold text-white mt-0.5">142 Pelanggan Terdaftar</p>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
                        <Cloud className="w-3 h-3 text-emerald-400" /> Terkoneksi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Server Cloud Indonesia • Terenkripsi SSL 256-Bit</span>
                </div>
              </div>
            </div>

            {/* ================= PANEL KANAN (FORM LOGIN) ================= */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Masuk Akun Warung
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                      Gunakan alamat email dan kata sandi yang terdaftar di warung Anda.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-3.5 py-2.5">
                      {errorMsg}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800">
                        Alamat Email Terdaftar <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">Akun Kasir / Pemilik</span>
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: busiti.warung@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Email yang digunakan saat pertama kali mendaftarkan warung</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-800">
                        Kata Sandi Akun <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">Minimal 8 Karakter</span>
                    </div>

                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi warung"
                        className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl pl-10 pr-11 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                      />
                      <span>Ingat di komputer kasir ini</span>
                    </label>

                    {/* Tombol Lupa Kata Sandi */}
                    <button 
                      type="button"
                      onClick={onForgotPassword}
                      className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>

                  {/* Tombol Masuk ke Akun Warung */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-70 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoading ? 'Memeriksa...' : 'Masuk ke Akun Warung'}</span>
                  </button>
                </form>
              </div>

              {/* Box Bawah: Daftar Warung Baru & CS WhatsApp */}
              <div className="mt-8 space-y-3 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-xl p-3 text-center text-xs text-slate-600 font-medium">
                  Belum punya buku kasbon online?{' '}
                  <button 
                    type="button"
                    onClick={onNavigateToRegister}
                    className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline ml-1 cursor-pointer bg-transparent border-none p-0"
                  >
                    Daftar Warung Baru
                  </button>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      🎧
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Kendala saat masuk akun kasir?</p>
                      <p className="text-[10px] text-slate-500">CS KasbonKu siap bantu via WhatsApp</p>
                    </div>
                  </div>

                  <a 
                    href="https://wa.me/6281199887766" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    <span>0811-9988-7766</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Badges bawah container */}
          <div className="py-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Enkripsi SSL 256-Bit
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" /> Server Cloud Indonesia
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terkoneksi Otomatis
            </span>
          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
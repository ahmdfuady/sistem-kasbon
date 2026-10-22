import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Store, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Server, 
  LockKeyhole
} from 'lucide-react';
import AuthLayout from './AuthLayout';
import { daftarAkunWarung } from '../../api';
import { validasiEmail, validasiSandiBaru, validasiTeksWajib, validasiWhatsapp } from '../../validation';

interface RegisterProps {
  onBackToLogin: () => void;
  onBackToHome?: () => void;
}

export default function Register({ onBackToLogin, onBackToHome }: RegisterProps) {
  const [namaPemilik, setNamaPemilik] = useState('');
  const [namaWarung, setNamaWarung] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // State untuk integrasi Supabase & UI Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const err =
      validasiTeksWajib(namaPemilik, 'Nama pemilik') ??
      validasiTeksWajib(namaWarung, 'Nama warung') ??
      validasiEmail(email) ??
      validasiWhatsapp(whatsapp, { wajib: true }) ??
      validasiSandiBaru(password, confirmPassword);
    if (err) {
      setErrorMessage(err);
      return;
    }

    setLoading(true);

    // Proses registrasi ke Supabase Auth
    const { data, error } = await daftarAkunWarung({ email, password, namaPemilik, namaWarung, whatsapp });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.user) {
      alert(
        data.session
          ? 'Pendaftaran warung berhasil! Silakan masuk ke akun Anda.'
          : 'Pendaftaran berhasil! Cek email Anda untuk konfirmasi, lalu masuk ke akun Anda.'
      );
      onBackToLogin();
    }
  };

  return (
    <AuthLayout onLogoClick={() => (onBackToHome || onBackToLogin)?.()}>
      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md rounded-3xl p-3 sm:p-5 border border-slate-200/60 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* ================= PANEL KIRI ================= */}
            <div className="lg:col-span-5 bg-gradient-to-b from-emerald-50/70 to-slate-50 border border-emerald-100/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Buku Kas Warung Digital</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                  Buka Buku Kasbon Warung Anda Hari Ini
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Catat utang piutang pelanggan, kirim pengingat WhatsApp santun, dan cegah rugi akibat buku kas bon hilang atau basah tersiram kopi.
                </p>

                {/* List 4 Benefit */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Login Aman dengan Email</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Akses akun privat warung terlindungi kata sandi dan email terverifikasi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Data Aman di Cloud</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Tidak perlu cemas buku catatan sobek, luntur, atau hilang tercecer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Akses Multi-Perangkat (Laptop & HP)</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Buka serentak kasir toko dari browser komputer kasir maupun handphone.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Pengingat WhatsApp Otomatis ke Pelanggan</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Kirim tagihan tanpa rasa canggung dengan format kalimat ramah & santun.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Social Proof & Footer */}
              <div className="mt-8 pt-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Juragan 1" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Juragan 2" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Juragan 3" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">18.500+ Juragan Warung</p>
                    <p className="text-[10px] text-slate-500">Telah beralih ke pembukuan digital</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                  <Server className="w-3 h-3 text-emerald-600" />
                  <span>Server Cloud Indonesia</span>
                  <span>•</span>
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Enkripsi Bank 256-Bit</span>
                </div>
              </div>
            </div>

            {/* ================= PANEL KANAN (FORM DAFTAR) ================= */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-9 flex flex-col justify-between shadow-sm">
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Daftar Akun Warung
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Buat buku kasbon digital warung Anda dalam 1 menit
                  </p>
                </div>

                {/* Pesan Error Registrasi */}
                {errorMessage && (
                  <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200/80">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Nama Pemilik */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Nama Pemilik / Juragan Warung <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Sesuai KTP / Nama Panggilan</span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input 
                        type="text" 
                        required
                        value={namaPemilik}
                        onChange={(e) => setNamaPemilik(e.target.value)}
                        placeholder="contoh: Bu Siti Aminah"
                        className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  {/* Nama Warung */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      Nama Warung / Toko Kelontong <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <Store className="w-4 h-4" />
                      </span>
                      <input 
                        type="text" 
                        required
                        value={namaWarung}
                        onChange={(e) => setNamaWarung(e.target.value)}
                        placeholder="contoh: Warung Barokah Berkah"
                        className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  {/* Alamat Email Warung */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Alamat Email Warung <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] font-semibold text-emerald-700">Email Utama untuk Login Kasir</span>
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
                        className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  {/* Nomor WhatsApp Warung */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        Nomor WhatsApp Warung
                      </label>
                      <span className="text-[10px] text-slate-400">Untuk kirim struk nota kasbon ke pembeli</span>
                    </div>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 focus-within:bg-white transition">
                      <span className="px-3.5 text-xs font-bold text-slate-500 border-r border-slate-200 bg-slate-100/60 py-2.5">
                        🇮🇩 +62
                      </span>
                      <input 
                        type="tel" 
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="contoh: 081234567890"
                        className="w-full bg-transparent text-xs sm:text-sm px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Kata Sandi & Konfirmasi (Side by Side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Kata Sandi Akun <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-9 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </span>
                        <input 
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi"
                          className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-9 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Persetujuan Ketentuan */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600 leading-snug">
                      <input 
                        type="checkbox" 
                        required
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600 mt-0.5 shrink-0"
                      />
                      <span>
                        Saya menyetujui <a href="#syarat" className="text-emerald-700 underline font-semibold">Ketentuan Layanan</a> & <a href="#privasi" className="text-emerald-700 underline font-semibold">Kebijakan Privasi</a> KasbonKu, serta data utang warung tersimpan aman.
                      </span>
                    </label>
                  </div>

                  {/* Tombol Daftar */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#05603a] hover:bg-[#044e2f] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{loading ? 'Memproses Pendaftaran...' : 'Daftar Akun dengan Email'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Box Bawah */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <p className="text-center text-xs text-slate-600">
                  Sudah punya buku kasbon?{' '}
                  <button 
                    type="button"
                    onClick={onBackToLogin}
                    className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    Masuk dengan Email
                  </button>
                </p>

                {/* CS WhatsApp Support */}
                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-center text-[11px] text-slate-600 flex items-center justify-center gap-2">
                  <span>🎧 Bingung cara mendaftar? Hubungi CS WhatsApp KasbonKu di</span>
                  <a 
                    href="https://wa.me/6281199887766" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-bold text-slate-900 hover:text-emerald-700 transition"
                  >
                    0811-9988-7766
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </AuthLayout>
  );
}
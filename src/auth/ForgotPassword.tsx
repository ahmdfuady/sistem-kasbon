import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  ArrowLeft, 
  Mail, 
  Send, 
  Lock, 
  ArrowRight, 
  PhoneCall, 
  Lightbulb, 
  ShieldAlert
} from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onBackToHome?: () => void;
}

export default function ForgotPassword({ onBackToLogin, onBackToHome }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Tautan pemulihan kata sandi telah dikirim ke ${email}!`);
  };

  return (
    <div className="min-h-screen bg-[#f3f7f5] flex flex-col justify-between font-sans text-slate-800">
      
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div 
          onClick={onBackToHome || onBackToLogin}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">KasbonKu</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Warung
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Catatan Kasbon & Piutang Warung</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100/80 border border-slate-200/60 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Aman & Terpercaya</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50">
          
          {/* Top Bar Card: Kembali & Badge */}
          <div className="flex items-center justify-between pb-6">
            <button 
              type="button"
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Masuk</span>
            </button>

            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-200">
              <ShieldAlert className="w-3 h-3 text-emerald-600" />
              <span>Pemulihan Resmi</span>
            </span>
          </div>

          {/* Icon Header */}
          <div className="text-center my-2">
            <div className="inline-flex relative mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-800"></div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Mail className="w-3 h-3" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lupa Kata Sandi?
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Jangan khawatir Bu Siti / Juragan Warung. Masukkan alamat email warung Anda dan kami akan mengirimkan tautan reset kata sandi ke kotak masuk Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">
                  Alamat Email Terdaftar
                </label>
                <span className="text-[11px] font-bold text-rose-500">* Wajib diisi</span>
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

              <p className="text-[11px] text-slate-500 mt-2">
                Gunakan email yang Anda daftarkan saat pertama kali membuka akun buku KasbonKu.
              </p>
            </div>

            {/* Tips Box */}
            <div className="bg-indigo-50/50 border border-indigo-100/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Tips Cepat:</span> Pastikan memeriksa folder{' '}
                <span className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[10px] text-slate-800 font-bold">"Spam"</span> atau{' '}
                <span className="bg-slate-200/80 px-1 py-0.5 rounded font-mono text-[10px] text-slate-800 font-bold">"Promosi"</span>{' '}
                di aplikasi Gmail ponsel Anda jika tautan belum masuk dalam 2 menit.
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#05603a] hover:bg-[#044e2f] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer pt-3"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Tautan Pemulihan Kata Sandi</span>
            </button>
          </form>

          {/* Divider Sudah Ingat Kata Sandi */}
          <div className="relative my-7 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sudah Ingat Kata Sandi?
            </span>
          </div>

          {/* Tombol Masuk Cepat */}
          <button 
            type="button"
            onClick={onBackToLogin}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Ingat kata sandi akun kasir Anda?</p>
                <p className="text-[10px] text-slate-400">Masuk langsung dengan Email & Kata Sandi</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            Tiba-tiba ingat kata sandi Anda?{' '}
            <button 
              type="button"
              onClick={onBackToLogin} 
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              Masuk Sekarang
            </button>
          </p>

          {/* CS WhatsApp Card */}
          <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                🎧
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Masih ada kendala email?</p>
                <p className="text-[10px] text-slate-400">Tim CS KasbonKu siap memandu langkah demi langkah.</p>
              </div>
            </div>

            <a 
              href="https://wa.me/6281199887766" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#05603a] hover:bg-[#044e2f] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WA: 0811-9988-7766</span>
            </a>
          </div>

          {/* Footer Card */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> 100% Aman & Terverifikasi
            </span>
            <span>•</span>
            <span>Enkripsi 256-Bit</span>
            <span>•</span>
            <span>Sahabat Warung Kelontong</span>
          </div>

        </div>
      </main>

      {/* Footer Bottom */}
      <footer className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 bg-white/50">
        <div className="flex items-center gap-1.5 mb-2 sm:mb-0">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Data tersimpan aman di server awan Indonesia</span>
        </div>
        <p>© 2024 KasbonKu. Sahabat Pembukuan Warung Kelontong Nusantara.</p>
      </footer>

    </div>
  );
}
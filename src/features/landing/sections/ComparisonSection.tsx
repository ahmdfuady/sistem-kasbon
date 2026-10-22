import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  return (
    <section id="masalah" className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Komparasi Solusi</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Kenapa Warung Zaman Now Tinggalkan Buku Kertas?
          </h2>
          <p className="text-sm text-slate-500 mt-3">
            Sudah bukan zamannya pusing karena catatan robek, coret-coretan hilang, atau rasa segan menagih tetangga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-rose-50/40 border border-rose-200/70 rounded-2xl p-7">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-3 py-1 rounded-full">
              CARA LAMA (BUKU KERTAS)
            </span>
            <h3 className="text-lg font-bold text-slate-800 mt-4 mb-4">Sering Bikin Tekor Tanpa Disadari</h3>
            <ul className="space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Buku sobek, basah ketumpahan kopi, atau hilang terselip.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Sering lupa catat waktu antrean warung lagi padat-padatnya.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Pekewuh dan tidak enak hati mau menagih ke tetangga sendiri.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Modal warung seret macet tanpa tahu total kasbon riil.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50/40 border-2 border-emerald-500 rounded-2xl p-7 shadow-lg shadow-emerald-500/5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              CARA CERDAS (KASBONKU)
            </span>
            <h3 className="text-lg font-bold text-slate-800 mt-4 mb-4">Semua Terdata, Hubungan Tetangga Tetap Mesra</h3>
            <ul className="space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Catatan tersimpan aman di cloud HP, ganti HP data tidak hilang.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Input kasbon super cepat cuma butuh 5 detik per transaksi.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Kirim pengingat tagihan santun via WhatsApp tanpa canggung.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pantau limit kasbon per orang agar modal warung selalu sehat.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
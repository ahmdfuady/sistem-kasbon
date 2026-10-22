import React from 'react';
import { Star } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  return (
    <section className="py-10 bg-slate-50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">18.500+</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Warung & Toko Terbantu</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">Rp 4,2 Miliar</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Kasbon Tertagih Lancar</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">84%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Penurunan Piutang Macet</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-amber-500 tracking-tight flex items-center justify-center gap-1">
              4.9 <Star className="w-5 h-5 fill-amber-500 text-amber-500 inline" />
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">Rating Kepuasan Pemilik</p>
          </div>
        </div>
      </div>
    </section>
  );
};
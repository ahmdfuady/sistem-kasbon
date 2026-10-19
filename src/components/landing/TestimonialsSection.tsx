import React from 'react';
import { TESTIMONIALS_DATA } from '../../types/landing';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimoni" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Kata Juragan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Kata Para Pemilik Warung yang Sudah Merasakan Hasilnya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  {item.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
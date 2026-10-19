import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_DATA } from '../../types/landing';

export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Bantuan</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Tanya Jawab Seputar KasbonKu
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 pt-2 border-t border-slate-100 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { LogOut } from 'lucide-react';
import { NAV, type Menu } from '../menu';

interface MobileNavProps {
  isActive: (id: Menu) => boolean;
  onNavigate: (m: Menu) => void;
  onLogout: () => void;
}

/** Menu untuk layar HP (menggantikan sidebar) */
export default function MobileNav({ isActive, onNavigate, onLogout }: MobileNavProps) {
  return (
    <div className="md:hidden bg-white border-b border-slate-200/80 px-3 py-2 flex gap-1.5 overflow-x-auto text-[11px] font-bold">
      {NAV.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${isActive(item.id) ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          <item.icon className="w-3.5 h-3.5" />
          <span>{item.label}</span>
        </button>
      ))}
      <button onClick={() => onLogout()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap bg-rose-50 text-rose-600 cursor-pointer">
        <LogOut className="w-3.5 h-3.5" /><span>Keluar</span>
      </button>
    </div>
  );
}

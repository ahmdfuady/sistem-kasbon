import { ArrowRight, LogOut } from 'lucide-react';
import { NAV, type Menu } from '../menu';

interface SidebarProps {
  isActive: (id: Menu) => boolean;
  onNavigate: (m: Menu) => void;
  onOpenGuide: () => void;
  onLogout: () => void;
}

/** Menu samping (hanya tampil di layar md ke atas) */
export default function Sidebar({ isActive, onNavigate, onOpenGuide, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-emerald-600/30">K</div>
          <div>
            <div className="flex items-center gap-1.5"><span className="font-extrabold text-slate-900 tracking-tight text-base">KasbonKu</span></div>
            <p className="text-[10px] text-slate-400 font-medium">Buku Kas Warung</p>
          </div>
        </div>

        <nav className="space-y-1 text-xs font-semibold">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                isActive(item.id) ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
            <span className="text-emerald-700">🏪</span>
            <span>Bantuan Warung</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">Butuh bantuan mencatat? Hubungi panduan kilat kami.</p>
          <button onClick={() => onOpenGuide()} className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer">
            <span>Buka Panduan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <button onClick={() => onLogout()} className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun Warung</span>
        </button>
      </div>
    </aside>
  );
}

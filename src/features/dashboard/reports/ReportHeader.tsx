import { Calendar, ChevronDown, Download, FileSpreadsheet } from 'lucide-react';

interface ReportHeaderProps {
  menitLalu: number;
  periode: string;
  bulanIniKey: string;
  labelPeriode: string;
  opsiPeriode: { key: string; label: string }[];
  onPeriodeChange: (v: string) => void;
  onDownloadPdf: () => void;
  pdfLoading: boolean;
  onExportCsv: () => void;
}

/** Judul laporan, pilih periode, tombol Unduh PDF dan Ekspor CSV */
export default function ReportHeader({
  menitLalu, periode, bulanIniKey, labelPeriode, opsiPeriode, onPeriodeChange, onDownloadPdf, pdfLoading, onExportCsv,
}: ReportHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-2 border-b border-slate-200/60 gap-4">
      <div>
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/80 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>REKAPITULASI USAHA • Diperbarui {menitLalu === 0 ? 'baru saja' : `${menitLalu} menit lalu`}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Laporan Keuangan & Piutang Warung</h1>
        <p className="text-xs text-slate-500 mt-0.5">Rekapitulasi kasbon tertagih, mutasi perputaran modal dagang, dan analisa kelancaran bayar warga tetangga.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{periode === bulanIniKey ? `Bulan Ini – ${labelPeriode}` : labelPeriode}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={periode}
            onChange={(e) => onPeriodeChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Pilih periode"
          >
            {opsiPeriode.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            <option value="semua">Semua Waktu</option>
          </select>
        </div>

        <button onClick={onDownloadPdf} disabled={pdfLoading} className="bg-white disabled:opacity-60 disabled:cursor-wait hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer">
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{pdfLoading ? 'Membuat PDF...' : 'Unduh PDF'}</span>
        </button>

        <button onClick={onExportCsv} className="bg-[#05603a] hover:bg-[#044e2f] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Ekspor Excel / CSV</span>
        </button>
      </div>
    </div>
  );
}

interface ItemDetailsProps {
  transactionType: 'kasbon' | 'cicilan';
  itemsText: string;
  onItemsChange: (v: string) => void;
  catatanKasbon: string;
  onCatatanKasbonChange: (v: string) => void;
  /** menambahkan satu barang cepat ke kotak rincian */
  onAppendItem: (item: string) => void;
}

/** Kolom kanan atas: rincian barang (kasbon) / catatan pembayaran (cicilan) */
export default function ItemDetails({
  transactionType, itemsText, onItemsChange, catatanKasbon, onCatatanKasbonChange, onAppendItem,
}: ItemDetailsProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-slate-800">{transactionType === 'kasbon' ? 'Rincian Barang yang Diambil' : 'Catatan Pembayaran'}</label>
        <span className="text-[11px] text-slate-400">{transactionType === 'kasbon' ? 'Catatan barang' : 'Opsional'}</span>
      </div>
      <textarea
        rows={3}
        value={itemsText}
        onChange={(e) => onItemsChange(e.target.value)}
        placeholder={transactionType === 'kasbon' ? 'Contoh: 2 botol sirup Marjan & 1 renceng Kopi Hitam' : 'Contoh: Titip lewat anaknya'}
        className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
      />
      {transactionType === 'kasbon' && (
        <>
          <input
            type="text"
            value={catatanKasbon}
            onChange={(e) => onCatatanKasbonChange(e.target.value)}
            placeholder="Catatan tambahan (opsional), misal: diambil anaknya"
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
          <div>
            <p className="text-[10px] text-slate-400 font-bold mb-1.5">Barang sering kasbon:</p>
            <div className="flex flex-wrap gap-1.5">
              {['+ Gas 3kg', '+ Galon Air', '+ Dus Mie Instan', '+ Minyak Goreng 2L', '+ Telur 1kg'].map((item) => (
                <button key={item} type="button" onClick={() => onAppendItem(item.replace('+ ', ''))} className="bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-800 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-indigo-100 transition cursor-pointer">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

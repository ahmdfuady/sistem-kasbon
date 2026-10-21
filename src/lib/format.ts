import type { TemplateWa, TempoOption } from './types';

const TZ = 'Asia/Jakarta';

export const formatRupiah = (n: number | null | undefined): string =>
  'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');

export const formatTanggal = (iso: string | null | undefined): string => {
  if (!iso) return '-';
  // 'YYYY-MM-DD' dianggap tanggal lokal (bukan UTC) supaya tidak mundur sehari
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + 'T00:00:00') : new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: /^\d{4}-\d{2}-\d{2}$/.test(iso) ? undefined : TZ });
};

export const formatTanggalPendek = (iso: string | null | undefined): string => {
  if (!iso) return '-';
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + 'T00:00:00') : new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: /^\d{4}-\d{2}-\d{2}$/.test(iso) ? undefined : TZ });
};

export const formatWaktu = (iso: string): string => {
  const d = new Date(iso);
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ });
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).replace('.', ':');
  return `${tgl}, ${jam} WIB`;
};

// "Hari ini, 09:40" / "Kemarin, 17:30" / "10 Okt, 16:30"
export const formatWaktuRelatif = (iso: string): string => {
  const d = new Date(iso);
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).replace('.', ':');
  const key = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: TZ });
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (key(d) === key(today)) return `Hari ini, ${jam}`;
  if (key(d) === key(yesterday)) return `Kemarin, ${jam}`;
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: TZ });
  return `${tgl}, ${jam}`;
};

export const formatTanggalPanjang = (d: Date = new Date()): string =>
  d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });

export const initials = (nama: string): string => {
  const parts = (nama || '?').trim().split(/\s+/);
  const a = parts[0]?.[0] ?? '?';
  const b = parts.length > 1 ? parts[1][0] : parts[0]?.[1] ?? '';
  return (a + b).toUpperCase();
};

// ---------- Tanggal lokal (YYYY-MM-DD) ----------
export const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayISO = (): string => toISODate(new Date());

export const addDays = (d: Date, n: number): Date => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// Akhir bulan berjalan; kalau hari ini sudah akhir bulan -> akhir bulan depan
export const akhirBulan = (from: Date = new Date()): Date => {
  const end = new Date(from.getFullYear(), from.getMonth() + 1, 0);
  if (toISODate(end) <= toISODate(from)) return new Date(from.getFullYear(), from.getMonth() + 2, 0);
  return end;
};

export const hitungJatuhTempo = (opt: TempoOption, kalender?: string, base: Date = new Date()): string => {
  switch (opt) {
    case '3hari':
      return toISODate(addDays(base, 3));
    case '1minggu':
      return toISODate(addDays(base, 7));
    case 'gajian':
      return toISODate(akhirBulan(base));
    case 'kalender':
      return kalender || toISODate(addDays(base, 7));
  }
};

/** "Kamis, 17 Okt 2024" dari 'YYYY-MM-DD' */
export const formatTanggalHari = (iso: string): string =>
  new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

export const labelTempo = (opt: string | null | undefined): string => {
  switch (opt) {
    case '3hari': return 'Tempo 3 Hari';
    case '1minggu': return 'Tempo 1 Minggu';
    case 'gajian': return 'Tempo Akhir Bulan';
    case 'kalender': return 'Tempo Tanggal Pilihan';
    default: return 'Kasbon';
  }
};

export const labelMetode = (m: string | null | undefined): string =>
  m === 'qris' ? 'QRIS' : m === 'transfer' ? 'Transfer' : 'Tunai';

export const jamWib = (iso: string): string =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).replace('.', ':') + ' WIB';

// ---------- WhatsApp ----------
export const normalizeWa = (phone: string | null | undefined): string | null => {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  else if (digits.startsWith('8')) digits = '62' + digits;
  return digits;
};

export const buildWaLink = (phone: string | null | undefined, text: string): string => {
  const num = normalizeWa(phone);
  return `https://wa.me/${num ?? ''}?text=${encodeURIComponent(text)}`;
};

interface PesanTagihanInput {
  template: TemplateWa;
  namaWarga: string;
  namaWarung: string;
  namaPemilik: string;
  nominal: number;
  jatuhTempo?: string | null;
  catatanStruk?: string | null;
}

export const buildPesanTagihan = (p: PesanTagihanInput): string => {
  const rp = formatRupiah(p.nominal);
  const tempo = p.jatuhTempo ? ` (jatuh tempo ${formatTanggal(p.jatuhTempo)})` : '';
  if (p.template === 'formal') {
    return (
      `Yth. Bapak/Ibu ${p.namaWarga}, kami dari ${p.namaWarung || 'warung kami'} ingin menginformasikan bahwa terdapat sisa kasbon sebesar ${rp}${tempo}. ` +
      `Mohon kesediaannya untuk melakukan pembayaran. Terima kasih atas perhatian dan kerja samanya.` +
      (p.catatanStruk ? `\n\n${p.catatanStruk}` : '')
    );
  }
  return (
    `Assalamu'alaikum ${p.namaWarga}, mohon maaf mengganggu waktunya, sekadar mengingatkan catatan kasbon ${p.namaWarung || 'warung'} sebesar ${rp}${tempo}. ` +
    `Barangkali berkenan disenggangkan hari ini sambil lewat depan warung nggih. Matur nuwun${p.namaPemilik ? ' - ' + p.namaPemilik : ''} 🙏` +
    (p.catatanStruk ? `\n\n${p.catatanStruk}` : '')
  );
};

// ---------- Input angka berformat titik ----------
/** "100000" / "100.000" / "1a00" -> "100.000" (hanya angka yang diambil) */
export const formatAngkaInput = (v: string | number): string => {
  const digits = String(v ?? '').replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
};

/** "100.000" -> 100000 (string kosong -> 0) */
export const parseAngka = (v: string): number => Number(v.replace(/\D/g, '')) || 0;

// ---------- Nota / kwitansi (dikirim lewat wa.me) ----------
export const buildNotaKasbon = (p: {
  namaWarga: string;
  namaWarung: string;
  barang?: string | null;
  nominal: number;
  totalUtang: number;
  jatuhTempo?: string | null;
  catatanStruk?: string | null;
}): string =>
  `Nota Kasbon - ${p.namaWarung || 'Warung'}\n` +
  `Atas nama: ${p.namaWarga}\n` +
  (p.barang ? `Barang: ${p.barang}\n` : '') +
  `Kasbon baru: ${formatRupiah(p.nominal)}\n` +
  `Total utang sekarang: ${formatRupiah(p.totalUtang)}\n` +
  (p.jatuhTempo ? `Jatuh tempo: ${formatTanggal(p.jatuhTempo)}\n` : '') +
  (p.catatanStruk ? `\n${p.catatanStruk}` : '');

export const buildKwitansi = (p: {
  namaWarga: string;
  namaWarung: string;
  noKwitansi?: string | null;
  nominal: number;
  sisaUtang: number;
  metode?: string | null;
  catatanStruk?: string | null;
}): string =>
  `Kwitansi Pembayaran - ${p.namaWarung || 'Warung'}\n` +
  (p.noKwitansi ? `No: ${p.noKwitansi}\n` : '') +
  `Diterima dari: ${p.namaWarga}\n` +
  `Pembayaran (${labelMetode(p.metode)}): ${formatRupiah(p.nominal)}\n` +
  (p.sisaUtang > 0 ? `Sisa utang: ${formatRupiah(p.sisaUtang)}` : 'Status: LUNAS') +
  (p.catatanStruk ? `\n\n${p.catatanStruk}` : '');

// ---------- Cetak / simpan PDF lewat dialog print browser ----------
export const escapeHtml = (v: unknown): string =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export const printHtml = (title: string, bodyHtml: string): void => {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) {
    alert('Pop-up diblokir browser. Izinkan pop-up untuk mencetak.');
    return;
  }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  body{font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#0f172a;padding:28px;font-size:12px}
  h1{font-size:18px;margin:0 0 2px} h2{font-size:13px;margin:18px 0 6px}
  .muted{color:#64748b} table{width:100%;border-collapse:collapse;margin-top:8px}
  th,td{border-bottom:1px solid #e2e8f0;padding:6px 4px;text-align:left;vertical-align:top}
  th{font-size:10px;text-transform:uppercase;color:#64748b} .r{text-align:right}
  .box{display:inline-block;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;margin:6px 8px 0 0}
  .red{color:#dc2626} .green{color:#059669}
</style></head><body>${bodyHtml}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
};

// ---------- CSV ----------
export const downloadCsv = (filename: string, rows: (string | number | null | undefined)[][]): void => {
  const esc = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = '\uFEFF' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// Pecah teks barang "Gula 1kg, Kopi ABC & Rokok" jadi item-item kecil
export const pecahBarang = (barang: string | null | undefined): string[] =>
  (barang || '')
    .split(/,|&|\+|;|\bdan\b/i)
    .map((s) => s.trim())
    .filter(Boolean);

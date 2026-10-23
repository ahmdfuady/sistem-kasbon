import type { TemplateWa } from '../types';
import { formatRupiah } from './currency';
import { formatTanggal } from './date';
import { labelMetode } from './text';

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


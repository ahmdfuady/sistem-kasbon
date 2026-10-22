import { describe, it, expect } from 'vitest';
import {
  formatRupiah, formatAngkaInput, parseAngka, normalizeWa, buildWaLink, buildPesanTagihan,
  buildKwitansi, buildNotaKasbon, hitungJatuhTempo, akhirBulan, toISODate, addDays,
  pecahBarang, initials, escapeHtml, labelMetode, labelTempo,
} from '../lib/utils';

describe('utils: money formatting', () => {
  it('formats rupiah with thousand separators and handles empty values', () => {
    expect(formatRupiah(60000)).toBe('Rp 60.000');
    expect(formatRupiah(1250000)).toBe('Rp 1.250.000');
    expect(formatRupiah(null)).toBe('Rp 0');
    expect(formatRupiah(undefined)).toBe('Rp 0');
  });

  it('formats and parses the dotted number input', () => {
    expect(formatAngkaInput('100000')).toBe('100.000');
    expect(formatAngkaInput('1a00')).toBe('100');
    expect(formatAngkaInput('0005000')).toBe('5.000');
    expect(formatAngkaInput('')).toBe('');
    expect(parseAngka('100.000')).toBe(100000);
    expect(parseAngka('')).toBe(0);
  });
});

describe('utils: WhatsApp', () => {
  it('normalizes Indonesian numbers to the 62 format', () => {
    expect(normalizeWa('0812-3456-7890')).toBe('6281234567890');
    expect(normalizeWa('81234567890')).toBe('6281234567890');
    expect(normalizeWa('+62 812 3456 7890')).toBe('6281234567890');
    expect(normalizeWa('')).toBeNull();
    expect(normalizeWa(null)).toBeNull();
  });

  it('builds a wa.me link with the message URL-encoded', () => {
    const link = buildWaLink('081234567890', 'Halo Pak & Bu');
    expect(link.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
    expect(link).toContain(encodeURIComponent('Halo Pak & Bu'));
  });

  it('writes the polite and the formal reminder templates', () => {
    const p = { namaWarga: 'Pak Budi', namaWarung: 'Warung Soenda', namaPemilik: 'Billy', nominal: 75000 };
    const santun = buildPesanTagihan({ ...p, template: 'santun' });
    const formal = buildPesanTagihan({ ...p, template: 'formal', catatanStruk: 'Terima kasih' });
    expect(santun).toContain("Assalamu'alaikum Pak Budi");
    expect(santun).toContain('Rp 75.000');
    expect(formal).toContain('Yth. Bapak/Ibu Pak Budi');
    expect(formal).toContain('Terima kasih');
  });

  it('marks a receipt as LUNAS only when no debt remains', () => {
    const k = { namaWarga: 'Budi', namaWarung: 'W', nominal: 20000, metode: 'qris' };
    expect(buildKwitansi({ ...k, sisaUtang: 0 })).toContain('LUNAS');
    expect(buildKwitansi({ ...k, sisaUtang: 5000 })).toContain('Sisa utang: Rp 5.000');
    expect(buildKwitansi({ ...k, sisaUtang: 0 })).toContain('QRIS');
  });

  it('includes the items and total debt in the credit note', () => {
    const nota = buildNotaKasbon({ namaWarga: 'Budi', namaWarung: 'W', barang: 'Gula 1kg', nominal: 15000, totalUtang: 65000 });
    expect(nota).toContain('Barang: Gula 1kg');
    expect(nota).toContain('Total utang sekarang: Rp 65.000');
  });
});

describe('utils: due dates', () => {
  const base = new Date(2026, 0, 10); // 10 Jan 2026

  it('calculates 3-day, 1-week and calendar due dates', () => {
    expect(hitungJatuhTempo('3hari', undefined, base)).toBe('2026-01-13');
    expect(hitungJatuhTempo('1minggu', undefined, base)).toBe('2026-01-17');
    expect(hitungJatuhTempo('kalender', '2026-02-02', base)).toBe('2026-02-02');
    expect(hitungJatuhTempo('kalender', '', base)).toBe('2026-01-17'); // fallback 1 minggu
  });

  it('uses the end of the month for "gajian", and rolls over on the last day', () => {
    expect(hitungJatuhTempo('gajian', undefined, base)).toBe('2026-01-31');
    expect(toISODate(akhirBulan(new Date(2026, 0, 31)))).toBe('2026-02-28');
  });

  it('adds days across month boundaries', () => {
    expect(toISODate(addDays(new Date(2026, 0, 30), 5))).toBe('2026-02-04');
  });
});

describe('utils: text helpers', () => {
  it('splits an item description into separate goods', () => {
    expect(pecahBarang('Gula 1kg, Kopi ABC & Rokok')).toEqual(['Gula 1kg', 'Kopi ABC', 'Rokok']);
    expect(pecahBarang('Beras dan Minyak')).toEqual(['Beras', 'Minyak']);
    expect(pecahBarang('')).toEqual([]);
    expect(pecahBarang(null)).toEqual([]);
  });

  it('builds initials for avatars', () => {
    expect(initials('Budi Santoso')).toBe('BS');
    expect(initials('budi')).toBe('BU');
    expect(initials('')).toBe('?');
  });

  it('escapes HTML so printed reports cannot be broken by user input', () => {
    expect(escapeHtml('<b>"Tom" & \'Jerry\'</b>')).toBe('&lt;b&gt;&quot;Tom&quot; &amp; &#39;Jerry&#39;&lt;/b&gt;');
    expect(escapeHtml(null)).toBe('');
  });

  it('returns readable labels for payment methods and due-date options', () => {
    expect(labelMetode('qris')).toBe('QRIS');
    expect(labelMetode('transfer')).toBe('Transfer');
    expect(labelMetode(null)).toBe('Tunai');
    expect(labelTempo('gajian')).toBe('Tempo Akhir Bulan');
    expect(labelTempo(null)).toBe('Kasbon');
  });
});

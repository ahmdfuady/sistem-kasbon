import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  hitungStatusKasbon, hitungBarangFavorit, hitungPola,
} from '../features/dashboard/pelanggan/detail/analisisRiwayat';
import { infoStatus, monthKey, rb, PER_HALAMAN } from '../features/dashboard/laporan/helpers';
import { plafonFromValue, plafonToValue } from '../features/dashboard/pengaturan/plafon';
import { saldoBerjalan } from '../lib/analytics';
import { mkTrans } from './helpers';

// api/helpers.ts memakai klien Supabase. Di tes kita ganti dengan tiruan supaya
// tidak butuh internet, file .env.local, ataupun database sungguhan.
vi.mock('../lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn() } },
}));
import { supabase } from '../lib/supabase';
import { must, uid, num } from '../api/helpers';

const jam = (d: number, h = 10) => new Date(2026, 9, d, h, 0, 0).toISOString(); // Oktober 2026

describe('features: status of each credit (payments are applied oldest-first)', () => {
  it('uses payments to settle the oldest credit first, then the next one', () => {
    const status = hitungStatusKasbon([
      mkTrans({ id: 'k2', jenis: 'kasbon', nominal: 30000, created_at: jam(21) }),
      mkTrans({ id: 'k1', jenis: 'kasbon', nominal: 50000, created_at: jam(20) }), // sengaja tidak urut
      mkTrans({ id: 'b1', jenis: 'cicilan', nominal: 60000, created_at: jam(22) }),
    ]);
    expect(status.get('k1')).toEqual({ terbayar: 50000, sisa: 0 }); // lunas
    expect(status.get('k2')).toEqual({ terbayar: 10000, sisa: 20000 }); // sisa Rp 20.000
  });

  it('leaves every credit unpaid when there are no payments, and never goes negative', () => {
    const belumBayar = hitungStatusKasbon([mkTrans({ id: 'k1', nominal: 40000 })]);
    expect(belumBayar.get('k1')).toEqual({ terbayar: 0, sisa: 40000 });

    const kelebihan = hitungStatusKasbon([
      mkTrans({ id: 'k1', jenis: 'kasbon', nominal: 10000, created_at: jam(20) }),
      mkTrans({ id: 'b1', jenis: 'cicilan', nominal: 99000, created_at: jam(21) }),
    ]);
    expect(kelebihan.get('k1')).toEqual({ terbayar: 10000, sisa: 0 });
  });
});

describe('features: favourite items of one customer', () => {
  it('ranks items by frequency, capitalises names and splits the amount evenly', () => {
    const favorit = hitungBarangFavorit([
      mkTrans({ id: 'a', barang: 'gas 3kg, telur', nominal: 40000 }),
      mkTrans({ id: 'b', barang: 'Gas 3kg', nominal: 22000 }), // huruf besar/kecil dianggap sama
      mkTrans({ id: 'c', jenis: 'cicilan', barang: 'gas 3kg', nominal: 99999 }), // pembayaran diabaikan
    ]);
    expect(favorit[0]).toEqual({ nama: 'Gas 3kg', jumlah: 2, nominal: 20000 + 22000 });
    expect(favorit[1]).toEqual({ nama: 'Telur', jumlah: 1, nominal: 20000 });
  });

  it('returns at most 3 items', () => {
    const favorit = hitungBarangFavorit([
      mkTrans({ id: 'a', barang: 'gula, kopi, teh, susu, roti' }),
    ]);
    expect(favorit).toHaveLength(3);
  });
});

describe('features: payment pattern and mini chart', () => {
  it('explains when there is not enough payment data yet', () => {
    expect(hitungPola([], new Map()).teks).toMatch(/Belum cukup data/);
    const satu = [mkTrans({ id: 'b1', jenis: 'cicilan', created_at: jam(20) })];
    expect(hitungPola(satu, saldoBerjalan(satu)).teks).toMatch(/Baru membayar 1 kali/);
  });

  it('reports the average number of days between payments', () => {
    const trans = [
      mkTrans({ id: 'k1', jenis: 'kasbon', nominal: 90000, created_at: jam(1) }),
      mkTrans({ id: 'b1', jenis: 'cicilan', nominal: 30000, created_at: jam(5) }),
      mkTrans({ id: 'b2', jenis: 'cicilan', nominal: 30000, created_at: jam(11) }), // 6 hari setelah b1
    ];
    expect(hitungPola(trans, saldoBerjalan(trans)).teks).toBe('Rata-rata membayar setiap 6 hari sekali');
  });

  it('draws a flat line without enough points, and a real line otherwise', () => {
    const datar = hitungPola([mkTrans({ id: 'k1' })], new Map());
    expect(datar.path).toBe('M0 15 L100 15');

    const trans = [
      mkTrans({ id: 'k1', jenis: 'kasbon', nominal: 50000, created_at: jam(1) }),
      mkTrans({ id: 'b1', jenis: 'cicilan', nominal: 50000, created_at: jam(2) }),
    ];
    const pola = hitungPola(trans, saldoBerjalan(trans));
    expect(pola.path.startsWith('M')).toBe(true);
    expect(pola.path).toContain('L');
    expect(pola.last.x).toBeCloseTo(98, 0); // titik terakhir ada di ujung kanan grafik
  });
});

describe('features: report table labels', () => {
  const trans = [
    mkTrans({ id: 'k1', jenis: 'kasbon', nominal: 100000, tempo_option: '1minggu', created_at: jam(1) }),
    mkTrans({ id: 'b1', jenis: 'cicilan', nominal: 50000, metode_bayar: 'transfer', created_at: jam(2) }),
    mkTrans({ id: 'b2', jenis: 'cicilan', nominal: 50000, metode_bayar: 'qris', created_at: jam(3) }),
  ];
  const saldo = saldoBerjalan(trans);

  it('labels a credit with its due-date option', () => {
    expect(infoStatus(trans[0], saldo).teks).toBe('Tempo 1 Minggu');
  });

  it('labels a partial payment with its percentage of the debt', () => {
    expect(infoStatus(trans[1], saldo).teks).toBe('Cicilan 50%');
  });

  it('labels the payment that clears the debt as LUNAS with its method', () => {
    expect(infoStatus(trans[2], saldo).teks).toBe('Lunas QRIS');
  });

  it('formats chart axis labels and month keys', () => {
    expect(rb(150000)).toBe('150rb');
    expect(rb(500)).toBe('500');
    expect(monthKey(new Date(2026, 9, 5, 10).toISOString())).toBe('2026-10');
    expect(PER_HALAMAN).toBe(10);
  });
});

describe('features: default credit-limit cards in settings', () => {
  it('maps the stored amount to a card and falls back to Rp 200.000 for custom values', () => {
    expect(plafonFromValue(100000)).toBe('100');
    expect(plafonFromValue(500000)).toBe('500');
    expect(plafonFromValue(null)).toBe('unlimited');
    expect(plafonFromValue(undefined)).toBe('unlimited');
    expect(plafonFromValue(350000)).toBe('200');
  });

  it('maps each card back to the amount saved in the database (null = no limit)', () => {
    expect(plafonToValue('100')).toBe(100000);
    expect(plafonToValue('200')).toBe(200000);
    expect(plafonToValue('500')).toBe(500000);
    expect(plafonToValue('unlimited')).toBeNull();
  });
});

describe('api: error handling (Supabase is mocked)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the data when the database reports no error', () => {
    expect(must({ id: 1 }, null)).toEqual({ id: 1 });
  });

  it('rewrites the database limit error into a readable Indonesian message', () => {
    const dbError = { message: 'Kasbon melebihi batas pelanggan (batas Rp 200000, utang sekarang Rp 150000)' };
    expect(() => must(null, dbError)).toThrow(
      'Kasbon melebihi batas pelanggan (batas Rp 200.000, utang sekarang Rp 150.000).'
    );
  });

  it('passes other database errors through unchanged', () => {
    expect(() => must(null, { message: 'permission denied' })).toThrow('permission denied');
  });

  it('refuses to query data when nobody is logged in', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null } as never);
    await expect(uid()).rejects.toThrow('Sesi login berakhir');
  });

  it('returns the logged-in account id used to filter every query', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: 'akun-123' } } },
      error: null,
    } as never);
    await expect(uid()).resolves.toBe('akun-123');
  });

  it('converts database numbers (which can arrive as strings) safely', () => {
    expect(num('50000')).toBe(50000);
    expect(num(null)).toBe(0);
    expect(num(undefined)).toBe(0);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  saldoBerjalan, sum, totalPiutang, daftarTelat, daftarJatuhTempoHariIni, daftarPerluDitagih,
  persenLancar, topBarang, arusHarian, perubahanPiutangMingguan,
} from '../lib/analytics';
import { mkSaldo, mkTrans } from './helpers';

const jam = (d: number, h = 10) => new Date(2026, 9, d, h, 0, 0).toISOString(); // Oktober 2026

describe('analytics: running balance', () => {
  it('computes the balance before/after each transaction in time order', () => {
    const map = saldoBerjalan([
      mkTrans({ id: 'c', jenis: 'cicilan', nominal: 40000, created_at: jam(22) }), // sengaja tidak urut
      mkTrans({ id: 'a', jenis: 'kasbon', nominal: 50000, created_at: jam(20) }),
      mkTrans({ id: 'b', jenis: 'kasbon', nominal: 30000, created_at: jam(21) }),
    ]);
    expect(map.get('a')).toEqual({ sebelum: 0, sesudah: 50000 });
    expect(map.get('b')).toEqual({ sebelum: 50000, sesudah: 80000 });
    expect(map.get('c')).toEqual({ sebelum: 80000, sesudah: 40000 });
  });

  it('keeps each customer balance separate', () => {
    const map = saldoBerjalan([
      mkTrans({ id: 'a1', pelanggan_id: 'A', nominal: 10000, created_at: jam(20) }),
      mkTrans({ id: 'b1', pelanggan_id: 'B', nominal: 99000, created_at: jam(20) }),
      mkTrans({ id: 'a2', pelanggan_id: 'A', nominal: 5000, created_at: jam(21) }),
    ]);
    expect(map.get('a2')?.sesudah).toBe(15000);
    expect(map.get('b1')?.sesudah).toBe(99000);
  });
});

describe('analytics: totals and overdue lists', () => {
  it('sums credit and payments separately', () => {
    const t = [
      mkTrans({ id: '1', jenis: 'kasbon', nominal: 10000 }),
      mkTrans({ id: '2', jenis: 'kasbon', nominal: 5000 }),
      mkTrans({ id: '3', jenis: 'cicilan', nominal: 7000 }),
    ];
    expect(sum(t, 'kasbon')).toBe(15000);
    expect(sum(t, 'cicilan')).toBe(7000);
  });

  it('totals outstanding debt and ignores negative balances', () => {
    expect(totalPiutang([mkSaldo({ sisa_utang: 30000 }), mkSaldo({ sisa_utang: 30000 }), mkSaldo({ sisa_utang: -5000 })])).toBe(60000);
  });

  it('lists overdue customers, most days late first, excluding settled ones', () => {
    const telat = daftarTelat([
      mkSaldo({ pelanggan_id: 'a', sisa_utang: 1000, hari_telat: 2 }),
      mkSaldo({ pelanggan_id: 'b', sisa_utang: 1000, hari_telat: 9 }),
      mkSaldo({ pelanggan_id: 'c', sisa_utang: 0, hari_telat: 30 }), // sudah lunas
      mkSaldo({ pelanggan_id: 'd', sisa_utang: 1000, hari_telat: 0 }),
    ]);
    expect(telat.map((s) => s.pelanggan_id)).toEqual(['b', 'a']);
  });

  it('computes the on-time percentage (100 when nobody owes)', () => {
    expect(persenLancar([])).toBe(100);
    expect(persenLancar([mkSaldo({ sisa_utang: 0 })])).toBe(100);
    expect(persenLancar([
      mkSaldo({ sisa_utang: 1000, hari_telat: 0 }),
      mkSaldo({ sisa_utang: 1000, hari_telat: 3 }),
    ])).toBe(50);
  });
});

describe('analytics: time-based rules (fake clock: 22 Oct 2026, 12:00)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 22, 12, 0, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('finds customers whose debt is due exactly today', () => {
    const list = daftarJatuhTempoHariIni([
      mkSaldo({ pelanggan_id: 'a', sisa_utang: 5000, hari_telat: 0, jatuh_tempo_terakhir: '2026-10-22' }),
      mkSaldo({ pelanggan_id: 'b', sisa_utang: 5000, hari_telat: 0, jatuh_tempo_terakhir: '2026-10-23' }),
      mkSaldo({ pelanggan_id: 'c', sisa_utang: 0, hari_telat: 0, jatuh_tempo_terakhir: '2026-10-22' }),
    ]);
    expect(list.map((s) => s.pelanggan_id)).toEqual(['a']);
  });

  it('puts overdue customers before those due today in the collection list', () => {
    const list = daftarPerluDitagih([
      mkSaldo({ pelanggan_id: 'today', sisa_utang: 5000, hari_telat: 0, jatuh_tempo_terakhir: '2026-10-22' }),
      mkSaldo({ pelanggan_id: 'late', sisa_utang: 5000, hari_telat: 4, jatuh_tempo_terakhir: '2026-10-18' }),
    ]);
    expect(list.map((s) => s.pelanggan_id)).toEqual(['late', 'today']);
  });

  it('builds the 7-day cash flow with today as the last bar', () => {
    const arus = arusHarian([
      mkTrans({ id: '1', jenis: 'kasbon', nominal: 30000, created_at: jam(22) }),
      mkTrans({ id: '2', jenis: 'cicilan', nominal: 20000, created_at: jam(22, 15) }),
      mkTrans({ id: '3', jenis: 'kasbon', nominal: 10000, created_at: jam(16) }), // 6 hari lalu
      mkTrans({ id: '4', jenis: 'kasbon', nominal: 99999, created_at: jam(10) }), // di luar 7 hari
    ]);
    expect(arus).toHaveLength(7);
    expect(arus[0].key).toBe('2026-10-16');
    expect(arus[6]).toMatchObject({ key: '2026-10-22', isToday: true, kasbon: 30000, masuk: 20000 });
    expect(arus[0].kasbon).toBe(10000);
    expect(arus.reduce((a, r) => a + r.kasbon, 0)).toBe(40000); // 99999 tidak ikut
  });

  it('computes the weekly change in outstanding debt, or null without a baseline', () => {
    // piutang sekarang 60.000, minggu ini bertambah 30.000 -> minggu lalu 30.000 -> naik 100%
    expect(perubahanPiutangMingguan(
      [mkSaldo({ sisa_utang: 60000 })],
      [mkTrans({ jenis: 'kasbon', nominal: 30000, created_at: jam(21) })],
    )).toBe(100);
    // semua utang baru muncul minggu ini -> tidak ada pembanding
    expect(perubahanPiutangMingguan(
      [mkSaldo({ sisa_utang: 10000 })],
      [mkTrans({ jenis: 'kasbon', nominal: 10000, created_at: jam(21) })],
    )).toBeNull();
  });
});

describe('analytics: most frequently bought items', () => {
  it('counts items, splits the amount evenly, and ignores payments', () => {
    const hasil = topBarang([
      mkTrans({ id: '1', barang: 'Gula, Kopi', nominal: 20000 }),
      mkTrans({ id: '2', barang: 'gula', nominal: 10000 }),
      mkTrans({ id: '3', jenis: 'cicilan', barang: 'Kopi', nominal: 50000 }), // bukan kasbon
    ]);
    expect(hasil.totalJumlah).toBe(3);
    expect(hasil.items[0]).toEqual({ nama: 'Gula', jumlah: 2, nominal: 20000 }); // 10.000 + 10.000
    expect(hasil.items[1]).toEqual({ nama: 'Kopi', jumlah: 1, nominal: 10000 });
  });

  it('respects the limit and skips transactions without item text', () => {
    const t = ['A', 'B', 'C', 'D', 'E'].map((b, i) => mkTrans({ id: String(i), barang: b }));
    t.push(mkTrans({ id: 'x', barang: null }));
    expect(topBarang(t, 3).items).toHaveLength(3);
    expect(topBarang(t, 3).totalJumlah).toBe(5);
  });
});

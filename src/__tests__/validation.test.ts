import { describe, it, expect } from 'vitest';
import {
  validasiEmail, validasiSandi, validasiSandiBaru, validasiWhatsapp, validasiTeksWajib,
  validasiPelanggan, validasiProfilWarung, validasiFotoProfil, validasiTransaksi,
  MAKS_NOMINAL,
} from '../validation';

describe('validation: login & password', () => {
  it('accepts a normal email and trims spaces', () => {
    expect(validasiEmail('  budi@warung.id ')).toBeNull();
  });

  it('rejects an empty or malformed email', () => {
    expect(validasiEmail('')).toMatch(/wajib/i);
    expect(validasiEmail('budi@')).toMatch(/tidak valid/i);
    expect(validasiEmail('budi warung@mail.com')).toMatch(/tidak valid/i);
  });

  it('requires a password of at least 8 characters', () => {
    expect(validasiSandi('')).toMatch(/wajib/i);
    expect(validasiSandi('1234567')).toMatch(/minimal 8/i);
    expect(validasiSandi('12345678')).toBeNull();
  });

  it('rejects a new password whose confirmation does not match', () => {
    expect(validasiSandiBaru('rahasia123', 'rahasia124')).toMatch(/tidak cocok/i);
    expect(validasiSandiBaru('rahasia123', 'rahasia123')).toBeNull();
  });
});

describe('validation: contact fields', () => {
  it('treats an empty WhatsApp number as valid unless it is required', () => {
    expect(validasiWhatsapp('')).toBeNull();
    expect(validasiWhatsapp('', { wajib: true })).toMatch(/wajib/i);
  });

  it('accepts formatted numbers and enforces 9-15 digits', () => {
    expect(validasiWhatsapp('0812-3456 7890')).toBeNull();
    expect(validasiWhatsapp('0812')).toMatch(/9-15/);
    expect(validasiWhatsapp('1'.repeat(16))).toMatch(/9-15/);
  });

  it('rejects blank or too-long required text', () => {
    expect(validasiTeksWajib('   ', 'Nama')).toBe('Nama wajib diisi.');
    expect(validasiTeksWajib('a'.repeat(101), 'Nama')).toMatch(/maksimal 100/);
    expect(validasiTeksWajib('Budi', 'Nama')).toBeNull();
  });
});

describe('validation: customer, shop profile, photo', () => {
  it('validates a new customer (name, phone, credit limit)', () => {
    expect(validasiPelanggan({ nama: '', whatsapp: '', batasKasbon: null })).toMatch(/Nama pelanggan/);
    expect(validasiPelanggan({ nama: 'Budi', whatsapp: '12', batasKasbon: null })).toMatch(/WhatsApp/);
    expect(validasiPelanggan({ nama: 'Budi', whatsapp: '', batasKasbon: -1 })).toMatch(/Batas kasbon/);
    expect(validasiPelanggan({ nama: 'Budi', whatsapp: '081234567890', batasKasbon: 200000 })).toBeNull();
  });

  it('validates the shop profile in order: shop name, owner, phone', () => {
    expect(validasiProfilWarung({ namaWarung: '', namaPemilik: 'A', whatsapp: '' })).toMatch(/Nama warung/);
    expect(validasiProfilWarung({ namaWarung: 'W', namaPemilik: '', whatsapp: '' })).toMatch(/Nama pemilik/);
    expect(validasiProfilWarung({ namaWarung: 'W', namaPemilik: 'A', whatsapp: '081234567890' })).toBeNull();
  });

  it('only accepts image files up to 2 MB', () => {
    const file = (type: string, size: number) => ({ type, size } as File);
    expect(validasiFotoProfil(file('application/pdf', 100))).toMatch(/gambar/i);
    expect(validasiFotoProfil(file('image/png', 3 * 1024 * 1024))).toMatch(/2 MB/);
    expect(validasiFotoProfil(file('image/jpeg', 500 * 1024))).toBeNull();
  });
});

describe('validation: transaction rules (business logic)', () => {
  const base = {
    pelangganDipilih: true,
    jenis: 'kasbon' as const,
    nominal: 50000,
    utangSebelumnya: 0,
    batasKasbon: 200000 as number | null,
    terkunci: false,
    tempoOption: 'gajian' as const,
    kalenderDate: '',
  };

  it('requires a customer and a positive amount', () => {
    expect(validasiTransaksi({ ...base, pelangganDipilih: false })).toMatch(/pelanggan/i);
    expect(validasiTransaksi({ ...base, nominal: 0 })).toMatch(/Nominal/);
    expect(validasiTransaksi({ ...base, nominal: -5 })).toMatch(/Nominal/);
  });

  it('rejects an amount above the maximum', () => {
    expect(validasiTransaksi({ ...base, nominal: MAKS_NOMINAL + 1, batasKasbon: null })).toMatch(/terlalu besar/i);
  });

  it('blocks a new credit that would pass the customer limit', () => {
    expect(validasiTransaksi({ ...base, utangSebelumnya: 180000, nominal: 30000 })).toMatch(/melebihi batas/i);
    expect(validasiTransaksi({ ...base, utangSebelumnya: 150000, nominal: 50000 })).toBeNull(); // pas di batas
  });

  it('allows any amount when the customer has no limit', () => {
    expect(validasiTransaksi({ ...base, batasKasbon: null, nominal: 5_000_000 })).toBeNull();
  });

  it('blocks new credit for customers who are locked (overdue > 7 days)', () => {
    expect(validasiTransaksi({ ...base, terkunci: true })).toMatch(/ditangguhkan/i);
  });

  it('requires a date when the due date option is "calendar"', () => {
    expect(validasiTransaksi({ ...base, tempoOption: 'kalender', kalenderDate: '' })).toMatch(/tanggal jatuh tempo/i);
    expect(validasiTransaksi({ ...base, tempoOption: 'kalender', kalenderDate: '2026-11-01' })).toBeNull();
  });

  it('does not allow a payment bigger than the remaining debt', () => {
    expect(validasiTransaksi({ ...base, jenis: 'cicilan', utangSebelumnya: 40000, nominal: 50000 })).toMatch(/melebihi sisa utang/i);
    expect(validasiTransaksi({ ...base, jenis: 'cicilan', utangSebelumnya: 50000, nominal: 50000 })).toBeNull();
  });

  it('still lets a locked customer pay their debt', () => {
    expect(validasiTransaksi({ ...base, jenis: 'cicilan', terkunci: true, utangSebelumnya: 80000, nominal: 80000 })).toBeNull();
  });
});

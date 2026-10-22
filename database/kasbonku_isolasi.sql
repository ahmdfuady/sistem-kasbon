-- =====================================================================
-- KasbonKu - PERBAIKAN ISOLASI DATA ANTAR AKUN
-- Jalankan di Supabase -> SQL Editor -> New query -> Run
-- Aman dijalankan berulang kali. Tidak menghapus data apa pun.
--
-- Masalah: akun baru ikut melihat kasbon/pelanggan akun lain.
-- Penyebab umum: RLS dimatikan, ada policy "using (true)" yang bocor,
-- atau view v_saldo_pelanggan berjalan sebagai owner (melewati RLS).
-- =====================================================================

-- 1. Aktifkan RLS di semua tabel
alter table public.warung    enable row level security;
alter table public.pelanggan enable row level security;
alter table public.transaksi enable row level security;

-- 2. Hapus SEMUA policy lama di tiga tabel (termasuk yang terlalu longgar)
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('warung', 'pelanggan', 'transaksi')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- 3. Buat ulang policy yang benar: tiap akun hanya melihat datanya sendiri
create policy "warung: lihat milik sendiri" on public.warung
  for select to authenticated using (id = (select auth.uid()));

create policy "warung: buat milik sendiri" on public.warung
  for insert to authenticated with check (id = (select auth.uid()));

create policy "warung: ubah milik sendiri" on public.warung
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "pelanggan: akses milik sendiri" on public.pelanggan
  for all to authenticated
  using (warung_id = (select auth.uid()))
  with check (warung_id = (select auth.uid()));

create policy "transaksi: akses milik sendiri" on public.transaksi
  for all to authenticated
  using (warung_id = (select auth.uid()))
  with check (
    warung_id = (select auth.uid())
    and exists (
      select 1 from public.pelanggan p
      where p.id = pelanggan_id and p.warung_id = (select auth.uid())
    )
  );

-- 4. View saldo: security_invoker + filter warung di dalam view (sabuk pengaman ganda)
drop view if exists public.v_saldo_pelanggan;
create view public.v_saldo_pelanggan
with (security_invoker = true) as
select
  p.id                                   as pelanggan_id,
  p.warung_id,
  p.kode,
  p.nama,
  p.whatsapp,
  p.batas_kasbon,
  coalesce(sum(case when t.jenis = 'kasbon'  then t.nominal end), 0) as total_kasbon,
  coalesce(sum(case when t.jenis = 'cicilan' then t.nominal end), 0) as total_bayar,
  coalesce(sum(case when t.jenis = 'kasbon' then t.nominal else -t.nominal end), 0) as sisa_utang,
  max(t.jatuh_tempo) filter (where t.jenis = 'kasbon') as jatuh_tempo_terakhir,
  case
    when coalesce(sum(case when t.jenis = 'kasbon' then t.nominal else -t.nominal end), 0) > 0
     and max(t.jatuh_tempo) filter (where t.jenis = 'kasbon') < current_date
    then current_date - max(t.jatuh_tempo) filter (where t.jenis = 'kasbon')
    else 0
  end                                    as hari_telat
from public.pelanggan p
left join public.transaksi t on t.pelanggan_id = p.id
where p.warung_id = (select auth.uid())
group by p.id;

-- 5. Pengunjung tanpa login (anon) tidak boleh menyentuh data sama sekali
revoke all on public.warung, public.pelanggan, public.transaksi, public.v_saldo_pelanggan from anon;
grant select, insert, update, delete on public.warung, public.pelanggan, public.transaksi to authenticated;
grant select on public.v_saldo_pelanggan to authenticated;

-- 6. Pastikan warung_id otomatis terisi dengan akun yang sedang login
alter table public.pelanggan alter column warung_id set default auth.uid();
alter table public.transaksi alter column warung_id set default auth.uid();

-- =====================================================================
-- DIAGNOSA (opsional) - jalankan terpisah untuk melihat kondisi data:
--
--   -- RLS harus true untuk ketiga tabel:
--   select relname, relrowsecurity from pg_class
--   where relname in ('warung','pelanggan','transaksi');
--
--   -- Jumlah data per warung (tiap warung_id = 1 akun):
--   select warung_id, count(*) from public.pelanggan group by 1;
-- =====================================================================

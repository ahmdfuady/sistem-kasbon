-- =====================================================================
-- KasbonKu - skema database Supabase
-- Cara pakai: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- Aman dijalankan sekali di project baru (kosong).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABEL
-- ---------------------------------------------------------------------

-- Satu baris per akun warung (id sama dengan id user di Supabase Auth)
create table public.warung (
  id             uuid primary key references auth.users (id) on delete cascade,
  nama_pemilik   text not null default '',
  nama_warung    text not null default '',
  whatsapp       text,
  alamat         text,
  foto_url       text,
  catatan_struk  text,
  plafon_default numeric(12,0),                       -- null = tanpa batas
  kunci_kasbon   boolean not null default true,       -- kunci kasbon kalau telat > 7 hari
  template_wa    text not null default 'santun' check (template_wa in ('santun','formal')),
  created_at     timestamptz not null default now()
);

create sequence public.pelanggan_kode_seq start 1;

create table public.pelanggan (
  id              uuid primary key default gen_random_uuid(),
  warung_id       uuid not null default auth.uid() references public.warung (id) on delete cascade,
  kode            text not null default ('PLG-' || lpad(nextval('public.pelanggan_kode_seq')::text, 4, '0')),
  nama            text not null,
  whatsapp        text,
  alamat          text,
  catatan_pribadi text,
  batas_kasbon    numeric(12,0),                      -- null = tanpa batas
  created_at      timestamptz not null default now()
);

create table public.transaksi (
  id            uuid primary key default gen_random_uuid(),
  warung_id     uuid not null default auth.uid() references public.warung (id) on delete cascade,
  pelanggan_id  uuid not null references public.pelanggan (id) on delete cascade,
  jenis         text not null check (jenis in ('kasbon','cicilan')),
  nominal       numeric(12,0) not null check (nominal > 0),
  barang        text,
  catatan       text,
  tempo_option  text check (tempo_option in ('3hari','1minggu','gajian','kalender')),
  jatuh_tempo   date,                                 -- diisi untuk jenis 'kasbon'
  metode_bayar  text default 'tunai',                 -- untuk jenis 'cicilan'
  no_kwitansi   text,
  created_at    timestamptz not null default now()
);

create index on public.pelanggan (warung_id);
create index on public.transaksi (pelanggan_id);
create index on public.transaksi (warung_id, created_at desc);

-- ---------------------------------------------------------------------
-- 2. TRIGGER: otomatis bikin baris warung saat user daftar
--    Data diambil dari options.data di supabase.auth.signUp()
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.warung (id, nama_pemilik, nama_warung, whatsapp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama_pemilik', ''),
    coalesce(new.raw_user_meta_data ->> 'nama_warung', ''),
    new.raw_user_meta_data ->> 'whatsapp'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 3. TRIGGER: tolak kasbon kalau melewati batas pelanggan
-- ---------------------------------------------------------------------
create or replace function public.cek_batas_kasbon()
returns trigger
language plpgsql
as $$
declare
  v_batas numeric;
  v_saldo numeric;
begin
  if new.jenis <> 'kasbon' then
    return new;
  end if;

  select batas_kasbon into v_batas from public.pelanggan where id = new.pelanggan_id;
  if v_batas is null then
    return new;
  end if;

  select coalesce(sum(case when jenis = 'kasbon' then nominal else -nominal end), 0)
    into v_saldo
    from public.transaksi
   where pelanggan_id = new.pelanggan_id;

  if v_saldo + new.nominal > v_batas then
    raise exception 'Kasbon melebihi batas pelanggan (batas Rp %, utang sekarang Rp %)', v_batas, v_saldo;
  end if;

  return new;
end;
$$;

create trigger trg_cek_batas_kasbon
  before insert on public.transaksi
  for each row execute function public.cek_batas_kasbon();

-- ---------------------------------------------------------------------
-- 4. VIEW: saldo utang per pelanggan (dihitung, bukan disimpan manual)
--    security_invoker = true supaya RLS tetap berlaku
--    Catatan: jatuh tempo diambil dari kasbon terbaru (disederhanakan)
-- ---------------------------------------------------------------------
create or replace view public.v_saldo_pelanggan
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
group by p.id;

-- ---------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY: tiap warung hanya lihat datanya sendiri
-- ---------------------------------------------------------------------
alter table public.warung    enable row level security;
alter table public.pelanggan enable row level security;
alter table public.transaksi enable row level security;

create policy "warung: lihat milik sendiri" on public.warung
  for select to authenticated using (id = (select auth.uid()));

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

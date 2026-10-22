-- =====================================================================
-- KasbonKu - MIGRASI TAMBAHAN (jalankan SETELAH kasbonku_schema.sql)
-- Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- Aman dijalankan berulang kali.
-- =====================================================================

-- 1. Izinkan user membuat baris warung miliknya sendiri
--    (dipakai untuk akun lama yang dibuat sebelum trigger handle_new_user terpasang)
drop policy if exists "warung: buat milik sendiri" on public.warung;
create policy "warung: buat milik sendiri" on public.warung
  for insert to authenticated
  with check (id = (select auth.uid()));

-- 2. Isi baris warung untuk akun lama yang belum punya
insert into public.warung (id, nama_pemilik, nama_warung)
select u.id,
       coalesce(u.raw_user_meta_data ->> 'nama_pemilik', ''),
       coalesce(u.raw_user_meta_data ->> 'nama_warung', '')
from auth.users u
where u.id not in (select id from public.warung);

-- 3. Storage untuk foto profil warung (Pengaturan -> Foto Profil Warung)
insert into storage.buckets (id, name, public)
values ('warung-foto', 'warung-foto', true)
on conflict (id) do nothing;

drop policy if exists "warung-foto: baca publik" on storage.objects;
create policy "warung-foto: baca publik" on storage.objects
  for select using (bucket_id = 'warung-foto');

drop policy if exists "warung-foto: upload milik sendiri" on storage.objects;
create policy "warung-foto: upload milik sendiri" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'warung-foto' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "warung-foto: ubah milik sendiri" on storage.objects;
create policy "warung-foto: ubah milik sendiri" on storage.objects
  for update to authenticated
  using (bucket_id = 'warung-foto' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "warung-foto: hapus milik sendiri" on storage.objects;
create policy "warung-foto: hapus milik sendiri" on storage.objects
  for delete to authenticated
  using (bucket_id = 'warung-foto' and (storage.foldername(name))[1] = (select auth.uid())::text);

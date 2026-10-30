-- ============================================================
-- Fix Storage + Save issues
-- Paste into Supabase → SQL Editor → Run
-- ============================================================

-- 1. Make sure the media bucket exists and is public
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800, -- 50MB limit
  array['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/svg+xml','application/pdf','video/mp4','video/webm','application/zip','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 52428800;

-- 2. Drop old storage policies and recreate them cleanly
drop policy if exists "public_read_media" on storage.objects;
drop policy if exists "admin_upload_media" on storage.objects;
drop policy if exists "admin_delete_media" on storage.objects;
drop policy if exists "admin_update_media" on storage.objects;
drop policy if exists "authenticated_upload" on storage.objects;

-- 3. Anyone can read public media files
create policy "public_read_media"
on storage.objects for select
using (bucket_id = 'media');

-- 4. Any authenticated user can upload (we trust auth for admin uploads)
create policy "authenticated_upload_media"
on storage.objects for insert
with check (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
);

-- 5. Any authenticated user can update
create policy "authenticated_update_media"
on storage.objects for update
using (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
);

-- 6. Any authenticated user can delete
create policy "authenticated_delete_media"
on storage.objects for delete
using (
  bucket_id = 'media'
  and auth.role() = 'authenticated'
);

-- 7. Fix profile save — make sure updated_at auto-updates
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Re-create triggers for all tables that need updated_at
do $$ declare t text; begin
  for t in select unnest(array[
    'profile','experiences','education','skills','certifications',
    'achievements','projects','services','store_products','orders',
    'social_links','contact_messages','consultation_bookings',
    'site_settings','cv_settings'
  ]) loop
    execute format('
      drop trigger if exists set_updated_at on %I;
      create trigger set_updated_at before update on %I
      for each row execute function set_updated_at();
    ', t, t);
  end loop;
end $$;

-- 8. Make sure profile row exists
insert into profile (full_name, professional_title)
values ('Albert Prah', 'Full Stack Developer & Python Programmer')
on conflict do nothing;

select 'Storage and save fixes applied successfully!' as result;

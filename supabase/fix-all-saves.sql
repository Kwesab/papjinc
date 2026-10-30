-- ============================================================
-- Fix ALL admin save issues
-- Paste into Supabase → SQL Editor → Run
-- ============================================================

-- 1. Drop all existing RLS policies and recreate them properly
-- This ensures authenticated users (admins) can write to all tables

-- ── profile ──────────────────────────────────────────────────
drop policy if exists "public_read" on profile;
drop policy if exists "admin_all" on profile;
create policy "public_read" on profile for select using (true);
create policy "admin_write" on profile for all using (auth.role() = 'authenticated');

-- ── experiences ───────────────────────────────────────────────
drop policy if exists "public_read" on experiences;
drop policy if exists "admin_all" on experiences;
create policy "public_read" on experiences for select using (true);
create policy "admin_write" on experiences for all using (auth.role() = 'authenticated');

-- ── education ─────────────────────────────────────────────────
drop policy if exists "public_read" on education;
drop policy if exists "admin_all" on education;
create policy "public_read" on education for select using (true);
create policy "admin_write" on education for all using (auth.role() = 'authenticated');

-- ── skills ────────────────────────────────────────────────────
drop policy if exists "public_read" on skills;
drop policy if exists "admin_all" on skills;
create policy "public_read" on skills for select using (true);
create policy "admin_write" on skills for all using (auth.role() = 'authenticated');

-- ── certifications ────────────────────────────────────────────
drop policy if exists "public_read" on certifications;
drop policy if exists "admin_all" on certifications;
create policy "public_read" on certifications for select using (true);
create policy "admin_write" on certifications for all using (auth.role() = 'authenticated');

-- ── achievements ──────────────────────────────────────────────
drop policy if exists "public_read" on achievements;
drop policy if exists "admin_all" on achievements;
create policy "public_read" on achievements for select using (true);
create policy "admin_write" on achievements for all using (auth.role() = 'authenticated');

-- ── projects ──────────────────────────────────────────────────
drop policy if exists "public_read" on projects;
drop policy if exists "admin_all" on projects;
create policy "public_read" on projects for select using (true);
create policy "admin_write" on projects for all using (auth.role() = 'authenticated');

-- ── project_media ─────────────────────────────────────────────
drop policy if exists "public_read" on project_media;
drop policy if exists "admin_all" on project_media;
create policy "public_read" on project_media for select using (true);
create policy "admin_write" on project_media for all using (auth.role() = 'authenticated');

-- ── services ──────────────────────────────────────────────────
drop policy if exists "public_read" on services;
drop policy if exists "admin_all" on services;
create policy "public_read" on services for select using (true);
create policy "admin_write" on services for all using (auth.role() = 'authenticated');

-- ── store_products ────────────────────────────────────────────
drop policy if exists "public_read" on store_products;
drop policy if exists "admin_all" on store_products;
create policy "public_read" on store_products for select using (true);
create policy "admin_write" on store_products for all using (auth.role() = 'authenticated');

-- ── orders ────────────────────────────────────────────────────
drop policy if exists "admin_all" on orders;
create policy "admin_write" on orders for all using (auth.role() = 'authenticated');

-- ── product_files ─────────────────────────────────────────────
drop policy if exists "admin_all" on product_files;
create policy "admin_write" on product_files for all using (auth.role() = 'authenticated');

-- ── download_entitlements ─────────────────────────────────────
drop policy if exists "admin_all" on download_entitlements;
create policy "admin_write" on download_entitlements for all using (auth.role() = 'authenticated');

-- ── social_links ──────────────────────────────────────────────
drop policy if exists "public_read" on social_links;
drop policy if exists "admin_all" on social_links;
create policy "public_read" on social_links for select using (true);
create policy "admin_write" on social_links for all using (auth.role() = 'authenticated');

-- ── contact_messages ──────────────────────────────────────────
drop policy if exists "public_insert" on contact_messages;
drop policy if exists "admin_all" on contact_messages;
create policy "public_insert" on contact_messages for insert with check (true);
create policy "admin_write" on contact_messages for all using (auth.role() = 'authenticated');

-- ── consultation_bookings ─────────────────────────────────────
drop policy if exists "public_insert" on consultation_bookings;
drop policy if exists "admin_all" on consultation_bookings;
create policy "public_insert" on consultation_bookings for insert with check (true);
create policy "admin_write" on consultation_bookings for all using (auth.role() = 'authenticated');

-- ── availability ──────────────────────────────────────────────
drop policy if exists "public_read" on availability;
drop policy if exists "admin_all" on availability;
create policy "public_read" on availability for select using (true);
create policy "admin_write" on availability for all using (auth.role() = 'authenticated');

-- ── blackout_dates ────────────────────────────────────────────
drop policy if exists "public_read" on blackout_dates;
drop policy if exists "admin_all" on blackout_dates;
create policy "public_read" on blackout_dates for select using (true);
create policy "admin_write" on blackout_dates for all using (auth.role() = 'authenticated');

-- ── site_settings ─────────────────────────────────────────────
drop policy if exists "public_read" on site_settings;
drop policy if exists "admin_all" on site_settings;
create policy "public_read" on site_settings for select using (is_public = true);
create policy "admin_write" on site_settings for all using (auth.role() = 'authenticated');

-- ── media ─────────────────────────────────────────────────────
drop policy if exists "admin_all" on media;
create policy "admin_write" on media for all using (auth.role() = 'authenticated');

-- ── cv_settings ───────────────────────────────────────────────
drop policy if exists "public_read" on cv_settings;
drop policy if exists "admin_all" on cv_settings;
create policy "public_read" on cv_settings for select using (true);
create policy "admin_write" on cv_settings for all using (auth.role() = 'authenticated');

-- ── analytics_events ──────────────────────────────────────────
drop policy if exists "public_read" on analytics_events;
drop policy if exists "public_insert" on analytics_events;
create policy "public_insert" on analytics_events for insert with check (true);
create policy "public_read" on analytics_events for select using (true);
create policy "admin_write" on analytics_events for all using (auth.role() = 'authenticated');

-- ── ai_activity_log ───────────────────────────────────────────
drop policy if exists "admin_all" on ai_activity_log;
create policy "admin_write" on ai_activity_log for all using (auth.role() = 'authenticated');

-- ── user_roles ────────────────────────────────────────────────
drop policy if exists "own_role_read" on user_roles;
drop policy if exists "admin_all" on user_roles;
create policy "own_role_read" on user_roles for select using (user_id = auth.uid());
create policy "admin_write" on user_roles for all using (auth.role() = 'authenticated');

-- 2. Storage policies
drop policy if exists "public_read_media" on storage.objects;
drop policy if exists "admin_upload_media" on storage.objects;
drop policy if exists "admin_delete_media" on storage.objects;
drop policy if exists "authenticated_upload_media" on storage.objects;
drop policy if exists "authenticated_update_media" on storage.objects;
drop policy if exists "authenticated_delete_media" on storage.objects;

create policy "public_read_media" on storage.objects
  for select using (bucket_id = 'media');

create policy "authenticated_upload_media" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "authenticated_update_media" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "authenticated_delete_media" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- 3. Make sure media bucket exists and is public
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

-- 4. Make sure profile row exists
insert into profile (full_name, professional_title)
values ('Albert Prah', 'Full Stack Developer & Python Programmer')
on conflict do nothing;

select 'All save policies fixed!' as result;

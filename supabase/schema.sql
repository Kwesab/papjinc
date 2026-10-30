-- ============================================================
-- Albert Prah Portfolio — Full Database Schema
-- Paste this into Supabase → SQL Editor → Run
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────
create type app_role as enum ('admin', 'user');

-- ── Tables ───────────────────────────────────────────────────

create table if not exists profile (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  full_name text,
  display_name text,
  professional_title text,
  short_bio text,
  biography text,
  professional_journey text,
  professional_summary text,
  hero_headline text,
  hero_description text,
  current_focus text,
  career_goals text,
  location text,
  email text,
  phone text,
  website text,
  availability_status text,
  profile_image_url text
);

create table if not exists experiences (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  job_title text not null,
  organization text not null,
  employment_type text,
  location text,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  responsibilities text[] default '{}',
  achievements text[] default '{}',
  technologies text[] default '{}',
  sort_order integer default 0
);

create table if not exists education (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  institution text not null,
  degree text,
  program text,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  certificate_url text,
  logo_url text,
  featured boolean default false,
  sort_order integer default 0
);

create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  category text not null,
  proficiency text,
  years_experience integer,
  featured boolean default false,
  icon text,
  sort_order integer default 0
);

create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  issuing_organization text,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  image_url text,
  pdf_url text,
  description text,
  category text,
  featured boolean default false,
  sort_order integer default 0
);

create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  organization text,
  date date,
  description text,
  image_url text,
  link text,
  category text,
  sort_order integer default 0
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  slug text not null unique,
  category text,
  short_description text,
  full_description text,
  problem text,
  solution text,
  architecture text,
  challenges text,
  results text,
  lessons_learned text,
  features text[] default '{}',
  technologies text[] default '{}',
  thumbnail_url text,
  live_url text,
  github_url text,
  documentation_url text,
  published boolean default false,
  featured boolean default false,
  sort_order integer default 0
);

create table if not exists project_media (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  project_id uuid references projects(id) on delete cascade,
  media_type text,
  url text,
  caption text
);

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  short_description text,
  full_description text,
  features text[] default '{}',
  starting_price numeric,
  currency text default 'USD',
  is_active boolean default true,
  icon text,
  sort_order integer default 0
);

create table if not exists store_products (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  price numeric not null default 0,
  currency text default 'USD',
  thumbnail_url text,
  gallery text[] default '{}',
  technologies text[] default '{}',
  features text[] default '{}',
  requirements text[] default '{}',
  documentation text,
  demo_url text,
  github_url text,
  version text,
  license_type text,
  license_terms text,
  published boolean default false,
  featured boolean default false
);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  product_id uuid references store_products(id),
  customer_name text,
  customer_email text,
  amount numeric,
  currency text,
  payment_status text default 'pending',
  order_status text default 'pending'
);

create table if not exists product_files (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  product_id uuid references store_products(id) on delete cascade,
  storage_path text
);

create table if not exists download_entitlements (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  order_id uuid references orders(id),
  product_id uuid references store_products(id),
  token text unique,
  max_downloads integer default 3,
  download_count integer default 0,
  expires_at timestamptz
);

create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  platform text not null,
  url text not null,
  is_active boolean default true,
  icon text,
  sort_order integer default 0
);

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text default 'unread'
);

create table if not exists consultation_bookings (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  full_name text not null,
  email text not null,
  phone text,
  project_name text,
  description text,
  additional_notes text,
  admin_notes text,
  preferred_date date,
  preferred_time text,
  consultation_type text,
  service_id uuid references services(id),
  status text default 'pending'
);

create table if not exists availability (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  day_of_week integer not null,
  start_time time default '09:00',
  end_time time default '17:00',
  slot_minutes integer default 60,
  is_active boolean default true
);

create table if not exists blackout_dates (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  date date not null,
  reason text
);

create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  key text not null unique,
  value jsonb,
  is_public boolean default true
);

create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  file_path text,
  url text,
  media_type text,
  size integer,
  original_name text
);

create table if not exists cv_settings (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  template text default 'default',
  included_experience_ids uuid[] default '{}',
  included_skill_ids uuid[] default '{}',
  included_project_ids uuid[] default '{}',
  is_default boolean default false,
  is_published boolean default false,
  download_count integer default 0
);

create table if not exists analytics_events (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  event_type text not null,
  entity_type text,
  entity_id text,
  path text
);

create table if not exists ai_activity_log (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  action text not null,
  actor text,
  entity_type text,
  entity_id text,
  suggested_value jsonb,
  previous_value jsonb,
  status text default 'generated'
);

create table if not exists user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  unique(user_id, role)
);

-- ── Functions ─────────────────────────────────────────────────

create or replace function is_admin()
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from user_roles
    where user_id = auth.uid()
    and role = 'admin'
  );
end;
$$;

create or replace function admin_exists()
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from user_roles where role = 'admin'
  );
end;
$$;

create or replace function claim_admin()
returns boolean
language plpgsql
security definer
as $$
begin
  if not admin_exists() then
    insert into user_roles (user_id, role)
    values (auth.uid(), 'admin')
    on conflict do nothing;
    return true;
  end if;
  if is_admin() then
    return true;
  end if;
  return false;
end;
$$;

create or replace function has_role(_role app_role, _user_id uuid default null)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from user_roles
    where user_id = coalesce(_user_id, auth.uid())
    and role = _role
  );
end;
$$;

-- ── updated_at triggers ───────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

-- ── Storage bucket ─────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ── Row Level Security ─────────────────────────────────────────

-- Enable RLS on all tables
alter table profile enable row level security;
alter table experiences enable row level security;
alter table education enable row level security;
alter table skills enable row level security;
alter table certifications enable row level security;
alter table achievements enable row level security;
alter table projects enable row level security;
alter table project_media enable row level security;
alter table services enable row level security;
alter table store_products enable row level security;
alter table orders enable row level security;
alter table product_files enable row level security;
alter table download_entitlements enable row level security;
alter table social_links enable row level security;
alter table contact_messages enable row level security;
alter table consultation_bookings enable row level security;
alter table availability enable row level security;
alter table blackout_dates enable row level security;
alter table site_settings enable row level security;
alter table media enable row level security;
alter table cv_settings enable row level security;
alter table analytics_events enable row level security;
alter table ai_activity_log enable row level security;
alter table user_roles enable row level security;

-- Public read policies (portfolio content visible to everyone)
create policy "public_read" on profile for select using (true);
create policy "public_read" on experiences for select using (true);
create policy "public_read" on education for select using (true);
create policy "public_read" on skills for select using (true);
create policy "public_read" on certifications for select using (true);
create policy "public_read" on achievements for select using (true);
create policy "public_read" on projects for select using (true);
create policy "public_read" on project_media for select using (true);
create policy "public_read" on services for select using (true);
create policy "public_read" on store_products for select using (true);
create policy "public_read" on social_links for select using (true);
create policy "public_read" on availability for select using (true);
create policy "public_read" on blackout_dates for select using (true);
create policy "public_read" on site_settings for select using (is_public = true);
create policy "public_read" on cv_settings for select using (true);
create policy "public_read" on analytics_events for select using (true);

-- Public insert policies (contact form, analytics, bookings)
create policy "public_insert" on contact_messages for insert with check (true);
create policy "public_insert" on consultation_bookings for insert with check (true);
create policy "public_insert" on analytics_events for insert with check (true);

-- Admin full access policies
create policy "admin_all" on profile for all using (is_admin());
create policy "admin_all" on experiences for all using (is_admin());
create policy "admin_all" on education for all using (is_admin());
create policy "admin_all" on skills for all using (is_admin());
create policy "admin_all" on certifications for all using (is_admin());
create policy "admin_all" on achievements for all using (is_admin());
create policy "admin_all" on projects for all using (is_admin());
create policy "admin_all" on project_media for all using (is_admin());
create policy "admin_all" on services for all using (is_admin());
create policy "admin_all" on store_products for all using (is_admin());
create policy "admin_all" on orders for all using (is_admin());
create policy "admin_all" on product_files for all using (is_admin());
create policy "admin_all" on download_entitlements for all using (is_admin());
create policy "admin_all" on social_links for all using (is_admin());
create policy "admin_all" on contact_messages for all using (is_admin());
create policy "admin_all" on consultation_bookings for all using (is_admin());
create policy "admin_all" on availability for all using (is_admin());
create policy "admin_all" on blackout_dates for all using (is_admin());
create policy "admin_all" on site_settings for all using (is_admin());
create policy "admin_all" on media for all using (is_admin());
create policy "admin_all" on cv_settings for all using (is_admin());
create policy "admin_all" on ai_activity_log for all using (is_admin());
create policy "admin_all" on user_roles for all using (is_admin());

-- User roles: users can read their own role
create policy "own_role_read" on user_roles for select using (user_id = auth.uid());

-- Storage policies
create policy "public_read_media" on storage.objects for select using (bucket_id = 'media');
create policy "admin_upload_media" on storage.objects for insert with check (bucket_id = 'media' and is_admin());
create policy "admin_delete_media" on storage.objects for delete using (bucket_id = 'media' and is_admin());

-- Insert a blank profile row so the site has something to update
insert into profile (id, full_name, professional_title)
values (uuid_generate_v4(), 'Albert Prah', 'Full Stack Developer & Python Programmer')
on conflict do nothing;

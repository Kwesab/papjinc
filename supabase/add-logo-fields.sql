-- ============================================================
-- Add company_logo_url and favicon_url to profile table
-- Run in Supabase → SQL Editor
-- ============================================================

ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS company_logo_url text,
  ADD COLUMN IF NOT EXISTS favicon_url      text;

-- Reload PostgREST schema cache so the new columns are visible immediately
NOTIFY pgrst, 'reload schema';

SELECT 'Logo fields added!' as result;

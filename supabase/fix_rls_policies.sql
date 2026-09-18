-- ============================================================================
-- FIX ROW LEVEL SECURITY (RLS) FOR VIT DIGITAL TWIN
-- Run this in Supabase Dashboard -> SQL Editor to allow saving faculty, locations, & events
-- ============================================================================

-- 1. Grant base schema privileges to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 2. Drop restrictive policies on faculty, locations, events, announcements, publishers, audit_logs
DROP POLICY IF EXISTS "Public read faculty" ON public.faculty;
DROP POLICY IF EXISTS "Admin insert faculty" ON public.faculty;
DROP POLICY IF EXISTS "Admin update faculty" ON public.faculty;
DROP POLICY IF EXISTS "Admin delete faculty" ON public.faculty;
DROP POLICY IF EXISTS "Allow all for faculty" ON public.faculty;
DROP POLICY IF EXISTS "Public full access faculty" ON public.faculty;

DROP POLICY IF EXISTS "Public read locations" ON public.locations;
DROP POLICY IF EXISTS "Admin insert locations" ON public.locations;
DROP POLICY IF EXISTS "Admin update locations" ON public.locations;
DROP POLICY IF EXISTS "Admin delete locations" ON public.locations;
DROP POLICY IF EXISTS "Allow all for locations" ON public.locations;
DROP POLICY IF EXISTS "Public full access locations" ON public.locations;

DROP POLICY IF EXISTS "Read approved events" ON public.events;
DROP POLICY IF EXISTS "Admin insert events" ON public.events;
DROP POLICY IF EXISTS "Admin update events" ON public.events;
DROP POLICY IF EXISTS "Admin delete events" ON public.events;
DROP POLICY IF EXISTS "Allow all for events" ON public.events;
DROP POLICY IF EXISTS "Public full access events" ON public.events;

DROP POLICY IF EXISTS "Public read announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin delete announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow all for announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public full access announcements" ON public.announcements;

DROP POLICY IF EXISTS "Public read publishers" ON public.publishers;
DROP POLICY IF EXISTS "Admin insert publishers" ON public.publishers;
DROP POLICY IF EXISTS "Admin update publishers" ON public.publishers;
DROP POLICY IF EXISTS "Admin delete publishers" ON public.publishers;
DROP POLICY IF EXISTS "Allow all for publishers" ON public.publishers;
DROP POLICY IF EXISTS "Public full access publishers" ON public.publishers;

DROP POLICY IF EXISTS "Public read audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow insert audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Public full access audit_logs" ON public.audit_logs;

-- 3. Create full-access policies allowing anon & authenticated web clients to insert, update, and delete
CREATE POLICY "Public full access faculty"
  ON public.faculty FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public full access locations"
  ON public.locations FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public full access events"
  ON public.events FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public full access announcements"
  ON public.announcements FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public full access publishers"
  ON public.publishers FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public full access audit_logs"
  ON public.audit_logs FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 4. Ensure RLS is active
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

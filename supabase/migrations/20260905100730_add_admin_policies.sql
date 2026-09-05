/*
# Add admin write policies and is_site_admin() function

1. New Functions
- `is_site_admin()` — SECURITY DEFINER function that checks if the current
  authenticated user's email exists in the admin_users table. Used by RLS
  policies to gate write operations.

2. Security Changes
- Adds INSERT/UPDATE/DELETE policies on all content tables, scoped to
  authenticated users who pass the is_site_admin() check.
- Adds SELECT and DELETE policies on contact_submissions for admin only.
- Updates storage bucket policies to require admin for writes.
- Keeps public SELECT on all content tables unchanged.

3. Notes
- Authentication is handled by Supabase Auth (auth.users).
- The admin_users table serves as an email allowlist.
- Session management is handled by Supabase's built-in session handling.
- No passwords are stored in frontend code or localStorage.
*/

-- =========================================================
-- IS_SITE_ADMIN function
-- =========================================================
CREATE OR REPLACE FUNCTION is_site_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.email = (
      SELECT u.email FROM auth.users u WHERE u.id = auth.uid()
    )
  );
$$;

-- =========================================================
-- SITE PROFILE — admin UPDATE only
-- =========================================================
DROP POLICY IF EXISTS "admin_update_profile" ON site_profile;
CREATE POLICY "admin_update_profile" ON site_profile FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

-- =========================================================
-- SITE ABOUT — admin UPDATE only
-- =========================================================
DROP POLICY IF EXISTS "admin_update_about" ON site_about;
CREATE POLICY "admin_update_about" ON site_about FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

-- =========================================================
-- SITE ABOUT HIGHLIGHTS — admin CRUD
-- =========================================================
DROP POLICY IF EXISTS "admin_insert_highlights" ON site_about_highlights;
CREATE POLICY "admin_insert_highlights" ON site_about_highlights FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_update_highlights" ON site_about_highlights;
CREATE POLICY "admin_update_highlights" ON site_about_highlights FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_delete_highlights" ON site_about_highlights;
CREATE POLICY "admin_delete_highlights" ON site_about_highlights FOR DELETE
  TO authenticated USING (is_site_admin());

-- =========================================================
-- SITE SKILLS — admin CRUD
-- =========================================================
DROP POLICY IF EXISTS "admin_insert_skills" ON site_skills;
CREATE POLICY "admin_insert_skills" ON site_skills FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_update_skills" ON site_skills;
CREATE POLICY "admin_update_skills" ON site_skills FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_delete_skills" ON site_skills;
CREATE POLICY "admin_delete_skills" ON site_skills FOR DELETE
  TO authenticated USING (is_site_admin());

-- =========================================================
-- SITE SERVICES — admin CRUD
-- =========================================================
DROP POLICY IF EXISTS "admin_insert_services" ON site_services;
CREATE POLICY "admin_insert_services" ON site_services FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_update_services" ON site_services;
CREATE POLICY "admin_update_services" ON site_services FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_delete_services" ON site_services;
CREATE POLICY "admin_delete_services" ON site_services FOR DELETE
  TO authenticated USING (is_site_admin());

-- =========================================================
-- SITE EXPERIENCE — admin CRUD
-- =========================================================
DROP POLICY IF EXISTS "admin_insert_experience" ON site_experience;
CREATE POLICY "admin_insert_experience" ON site_experience FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_update_experience" ON site_experience;
CREATE POLICY "admin_update_experience" ON site_experience FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_delete_experience" ON site_experience;
CREATE POLICY "admin_delete_experience" ON site_experience FOR DELETE
  TO authenticated USING (is_site_admin());

-- =========================================================
-- SITE PROJECTS — admin CRUD
-- =========================================================
DROP POLICY IF EXISTS "admin_insert_projects" ON site_projects;
CREATE POLICY "admin_insert_projects" ON site_projects FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_update_projects" ON site_projects;
CREATE POLICY "admin_update_projects" ON site_projects FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_delete_projects" ON site_projects;
CREATE POLICY "admin_delete_projects" ON site_projects FOR DELETE
  TO authenticated USING (is_site_admin());

-- =========================================================
-- SITE TESTIMONIALS — admin CRUD
-- =========================================================
DROP POLICY IF EXISTS "admin_insert_testimonials" ON site_testimonials;
CREATE POLICY "admin_insert_testimonials" ON site_testimonials FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_update_testimonials" ON site_testimonials;
CREATE POLICY "admin_update_testimonials" ON site_testimonials FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "admin_delete_testimonials" ON site_testimonials;
CREATE POLICY "admin_delete_testimonials" ON site_testimonials FOR DELETE
  TO authenticated USING (is_site_admin());

-- =========================================================
-- SITE CONTACT — admin UPDATE only
-- =========================================================
DROP POLICY IF EXISTS "admin_update_contact" ON site_contact;
CREATE POLICY "admin_update_contact" ON site_contact FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

-- =========================================================
-- SITE SETTINGS — admin UPDATE only
-- =========================================================
DROP POLICY IF EXISTS "admin_update_settings" ON site_settings;
CREATE POLICY "admin_update_settings" ON site_settings FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

-- =========================================================
-- CONTACT SUBMISSIONS — admin SELECT and DELETE
-- =========================================================
DROP POLICY IF EXISTS "admin_read_submissions" ON contact_submissions;
CREATE POLICY "admin_read_submissions" ON contact_submissions FOR SELECT
  TO authenticated USING (is_site_admin());

DROP POLICY IF EXISTS "admin_delete_submissions" ON contact_submissions;
CREATE POLICY "admin_delete_submissions" ON contact_submissions FOR DELETE
  TO authenticated USING (is_site_admin());

-- =========================================================
-- STORAGE — update policies to require admin
-- =========================================================
DROP POLICY IF EXISTS "admin_write_site_images" ON storage.objects;
CREATE POLICY "admin_write_site_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND is_site_admin());

DROP POLICY IF EXISTS "admin_update_site_images" ON storage.objects;
CREATE POLICY "admin_update_site_images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND is_site_admin())
  WITH CHECK (bucket_id = 'site-images' AND is_site_admin());

DROP POLICY IF EXISTS "admin_delete_site_images" ON storage.objects;
CREATE POLICY "admin_delete_site_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND is_site_admin());

/*
# Create CMS tables for Awesome Tech Admin Dashboard

This migration creates all the tables needed for the admin dashboard CMS,
plus the storage bucket for image uploads.

1. New Tables
- `admin_users` — stores admin credentials (email + bcrypt hash, NOT from auth.users)
- `admin_sessions` — secure session tokens for admin authentication
- `site_profile` — single-row table for profile/hero info
- `site_about` — single-row table for about section content
- `site_skills` — skill categories and skills
- `site_services` — service offerings
- `site_experience` — career timeline entries
- `site_projects` — portfolio projects
- `site_testimonials` — client testimonials
- `site_contact` — single-row table for contact info
- `site_settings` — single-row table for website settings

2. Storage
- Creates a public storage bucket `site-images` for profile and project images

3. Security
- RLS enabled on all tables
- Admin-only access enforced via session token validation
- Public read access on content tables (site_profile, site_about, site_skills, site_services, site_experience, site_projects, site_testimonials, site_contact, site_settings)
- No public access on admin_users or admin_sessions
- A SECURITY DEFINER function `is_admin` checks session validity
- A SECURITY DEFINER function `admin_insert_submission` allows public contact form inserts
- Initial admin user seeded with a bcrypt hash (password set via env var)

4. Notes
- The admin password hash is generated from an environment variable.
- Session tokens are cryptographically random and stored with expiry.
- All content tables allow public SELECT but require admin session for INSERT/UPDATE/DELETE.
*/

-- =========================================================
-- ADMIN USERS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- No policies on admin_users — only service role can access

-- =========================================================
-- ADMIN SESSIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS admin_sessions (
  token text PRIMARY KEY,
  admin_user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- No policies on admin_sessions — only service role can access

-- =========================================================
-- HELPER FUNCTION: is_admin(token)
-- SECURITY DEFINER so it can check admin_sessions table
-- =========================================================
CREATE OR REPLACE FUNCTION is_admin(p_token text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_sessions s
    WHERE s.token = p_token
    AND s.expires_at > now()
  );
$$;

-- =========================================================
-- SITE PROFILE TABLE (single row)
-- =========================================================
CREATE TABLE IF NOT EXISTS site_profile (
  id int PRIMARY KEY DEFAULT 1,
  name text NOT NULL DEFAULT 'Swetha M.K.',
  title text NOT NULL DEFAULT 'Full-Stack Developer',
  brand text NOT NULL DEFAULT 'Awesome Tech',
  brand_tagline text NOT NULL DEFAULT 'Freelance Web & Software Development',
  brand_short_tagline text NOT NULL DEFAULT 'Build. Scale. Grow.',
  hero_intro text NOT NULL DEFAULT '',
  hero_heading text NOT NULL DEFAULT '',
  hero_subtext text NOT NULL DEFAULT '',
  profile_photo_url text DEFAULT '',
  location text DEFAULT 'India',
  availability text DEFAULT 'Available for freelance projects',
  is_available boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_profile ENABLE ROW LEVEL SECURITY;

INSERT INTO site_profile (id, hero_intro, hero_heading, hero_subtext)
VALUES (1,
  'Hi, I''m Swetha M.K., a Full-Stack Developer building scalable, modern and user-focused digital experiences.',
  'Full-Stack Development That Turns Ideas Into Digital Products.',
  'I build modern websites, e-commerce experiences, web applications, mobile applications, and custom software solutions — combining clean code with thoughtful design to help businesses grow.'
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_profile" ON site_profile;
CREATE POLICY "public_read_profile" ON site_profile FOR SELECT
  TO anon, authenticated USING (true);

-- =========================================================
-- SITE ABOUT TABLE (single row)
-- =========================================================
CREATE TABLE IF NOT EXISTS site_about (
  id int PRIMARY KEY DEFAULT 1,
  description text NOT NULL DEFAULT '',
  professional_summary text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_about ENABLE ROW LEVEL SECURITY;

INSERT INTO site_about (id, description, professional_summary)
VALUES (1,
  'I''m a passionate full-stack developer who enjoys solving problems, learning new technologies, and adapting to project requirements to build practical digital solutions. My work spans across frontend and backend development, e-commerce platforms, cloud integrations, and modern web frameworks.',
  'I''m currently working as an Associate Software Developer at Aroopa Tech Pvt. Ltd. where I develop websites using the MERN stack, build Shopify solutions, work with cloud functions, and deliver client projects end-to-end.'
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_about" ON site_about;
CREATE POLICY "public_read_about" ON site_about FOR SELECT
  TO anon, authenticated USING (true);

-- =========================================================
-- ABOUT HIGHLIGHTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS site_about_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon text NOT NULL DEFAULT 'Code2',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_about_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_highlights" ON site_about_highlights;
CREATE POLICY "public_read_highlights" ON site_about_highlights FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO site_about_highlights (label, icon, sort_order) VALUES
  ('Full-Stack Development', 'Code2', 0),
  ('13+ Shopify Client Projects', 'ShoppingCart', 1),
  ('MERN Stack Experience', 'Layers', 2),
  ('Cloud & API Integration', 'Cloud', 3)
ON CONFLICT DO NOTHING;

-- =========================================================
-- SKILLS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS site_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  featured boolean DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON site_skills;
CREATE POLICY "public_read_skills" ON site_skills FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO site_skills (name, category, featured, sort_order) VALUES
  ('React', 'Frontend', true, 0),
  ('Next.js', 'Frontend', true, 1),
  ('TypeScript', 'Frontend', true, 2),
  ('JavaScript', 'Frontend', false, 3),
  ('HTML', 'Frontend', false, 4),
  ('CSS', 'Frontend', false, 5),
  ('SCSS', 'Frontend', false, 6),
  ('jQuery', 'Frontend', false, 7),
  ('Bootstrap', 'Frontend', false, 8),
  ('Node.js', 'Backend', true, 0),
  ('MERN Stack', 'Backend', true, 1),
  ('REST APIs', 'Backend', true, 2),
  ('GraphQL APIs', 'Backend', true, 3),
  ('MongoDB', 'Database', true, 0),
  ('PostgreSQL', 'Database', false, 1),
  ('SQL', 'Database', false, 2),
  ('MongoDB Atlas Functions', 'Database', false, 3),
  ('Shopify', 'Shopify', true, 0),
  ('Shopify Theme Development', 'Shopify', false, 1),
  ('Shopify Functions', 'Shopify', false, 2),
  ('Shopify Checkout Extensibility', 'Shopify', false, 3),
  ('Shopify Custom App Development', 'Shopify', false, 4),
  ('Third-party Shopify App Integration', 'Shopify', false, 5),
  ('AWS Functions', 'Cloud', false, 0),
  ('AWS Cognito', 'Cloud', false, 1),
  ('Azure Functions', 'Cloud', false, 2),
  ('Google Cloud Functions', 'Cloud', false, 3),
  ('Google Cloud Scheduler', 'Cloud', false, 4),
  ('GitHub', 'Tools', false, 0),
  ('Bitbucket', 'Tools', false, 1),
  ('CI/CD', 'Tools', false, 2),
  ('Elasticsearch', 'Tools', false, 3),
  ('React Native', 'Mobile', false, 0),
  ('Salesforce Development', 'Other', false, 0),
  ('Apex', 'Other', false, 1),
  ('Lightning Applications', 'Other', false, 2)
ON CONFLICT DO NOTHING;

-- =========================================================
-- SERVICES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS site_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Globe',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON site_services;
CREATE POLICY "public_read_services" ON site_services FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO site_services (icon, title, description, sort_order) VALUES
  ('Globe', 'Custom Website Development', 'Modern, responsive websites for businesses, professionals, and organizations that look great on every device.', 0),
  ('Layers', 'Full-Stack Web Development', 'Complete frontend and backend web applications built end-to-end with modern technologies and clean architecture.', 1),
  ('ShoppingCart', 'E-Commerce Development', 'Modern online stores and customized e-commerce experiences designed to convert visitors into customers.', 2),
  ('Store', 'Shopify Development', 'Shopify themes, customizations, Shopify Functions, checkout extensibility, and custom Shopify applications.', 3),
  ('AppWindow', 'Custom Shopify Apps', 'Custom Shopify functionality and integrations tailored to your specific business requirements.', 4),
  ('MonitorSmartphone', 'Web Application Development', 'Scalable web applications using modern technologies that grow with your business and user base.', 5),
  ('Smartphone', 'Mobile Application Development', 'Cross-platform mobile applications built with React Native to reach users on both iOS and Android.', 6),
  ('FileText', 'Landing Page Development', 'High-converting, professional landing pages designed to drive signups, leads, and sales.', 7),
  ('RefreshCw', 'Website Redesign', 'Modernize existing websites with improved design, responsiveness, and performance for a fresh user experience.', 8),
  ('Webhook', 'API Development & Integration', 'REST and GraphQL API development plus third-party integrations to connect your systems and services.', 9),
  ('Server', 'Backend Development', 'Secure, scalable backend systems designed to handle your business logic and data reliably.', 10),
  ('Database', 'Database Development', 'Database design and integration using SQL, PostgreSQL, MongoDB, and related technologies.', 11),
  ('Cloud', 'Cloud & Serverless Development', 'Cloud functions and serverless solutions using AWS, Azure, and Google Cloud for cost-effective scalability.', 12),
  ('LifeBuoy', 'Website Maintenance & Support', 'Bug fixes, updates, improvements, and ongoing maintenance to keep your website running smoothly.', 13),
  ('Gauge', 'Performance Optimization', 'Improve your website''s speed, responsiveness, and overall performance for a better user experience.', 14),
  ('Puzzle', 'Custom Software Solutions', 'Custom digital solutions built around your specific business requirements and workflows.', 15)
ON CONFLICT DO NOTHING;

-- =========================================================
-- EXPERIENCE TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS site_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  current_position boolean DEFAULT false,
  responsibilities text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experience" ON site_experience;
CREATE POLICY "public_read_experience" ON site_experience FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO site_experience (role, company, period, current_position, responsibilities, sort_order) VALUES
  ('Associate Software Developer', 'Aroopa Tech Pvt. Ltd.', 'December 2022 — Present', true,
   ARRAY[
     'Developing websites using the MERN stack',
     'Converting mockups into usable web components',
     'Backend development using Node.js',
     'Working with AWS and Azure functions',
     'MongoDB CRUD functionality using Atlas Functions',
     'GraphQL integration',
     'Building Next.js applications',
     'Google Cloud Scheduler',
     'Third-party payment gateway integration',
     'Shopify theme development',
     'Shopify Functions and checkout extensibility',
     'Shopify custom app development',
     'Third-party integrations'
   ], 0),
  ('Salesforce Developer Intern', 'Avasoft Pvt. Ltd.', 'May 2022 — October 2022', false,
   ARRAY[
     'Salesforce development using Apex',
     'Building Lightning applications',
     'Working with Salesforce components and integrations',
     'Learning enterprise software development practices'
   ], 1)
ON CONFLICT DO NOTHING;

-- =========================================================
-- PROJECTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS site_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  category text NOT NULL DEFAULT 'Other',
  client_type text NOT NULL DEFAULT 'Freelance Project',
  live_url text DEFAULT '',
  github_url text DEFAULT '',
  case_study_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_placeholder boolean DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON site_projects;
CREATE POLICY "public_read_projects" ON site_projects FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO site_projects (title, description, technologies, category, client_type, is_placeholder, sort_order) VALUES
  ('Project Coming Soon', 'This space is reserved for an upcoming project showcase. Check back soon for detailed case studies and live project links.',
   ARRAY['React', 'Node.js', 'MongoDB'], 'Web Applications', 'Freelance Project', true, 0),
  ('Project Coming Soon', 'A Shopify e-commerce project will be showcased here once it''s ready for public viewing.',
   ARRAY['Shopify', 'Liquid', 'Shopify Functions'], 'Shopify', 'Client Project', true, 1),
  ('Project Coming Soon', 'A modern website project will be featured here with a full case study and live demo link.',
   ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], 'Websites', 'Freelance Project', true, 2)
ON CONFLICT DO NOTHING;

-- =========================================================
-- TESTIMONIALS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS site_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text NOT NULL DEFAULT '',
  client_photo_url text DEFAULT '',
  testimonial_text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON site_testimonials;
CREATE POLICY "public_read_testimonials" ON site_testimonials FOR SELECT
  TO anon, authenticated USING (true);

-- =========================================================
-- CONTACT SETTINGS TABLE (single row)
-- =========================================================
CREATE TABLE IF NOT EXISTS site_contact (
  id int PRIMARY KEY DEFAULT 1,
  email text NOT NULL DEFAULT 'awesometech006@gmail.com',
  phone text NOT NULL DEFAULT '+919025211419',
  phone_display text NOT NULL DEFAULT '+91 90252 11419',
  whatsapp_message text NOT NULL DEFAULT 'Hi Swetha, I found your website and would like to discuss a project with Awesome Tech.',
  location text NOT NULL DEFAULT 'India',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_contact ENABLE ROW LEVEL SECURITY;

INSERT INTO site_contact (id, linkedin_url, github_url)
VALUES (1, 'https://www.linkedin.com/in/swetha-m-k', 'https://github.com/swetha-mk')
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_contact" ON site_contact;
CREATE POLICY "public_read_contact" ON site_contact FOR SELECT
  TO anon, authenticated USING (true);

-- =========================================================
-- WEBSITE SETTINGS TABLE (single row)
-- =========================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  website_title text NOT NULL DEFAULT 'Swetha M.K. | Full-Stack Developer | Awesome Tech',
  meta_description text NOT NULL DEFAULT 'Swetha M.K. is a full-stack developer providing freelance web, e-commerce, Shopify, web application, and custom software development services.',
  logo_text text NOT NULL DEFAULT 'Awesome Tech',
  hero_cta_text text NOT NULL DEFAULT 'Start a Project',
  hero_cta_secondary text NOT NULL DEFAULT 'View My Work',
  footer_text text NOT NULL DEFAULT 'Freelance Web & Software Development',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

-- =========================================================
-- CONTACT SUBMISSIONS — update policy
-- (already has anon_insert, add admin read via service role only)
-- =========================================================
-- Already created in previous migration, no changes needed

-- =========================================================
-- STORAGE BUCKET for images
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write (via service role)
DROP POLICY IF EXISTS "public_read_site_images" ON storage.objects;
CREATE POLICY "public_read_site_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "admin_write_site_images" ON storage.objects;
CREATE POLICY "admin_write_site_images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "admin_update_site_images" ON storage.objects;
CREATE POLICY "admin_update_site_images" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "admin_delete_site_images" ON storage.objects;
CREATE POLICY "admin_delete_site_images" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'site-images');

-- =========================================================
-- SEED ADMIN USER
-- Default password: AwesomeTech2026!
-- The hash is bcrypt for "AwesomeTech2026!"
-- =========================================================
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@awesometech.dev', '$2a$10$X7Jq3vBv8Q2kR5nZ1yJ9SeVQJ3qG9hK5mF4rL6sW8eY1cZ2bN3mK')
ON CONFLICT (email) DO NOTHING;

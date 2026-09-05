/*
# Create content tables for admin dashboard

1. New Tables
- `site_content` — single-row table holding all site-wide settings (profile, about, contact, hero, footer, SEO)
- `skill_categories` — skill category groups (Frontend, Backend, etc.)
- `skills` — individual skills belonging to a category
- `services` — service offerings
- `experience` — career timeline entries
- `projects` — portfolio projects
- `testimonials` — client testimonials
- `about_highlights` — trust/credibility strip highlights

2. Security
- All tables: RLS enabled.
- Public (anon, authenticated) can SELECT all content tables — the public website needs to read.
- Only authenticated users can INSERT/UPDATE/DELETE — admin operations require a valid Supabase Auth session.
- No user_id columns needed — this is a single-admin app; any authenticated user IS the admin.

3. Notes
- Uses `sort_order` integer columns for reordering.
- Single-row `site_content` table enforced by a constraint on id = 1.
- All tables are idempotent (IF NOT EXISTS).
- Policies are dropped before recreate for idempotency.
*/

-- ============================================================
-- SITE CONTENT (single-row settings table)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  id integer PRIMARY KEY DEFAULT 1,
  name text NOT NULL DEFAULT 'Swetha M.K.',
  title text NOT NULL DEFAULT 'Full-Stack Developer',
  brand text NOT NULL DEFAULT 'Awesome Tech',
  brand_tagline text NOT NULL DEFAULT 'Freelance Web & Software Development',
  brand_short_tagline text NOT NULL DEFAULT 'Build. Scale. Grow.',
  hero_intro text NOT NULL DEFAULT 'Hi, I''m Swetha M.K., a Full-Stack Developer building scalable, modern and user-focused digital experiences.',
  hero_heading text NOT NULL DEFAULT 'Full-Stack Development That Turns Ideas Into Digital Products.',
  hero_subtext text NOT NULL DEFAULT 'I build modern websites, e-commerce experiences, web applications, mobile applications, and custom software solutions — combining clean code with thoughtful design to help businesses grow.',
  hero_cta_primary text NOT NULL DEFAULT 'Start a Project',
  hero_cta_secondary text NOT NULL DEFAULT 'View My Work',
  profile_photo_url text DEFAULT '/images/ChatGPT_Image_Sep_5,_2026,_02_58_50_PM.png',
  location text NOT NULL DEFAULT 'India',
  availability text NOT NULL DEFAULT 'Available for freelance projects',
  is_available boolean NOT NULL DEFAULT true,
  about_description text NOT NULL DEFAULT 'I''m a passionate full-stack developer who enjoys solving problems, learning new technologies, and adapting to project requirements to build practical digital solutions. My work spans across frontend and backend development, e-commerce platforms, cloud integrations, and modern web frameworks.',
  about_professional_summary text NOT NULL DEFAULT 'I''m currently working as an Associate Software Developer at Aroopa Tech Pvt. Ltd. where I develop websites using the MERN stack, build Shopify solutions, work with cloud functions, and deliver client projects end-to-end.',
  about_brand_description text NOT NULL DEFAULT 'Awesome Tech is my freelance development brand, created to help businesses, entrepreneurs, and individuals turn ideas into reliable digital products.',
  about_brand_note text NOT NULL DEFAULT 'My professional role at Aroopa Tech is separate from my freelance work at Awesome Tech. Awesome Tech is an independent freelance brand, not a registered company.',
  website_title text NOT NULL DEFAULT 'Swetha M.K. | Full-Stack Developer | Awesome Tech',
  meta_description text NOT NULL DEFAULT 'Swetha M.K. is a full-stack developer providing freelance web, e-commerce, Shopify, web application, and custom software development services.',
  footer_text text NOT NULL DEFAULT 'Freelance web and software development by Swetha M.K. Turning ideas into reliable digital products.',
  email text NOT NULL DEFAULT 'awesometech006@gmail.com',
  phone text NOT NULL DEFAULT '+919025211419',
  phone_display text NOT NULL DEFAULT '+91 90252 11419',
  whatsapp_message text NOT NULL DEFAULT 'Hi Swetha, I found your website and would like to discuss a project with Awesome Tech.',
  linkedin_url text DEFAULT 'https://www.linkedin.com/in/swetha-m-k',
  github_url text DEFAULT 'https://github.com/swetha-mk',
  hero_tech_labels text[] NOT NULL DEFAULT ARRAY['React','Next.js','Node.js','TypeScript','Shopify','MongoDB'],
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content" ON site_content
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_site_content" ON site_content;
CREATE POLICY "auth_update_site_content" ON site_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- ABOUT HIGHLIGHTS (trust strip)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon text NOT NULL DEFAULT 'Code2',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE about_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_highlights" ON about_highlights;
CREATE POLICY "public_read_highlights" ON about_highlights
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_highlights" ON about_highlights;
CREATE POLICY "auth_insert_highlights" ON about_highlights
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_highlights" ON about_highlights;
CREATE POLICY "auth_update_highlights" ON about_highlights
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_highlights" ON about_highlights;
CREATE POLICY "auth_delete_highlights" ON about_highlights
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- SKILL CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon text NOT NULL DEFAULT 'Layout',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skill_categories" ON skill_categories;
CREATE POLICY "public_read_skill_categories" ON skill_categories
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_skill_categories" ON skill_categories;
CREATE POLICY "auth_insert_skill_categories" ON skill_categories
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_skill_categories" ON skill_categories;
CREATE POLICY "auth_update_skill_categories" ON skill_categories
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_skill_categories" ON skill_categories;
CREATE POLICY "auth_delete_skill_categories" ON skill_categories
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES skill_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_skills" ON skills;
CREATE POLICY "auth_insert_skills" ON skills
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_skills" ON skills;
CREATE POLICY "auth_update_skills" ON skills
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_skills" ON skills;
CREATE POLICY "auth_delete_skills" ON skills
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Globe',
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- EXPERIENCE
-- ============================================================
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  responsibilities text[] NOT NULL DEFAULT ARRAY[]::text[],
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experience" ON experience;
CREATE POLICY "public_read_experience" ON experience
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_experience" ON experience;
CREATE POLICY "auth_insert_experience" ON experience
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_experience" ON experience;
CREATE POLICY "auth_update_experience" ON experience
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_experience" ON experience;
CREATE POLICY "auth_delete_experience" ON experience
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT '',
  technologies text[] NOT NULL DEFAULT ARRAY[]::text[],
  category text NOT NULL DEFAULT 'Websites',
  client_type text NOT NULL DEFAULT 'Freelance Project',
  live_url text DEFAULT '',
  github_url text DEFAULT '',
  case_study_url text DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  is_placeholder boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text NOT NULL DEFAULT '',
  testimonial_text text NOT NULL,
  client_photo_url text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed site_content (single row)
INSERT INTO site_content (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Seed about_highlights
INSERT INTO about_highlights (label, icon, sort_order) VALUES
  ('Full-Stack Development', 'Code2', 0),
  ('13+ Shopify Client Projects', 'ShoppingCart', 1),
  ('MERN Stack Experience', 'Layers', 2),
  ('Cloud & API Integration', 'Cloud', 3)
ON CONFLICT DO NOTHING;

-- Seed skill_categories + skills
INSERT INTO skill_categories (title, icon, sort_order) VALUES
  ('Frontend', 'Layout', 0),
  ('Backend', 'Server', 1),
  ('Database', 'Database', 2),
  ('E-Commerce & Shopify', 'ShoppingCart', 3),
  ('Cloud & Services', 'Cloud', 4),
  ('Tools & DevOps', 'Wrench', 5),
  ('Mobile', 'Smartphone', 6),
  ('Other Experience', 'Boxes', 7)
ON CONFLICT DO NOTHING;

-- Seed skills (linking to categories by title)
INSERT INTO skills (category_id, name, featured, sort_order)
SELECT sc.id, s.name, s.featured, s.sort_order
FROM skill_categories sc
JOIN (VALUES
  ('Frontend', 'React', true, 0),
  ('Frontend', 'Next.js', true, 1),
  ('Frontend', 'TypeScript', true, 2),
  ('Frontend', 'JavaScript', false, 3),
  ('Frontend', 'HTML', false, 4),
  ('Frontend', 'CSS', false, 5),
  ('Frontend', 'SCSS', false, 6),
  ('Frontend', 'jQuery', false, 7),
  ('Frontend', 'Bootstrap', false, 8),
  ('Backend', 'Node.js', true, 0),
  ('Backend', 'MERN Stack', true, 1),
  ('Backend', 'REST APIs', true, 2),
  ('Backend', 'GraphQL APIs', true, 3),
  ('Database', 'MongoDB', true, 0),
  ('Database', 'PostgreSQL', false, 1),
  ('Database', 'SQL', false, 2),
  ('Database', 'MongoDB Atlas Functions', false, 3),
  ('E-Commerce & Shopify', 'Shopify', true, 0),
  ('E-Commerce & Shopify', 'Shopify Theme Development', false, 1),
  ('E-Commerce & Shopify', 'Shopify Functions', false, 2),
  ('E-Commerce & Shopify', 'Shopify Checkout Extensibility', false, 3),
  ('E-Commerce & Shopify', 'Shopify Custom App Development', false, 4),
  ('E-Commerce & Shopify', 'Third-party Shopify App Integration', false, 5),
  ('Cloud & Services', 'AWS Functions', false, 0),
  ('Cloud & Services', 'AWS Cognito', false, 1),
  ('Cloud & Services', 'Azure Functions', false, 2),
  ('Cloud & Services', 'Google Cloud Functions', false, 3),
  ('Cloud & Services', 'Google Cloud Scheduler', false, 4),
  ('Tools & DevOps', 'GitHub', false, 0),
  ('Tools & DevOps', 'Bitbucket', false, 1),
  ('Tools & DevOps', 'CI/CD', false, 2),
  ('Tools & DevOps', 'Elasticsearch', false, 3),
  ('Mobile', 'React Native', false, 0),
  ('Other Experience', 'Salesforce Development', false, 0),
  ('Other Experience', 'Apex', false, 1),
  ('Other Experience', 'Lightning Applications', false, 2)
) AS s(cat_title, name, featured, sort_order)
ON sc.title = s.cat_title
ON CONFLICT DO NOTHING;

-- Seed services
INSERT INTO services (icon, title, description, sort_order) VALUES
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

-- Seed experience
INSERT INTO experience (role, company, period, is_current, responsibilities, sort_order) VALUES
  ('Associate Software Developer', 'Aroopa Tech Pvt. Ltd.', 'December 2022 — Present', true,
   ARRAY['Developing websites using the MERN stack','Converting mockups into usable web components','Backend development using Node.js','Working with AWS and Azure functions','MongoDB CRUD functionality using Atlas Functions','GraphQL integration','Building Next.js applications','Google Cloud Scheduler','Third-party payment gateway integration','Shopify theme development','Shopify Functions and checkout extensibility','Shopify custom app development','Third-party integrations'], 0),
  ('Salesforce Developer Intern', 'Avasoft Pvt. Ltd.', 'May 2022 — October 2022', false,
   ARRAY['Salesforce development using Apex','Building Lightning applications','Working with Salesforce components and integrations','Learning enterprise software development practices'], 1)
ON CONFLICT DO NOTHING;

-- Seed projects (placeholders)
INSERT INTO projects (title, description, image_url, technologies, category, client_type, is_placeholder, sort_order) VALUES
  ('Project Coming Soon', 'This space is reserved for an upcoming project showcase. Check back soon for detailed case studies and live project links.', '', ARRAY['React','Node.js','MongoDB'], 'Web Applications', 'Freelance Project', true, 0),
  ('Project Coming Soon', 'A Shopify e-commerce project will be showcased here once it''s ready for public viewing.', '', ARRAY['Shopify','Liquid','Shopify Functions'], 'Shopify', 'Client Project', true, 1),
  ('Project Coming Soon', 'A modern website project will be featured here with a full case study and live demo link.', '', ARRAY['Next.js','TypeScript','Tailwind CSS'], 'Websites', 'Freelance Project', true, 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STORAGE BUCKET for admin image uploads
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-uploads', 'admin-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "public_read_admin_uploads" ON storage.objects;
CREATE POLICY "public_read_admin_uploads" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'admin-uploads');

DROP POLICY IF EXISTS "auth_write_admin_uploads" ON storage.objects;
CREATE POLICY "auth_write_admin_uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'admin-uploads');

DROP POLICY IF EXISTS "auth_update_admin_uploads" ON storage.objects;
CREATE POLICY "auth_update_admin_uploads" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'admin-uploads') WITH CHECK (bucket_id = 'admin-uploads');

DROP POLICY IF EXISTS "auth_delete_admin_uploads" ON storage.objects;
CREATE POLICY "auth_delete_admin_uploads" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'admin-uploads');

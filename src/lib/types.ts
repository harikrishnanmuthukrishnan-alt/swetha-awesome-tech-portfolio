export interface SiteContent {
  id: number;
  name: string;
  title: string;
  brand: string;
  brand_tagline: string;
  brand_short_tagline: string;
  hero_intro: string;
  hero_heading: string;
  hero_subtext: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  profile_photo_url: string;
  location: string;
  availability: string;
  is_available: boolean;
  about_description: string;
  about_professional_summary: string;
  about_brand_description: string;
  about_brand_note: string;
  website_title: string;
  meta_description: string;
  footer_text: string;
  email: string;
  phone: string;
  phone_display: string;
  whatsapp_message: string;
  linkedin_url: string;
  github_url: string;
  hero_tech_labels: string[];
}

export interface AboutHighlight {
  id: string;
  label: string;
  icon: string;
  sort_order: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  sort_order: number;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  featured: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  is_current: boolean;
  responsibilities: string[];
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  category: string;
  client_type: string;
  live_url: string;
  github_url: string;
  case_study_url: string;
  is_featured: boolean;
  is_placeholder: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  testimonial_text: string;
  client_photo_url: string;
  sort_order: number;
}

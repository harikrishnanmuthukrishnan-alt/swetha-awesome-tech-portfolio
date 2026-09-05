import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type {
  SiteContent,
  AboutHighlight,
  SkillCategory,
  Skill,
  Service,
  ExperienceItem,
  Project,
  Testimonial,
} from "@/lib/types";

interface ContentData {
  siteContent: SiteContent | null;
  highlights: AboutHighlight[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  services: Service[];
  experience: ExperienceItem[];
  projects: Project[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentData | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [highlights, setHighlights] = useState<AboutHighlight[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        contentRes,
        highlightsRes,
        categoriesRes,
        skillsRes,
        servicesRes,
        experienceRes,
        projectsRes,
        testimonialsRes,
      ] = await Promise.all([
        supabase.from("site_content").select("*").eq("id", 1).maybeSingle(),
        supabase
          .from("about_highlights")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("skill_categories")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("skills")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("services")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("experience")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("projects")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("testimonials")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      if (contentRes.error) throw contentRes.error;

      setSiteContent(contentRes.data as SiteContent);
      setHighlights((highlightsRes.data as AboutHighlight[]) ?? []);
      setSkillCategories((categoriesRes.data as SkillCategory[]) ?? []);
      setSkills((skillsRes.data as Skill[]) ?? []);
      setServices((servicesRes.data as Service[]) ?? []);
      setExperience((experienceRes.data as ExperienceItem[]) ?? []);
      setProjects((projectsRes.data as Project[]) ?? []);
      setTestimonials((testimonialsRes.data as Testimonial[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContentContext.Provider
      value={{
        siteContent,
        highlights,
        skillCategories,
        skills,
        services,
        experience,
        projects,
        testimonials,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

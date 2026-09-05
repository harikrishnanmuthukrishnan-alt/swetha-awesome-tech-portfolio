// ============================================================
// PROJECTS DATA
// Swetha will add her real projects here later.
// To add a project, copy a placeholder object and fill in
// the fields. Set `image` to a URL or import path.
// ============================================================

export interface Project {
  image: string;
  title: string;
  description: string;
  technologies: string[];
  category: ProjectCategory;
  clientType: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  isPlaceholder?: boolean;
}

export type ProjectCategory =
  | "Websites"
  | "Web Applications"
  | "E-Commerce"
  | "Shopify"
  | "Mobile"
  | "Other";

export const projectFilters: (ProjectCategory | "All")[] = [
  "All",
  "Websites",
  "Web Applications",
  "E-Commerce",
  "Shopify",
  "Mobile",
  "Other",
];

export const projects: Project[] = [
  {
    image: "",
    title: "Project Coming Soon",
    description:
      "This space is reserved for an upcoming project showcase. Check back soon for detailed case studies and live project links.",
    technologies: ["React", "Node.js", "MongoDB"],
    category: "Web Applications",
    clientType: "Freelance Project",
    isPlaceholder: true,
  },
  {
    image: "",
    title: "Project Coming Soon",
    description:
      "A Shopify e-commerce project will be showcased here once it's ready for public viewing.",
    technologies: ["Shopify", "Liquid", "Shopify Functions"],
    category: "Shopify",
    clientType: "Client Project",
    isPlaceholder: true,
  },
  {
    image: "",
    title: "Project Coming Soon",
    description:
      "A modern website project will be featured here with a full case study and live demo link.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "Websites",
    clientType: "Freelance Project",
    isPlaceholder: true,
  },
];

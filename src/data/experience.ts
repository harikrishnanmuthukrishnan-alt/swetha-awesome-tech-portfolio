// ============================================================
// EXPERIENCE / CAREER TIMELINE
// Edit this file to update work history.
// ============================================================

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  current?: boolean;
  responsibilities: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Associate Software Developer",
    company: "Aroopa Tech Pvt. Ltd.",
    period: "December 2022 — Present",
    current: true,
    responsibilities: [
      "Developing websites using the MERN stack",
      "Converting mockups into usable web components",
      "Backend development using Node.js",
      "Working with AWS and Azure functions",
      "MongoDB CRUD functionality using Atlas Functions",
      "GraphQL integration",
      "Building Next.js applications",
      "Google Cloud Scheduler",
      "Third-party payment gateway integration",
      "Shopify theme development",
      "Shopify Functions and checkout extensibility",
      "Shopify custom app development",
      "Third-party integrations",
    ],
  },
  {
    role: "Salesforce Developer Intern",
    company: "Avasoft Pvt. Ltd.",
    period: "May 2022 — October 2022",
    responsibilities: [
      "Salesforce development using Apex",
      "Building Lightning applications",
      "Working with Salesforce components and integrations",
      "Learning enterprise software development practices",
    ],
  },
];

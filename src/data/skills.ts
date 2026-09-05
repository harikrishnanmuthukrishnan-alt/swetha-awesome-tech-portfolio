// ============================================================
// SKILLS DATA
// Edit this file to update technologies and categories.
// `featured: true` technologies are highlighted first.
// ============================================================

export interface Skill {
  name: string;
  featured?: boolean;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: "Layout",
    skills: [
      { name: "React", featured: true },
      { name: "Next.js", featured: true },
      { name: "TypeScript", featured: true },
      { name: "JavaScript" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "SCSS" },
      { name: "jQuery" },
      { name: "Bootstrap" },
    ],
  },
  {
    title: "Backend",
    icon: "Server",
    skills: [
      { name: "Node.js", featured: true },
      { name: "MERN Stack", featured: true },
      { name: "REST APIs", featured: true },
      { name: "GraphQL APIs", featured: true },
    ],
  },
  {
    title: "Database",
    icon: "Database",
    skills: [
      { name: "MongoDB", featured: true },
      { name: "PostgreSQL" },
      { name: "SQL" },
      { name: "MongoDB Atlas Functions" },
    ],
  },
  {
    title: "E-Commerce & Shopify",
    icon: "ShoppingCart",
    skills: [
      { name: "Shopify", featured: true },
      { name: "Shopify Theme Development" },
      { name: "Shopify Functions" },
      { name: "Shopify Checkout Extensibility" },
      { name: "Shopify Custom App Development" },
      { name: "Third-party Shopify App Integration" },
    ],
  },
  {
    title: "Cloud & Services",
    icon: "Cloud",
    skills: [
      { name: "AWS Functions" },
      { name: "AWS Cognito" },
      { name: "Azure Functions" },
      { name: "Google Cloud Functions" },
      { name: "Google Cloud Scheduler" },
    ],
  },
  {
    title: "Tools & DevOps",
    icon: "Wrench",
    skills: [
      { name: "GitHub" },
      { name: "Bitbucket" },
      { name: "CI/CD" },
      { name: "Elasticsearch" },
    ],
  },
  {
    title: "Mobile",
    icon: "Smartphone",
    skills: [{ name: "React Native" }],
  },
  {
    title: "Other Experience",
    icon: "Boxes",
    skills: [
      { name: "Salesforce Development" },
      { name: "Apex" },
      { name: "Lightning Applications" },
    ],
  },
];

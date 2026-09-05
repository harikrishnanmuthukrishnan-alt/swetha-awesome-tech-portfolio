// ============================================================
// FREELANCE PROCESS STEPS
// Edit this file to update the process workflow.
// ============================================================

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Tell Me About Your Idea",
    description:
      "You share your business, idea, or requirements. No technical jargon needed — just tell me what you want to build.",
    icon: "MessageSquare",
  },
  {
    number: "02",
    title: "Discuss & Plan",
    description:
      "We define the scope, timeline, and approach together so you know exactly what to expect before development begins.",
    icon: "ClipboardList",
  },
  {
    number: "03",
    title: "Design & Development",
    description:
      "I build your product with regular communication and feedback checkpoints, so you're involved at every step.",
    icon: "Code2",
  },
  {
    number: "04",
    title: "Testing & Refinement",
    description:
      "Every feature is tested for functionality, responsiveness, and quality — then refined based on your feedback.",
    icon: "CheckCircle",
  },
  {
    number: "05",
    title: "Launch & Support",
    description:
      "We deploy the final product and I provide ongoing support and maintenance whenever you need it.",
    icon: "Rocket",
  },
];

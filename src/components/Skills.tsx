import { useState } from "react";
import {
  Layout,
  Server,
  Database,
  ShoppingCart,
  Cloud,
  Wrench,
  Smartphone,
  Boxes,
  Star,
} from "lucide-react";
import { skillCategories } from "@/data/skills";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const iconMap: Record<string, React.ElementType> = {
  Layout,
  Server,
  Database,
  ShoppingCart,
  Cloud,
  Wrench,
  Smartphone,
  Boxes,
};

export default function Skills() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState(0);

  const featuredSkills = skillCategories
    .flatMap((cat) => cat.skills)
    .filter((s) => s.featured)
    .map((s) => s.name);

  return (
    <section id="skills" className="section-padding bg-[#0d0d14]">
      <div
        ref={ref}
        className={`container-max ${isVisible ? "reveal is-visible" : "reveal"}`}
      >
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Skills
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Technologies I Work With
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
            A full-stack toolkit spanning frontend, backend, database,
            e-commerce, cloud, and mobile development.
          </p>
        </div>

        {/* Featured skills */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {featuredSkills.map((skill) => (
            <div
              key={skill}
              className="group flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/5 px-4 py-2.5 transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/10 hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]"
            >
              <Star className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-sm font-medium text-gray-200">{skill}</span>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {skillCategories.map((cat, idx) => {
            const Icon = iconMap[cat.icon] ?? Layout;
            return (
              <button
                key={cat.title}
                onClick={() => setActiveCategory(idx)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === idx
                    ? "bg-purple-500/15 text-white border border-purple-500/30"
                    : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Active category skills */}
        <div className="card-base p-8">
          <div className="flex flex-wrap gap-3">
            {skillCategories[activeCategory].skills.map((skill) => (
              <div
                key={skill.name}
                className={`group relative flex items-center gap-2 rounded-xl border px-4 py-3 transition-all duration-300 ${
                  skill.featured
                    ? "border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50 hover:bg-purple-500/10"
                    : "border-[#2a2a3a] bg-[#0f0f16] hover:border-[#3a3a4a] hover:bg-[#1a1a25]"
                }`}
              >
                {skill.featured && (
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    skill.featured ? "text-gray-100" : "text-gray-400"
                  }`}
                >
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

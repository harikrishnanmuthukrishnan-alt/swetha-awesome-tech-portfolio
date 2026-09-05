import { useState } from "react";
import { ExternalLink, Github, FileText, FolderOpen, ArrowUpRight } from "lucide-react";
import { projects, projectFilters, type ProjectCategory } from "@/data/projects";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Filter = ProjectCategory | "All";

export default function Projects() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-padding">
      <div
        ref={ref}
        className={`container-max ${isVisible ? "reveal is-visible" : "reveal"}`}
      >
        {/* Section header */}
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Projects
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Portfolio Showcase
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
            A collection of my work. Real projects will be added soon — the
            structure below is ready for easy updates.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {projectFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? "bg-purple-500/15 text-white border border-purple-500/30"
                  : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, idx) => (
            <div
              key={idx}
              className="group card-base card-hover overflow-hidden"
            >
              {/* Project image / placeholder */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#12121a] to-[#0a0a0f]">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                    <FolderOpen className="h-10 w-10 text-purple-400/30" />
                    <span className="text-xs text-gray-600">
                      Image will be added
                    </span>
                  </div>
                )}
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="rounded-md border border-purple-500/20 bg-[#0a0a0f]/80 px-2.5 py-1 text-[11px] font-medium text-purple-300 backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                {/* Placeholder badge */}
                {project.isPlaceholder && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-md border border-blue-500/20 bg-[#0a0a0f]/80 px-2.5 py-1 text-[11px] font-medium text-blue-300 backdrop-blur-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">
                    {project.title}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-gray-600 transition-colors group-hover:text-purple-400" />
                </div>
                <p className="mb-3 text-xs text-gray-500">{project.clientType}</p>
                <p className="mb-4 text-sm leading-relaxed text-gray-400">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[#2a2a3a] bg-[#0f0f16] px-2 py-0.5 font-mono text-[10px] text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 border-t border-[#2a2a3a] pt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-purple-400"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-purple-400"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Code
                    </a>
                  )}
                  {project.caseStudyUrl && (
                    <a
                      href={project.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-purple-400"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Case Study
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-sm">No projects in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

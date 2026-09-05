import { Briefcase, GraduationCap, MapPin, Calendar } from "lucide-react";
import { experience } from "@/data/experience";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Experience() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="experience" className="section-padding bg-[#0d0d14]">
      <div
        ref={ref}
        className={`container-max ${isVisible ? "reveal is-visible" : "reveal"}`}
      >
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Experience
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Career Timeline
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-purple-500/40 via-purple-500/20 to-transparent md:left-1/2" />

          {experience.map((exp, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative mb-12 flex ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-purple-500 bg-[#0d0d14] md:left-1/2" />

                {/* Card */}
                <div
                  className={`ml-10 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? "md:pr-0" : "md:pl-0"
                  }`}
                >
                  <div className="card-base card-hover p-6">
                    <div className="mb-3 flex items-center gap-2">
                      {exp.current ? (
                        <Briefcase className="h-4 w-4 text-purple-400" />
                      ) : (
                        <GraduationCap className="h-4 w-4 text-blue-400" />
                      )}
                      {exp.current && (
                        <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-medium text-green-400">
                          Current
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      {exp.role}
                    </h3>
                    <p className="mb-1 text-sm font-medium text-purple-400">
                      {exp.company}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.period}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-400"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500/60" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

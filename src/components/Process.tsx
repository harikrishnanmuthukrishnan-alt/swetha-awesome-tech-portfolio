import {
  MessageSquare,
  ClipboardList,
  Code2,
  CheckCircle,
  Rocket,
} from "lucide-react";
import { processSteps } from "@/data/process";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  ClipboardList,
  Code2,
  CheckCircle,
  Rocket,
};

export default function Process() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="process" className="section-padding bg-[#0d0d14]">
      <div
        ref={ref}
        className={`container-max ${isVisible ? "reveal is-visible" : "reveal"}`}
      >
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Process
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            How We Work
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
            A clear, collaborative process from first conversation to launch and
            beyond.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, idx) => {
            const Icon = iconMap[step.icon] ?? MessageSquare;
            return (
              <div key={step.number} className="relative">
                {/* Connector line (desktop) */}
                {idx < processSteps.length - 1 && (
                  <div className="absolute top-8 left-full hidden h-px w-full bg-gradient-to-r from-purple-500/30 to-transparent lg:block" />
                )}

                <div className="group card-base card-hover h-full p-6 text-center">
                  {/* Number + Icon */}
                  <div className="mb-4 flex items-center justify-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/5 transition-all duration-300 group-hover:border-purple-500/40 group-hover:bg-purple-500/10">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>

                  <span className="mb-2 block font-display text-2xl font-bold text-purple-500/30">
                    {step.number}
                  </span>
                  <h3 className="mb-2 text-base font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

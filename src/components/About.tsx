import { Briefcase, Rocket, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function About() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="section-padding">
      <div
        ref={ref}
        className={`container-max ${isVisible ? "reveal is-visible" : "reveal"}`}
      >
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            About
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            About Swetha
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Swetha's bio */}
          <div className="card-base card-hover p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/5">
                <Briefcase className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Professional Background
              </h3>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-gray-400 md:text-base">
              <p>
                I'm a passionate full-stack developer who enjoys solving
                problems, learning new technologies, and adapting to project
                requirements to build practical digital solutions. My work
                spans across frontend and backend development, e-commerce
                platforms, cloud integrations, and modern web frameworks.
              </p>
              <p>
                I'm currently working as an{" "}
                <span className="font-medium text-gray-200">
                  Associate Software Developer at Aroopa Tech Pvt. Ltd.
                </span>{" "}
                where I develop websites using the MERN stack, build Shopify
                solutions, work with cloud functions, and deliver client
                projects end-to-end.
              </p>
              <p>
                My approach is simple: understand the problem, plan the
                solution, and build it clean. I believe great software comes
                from both technical skill and genuine care for the people who
                use it.
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-6 flex flex-wrap gap-3 border-t border-[#2a2a3a] pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                MERN Stack
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                Shopify Development
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                Cloud Functions
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-purple-400" />
                API Integration
              </div>
            </div>
          </div>

          {/* Awesome Tech intro */}
          <div className="card-base card-hover p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/5">
                <Rocket className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                {siteConfig.brand}
              </h3>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-gray-400 md:text-base">
              <p>
                <span className="font-medium text-gray-200">
                  {siteConfig.brand}
                </span>{" "}
                is my freelance development brand, created to help businesses,
                entrepreneurs, and individuals turn ideas into reliable digital
                products.
              </p>
              <p>
                Through {siteConfig.brand}, I offer freelance web and software
                development services — from custom websites and e-commerce
                stores to full-stack web applications, mobile apps, and custom
                software solutions.
              </p>
              <p>
                Whether you need a new website, a Shopify store, a web
                application, or ongoing support for an existing project, I work
                closely with you to understand your goals and deliver something
                you're proud to show your customers.
              </p>
            </div>

            {/* Distinction callout */}
            <div className="mt-6 rounded-xl border border-[#2a2a3a] bg-[#0f0f16] p-4">
              <p className="text-xs leading-relaxed text-gray-500">
                <span className="font-medium text-gray-400">Note:</span> My
                professional role at Aroopa Tech is separate from my freelance
                work at {siteConfig.brand}. {siteConfig.brand} is an independent
                freelance brand, not a registered company.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

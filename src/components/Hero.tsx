import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig, heroTechLabels } from "@/data/site";

export default function Hero() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-blue-600/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      {/* Code-inspired grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-max relative z-10 grid grid-cols-1 items-center gap-12 px-5 py-10 md:px-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: Text content */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">
              {siteConfig.brand} — Freelance Development
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl">
            {siteConfig.heroHeading.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-gradient-purple">
              {siteConfig.heroHeading.split(" ").slice(-2).join(" ")}
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
            {siteConfig.heroIntro} {siteConfig.heroSubtext}
          </p>

          {/* Role badges */}
          <div className="flex flex-wrap gap-2">
            {["Full-Stack Developer", "Freelance Developer", siteConfig.brand].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-1.5 text-xs font-medium text-gray-300"
                >
                  {badge}
                </span>
              )
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => scrollTo("#contact")}
              className="btn-primary"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo("#projects")}
              className="btn-secondary"
            >
              View My Work
            </button>
          </div>

          {/* Tech labels */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-gray-500">Working with</span>
            {heroTechLabels.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[#2a2a3a] bg-[#0f0f16] px-2.5 py-1 font-mono text-[11px] text-gray-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Portrait area */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            {/* Decorative code brackets */}
            <div className="absolute -left-8 -top-8 hidden font-mono text-4xl text-purple-500/20 md:block">
              {"<"}
            </div>
            <div className="absolute -bottom-8 -right-8 hidden font-mono text-4xl text-purple-500/20 md:block">
              {"/>"}
            </div>

            {/* Professional profile photo */}
            <div className="gradient-border relative h-80 w-64 overflow-hidden rounded-3xl sm:h-96 sm:w-72 md:h-[28rem] md:w-80">
              <img
                src="/images/ChatGPT_Image_Sep_5,_2026,_02_58_50_PM.png"
                alt="Swetha M.K., Full-Stack Developer at Awesome Tech"
                className="h-full w-full object-cover object-center"
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#0a0a0f]/70 px-3 py-2 backdrop-blur-sm">
                <p className="text-xs font-medium text-white">Swetha M.K.</p>
                <p className="mt-0.5 text-[10px] text-purple-300">Full-Stack Developer</p>
              </div>
            </div>

            {/* Floating accent dots */}
            <div className="absolute -right-4 top-1/4 h-2 w-2 animate-pulse rounded-full bg-purple-400" />
            <div className="absolute -left-4 bottom-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  Globe,
  Layers,
  ShoppingCart,
  Store,
  AppWindow,
  MonitorSmartphone,
  Smartphone,
  FileText,
  RefreshCw,
  Webhook,
  Server,
  Database,
  Cloud,
  LifeBuoy,
  Gauge,
  Puzzle,
  ArrowRight,
} from "lucide-react";
import { services } from "@/data/services";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Layers,
  ShoppingCart,
  Store,
  AppWindow,
  MonitorSmartphone,
  Smartphone,
  FileText,
  RefreshCw,
  Webhook,
  Server,
  Database,
  Cloud,
  LifeBuoy,
  Gauge,
  Puzzle,
};

export default function Services() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="section-padding">
      <div
        ref={ref}
        className={`container-max ${isVisible ? "reveal is-visible" : "reveal"}`}
      >
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Services
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            What I Can Build For You
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
            From custom websites to full-stack applications and Shopify stores —
            everything you need to bring your idea to life.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = iconMap[service.icon] ?? Globe;
            return (
              <div
                key={service.title}
                className="group card-base card-hover relative overflow-hidden p-6"
              >
                {/* Hover gradient line */}
                <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/5 transition-all duration-300 group-hover:border-purple-500/40 group-hover:bg-purple-500/10">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-gray-400">
            Don't see exactly what you need? I build custom solutions too.
          </p>
          <button onClick={scrollToContact} className="btn-primary">
            Discuss Your Project
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, MessageCircle } from "lucide-react";
import { contactConfig, siteConfig } from "@/data/site";

export default function CTA() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const whatsappUrl = `https://wa.me/${contactConfig.phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`;

  return (
    <section className="section-padding">
      <div className="container-max px-5 md:px-10">
        <div className="gradient-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121a] to-[#0d0d14] p-10 text-center md:p-16">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/10 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-blue-600/8 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Have an Idea?{" "}
              <span className="text-gradient-purple">Let's Build It.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400 md:text-base">
              Tell me what you're building, and let's turn your idea into a
              reliable digital product.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => scrollTo("#contact")}
                className="btn-primary"
              >
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <MessageCircle className="h-4 w-4 text-green-400" />
                WhatsApp Me
              </a>
            </div>

            <p className="mt-6 text-xs text-gray-600">
              {siteConfig.brand} — {siteConfig.brandTagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

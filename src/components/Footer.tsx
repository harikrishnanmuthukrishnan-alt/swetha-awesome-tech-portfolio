import { Linkedin, Github, MessageCircle, ArrowUp } from "lucide-react";
import { siteConfig, contactConfig, navLinks } from "@/data/site";
import { services } from "@/data/services";

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappUrl = `https://wa.me/${contactConfig.phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`;

  return (
    <footer className="border-t border-[#1a1a25] bg-[#0a0a0f]">
      <div className="container-max px-5 py-14 md:px-10 md:py-16 lg:px-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-xl font-bold text-white">
              {siteConfig.brand}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {siteConfig.brandTagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              Freelance web and software development by {siteConfig.name}.
              Turning ideas into reliable digital products.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-400 transition-colors hover:text-purple-400"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Services</h4>
            <ul className="space-y-2">
              {services.slice(0, 7).map((service) => (
                <li key={service.title}>
                  <button
                    onClick={() => scrollTo("#services")}
                    className="text-left text-sm text-gray-400 transition-colors hover:text-purple-400"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Contact</h4>
            <div className="space-y-2">
              <a
                href={`mailto:${contactConfig.email}`}
                className="block text-sm text-gray-400 transition-colors hover:text-purple-400"
              >
                {contactConfig.email}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-green-400"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href={contactConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a3a] bg-[#12121a] text-gray-400 transition-all hover:border-purple-500/40 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={contactConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a3a] bg-[#12121a] text-gray-400 transition-all hover:border-purple-500/40 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a3a] bg-[#12121a] text-gray-400 transition-all hover:border-green-500/40 hover:text-green-400"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1a1a25] pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {siteConfig.currentYear} {siteConfig.brand}. All rights
            reserved.
          </p>
          <button
            onClick={scrollTop}
            className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-purple-400"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}

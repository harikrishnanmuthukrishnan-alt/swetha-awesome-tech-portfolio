import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { contactConfig, siteConfig } from "@/data/site";
import { supabase } from "@/lib/supabase";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Status = "idle" | "loading" | "success" | "error";

const projectTypes = [
  "Website",
  "E-Commerce",
  "Shopify",
  "Web Application",
  "Mobile Application",
  "Custom Software",
  "Website Redesign",
  "Maintenance",
  "Other",
];

const budgetRanges = [
  "Under $500",
  "$500 - $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
  "Let's discuss",
];

export default function Contact() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budgetRange: "",
    message: "",
  });

  const whatsappUrl = `https://wa.me/${contactConfig.phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.message.trim()) e.message = "Please enter a message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        project_type: form.projectType || null,
        budget_range: form.budgetRange || null,
        message: form.message.trim(),
      });

      if (error) throw error;

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budgetRange: "",
        message: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (
    field: string,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <section id="contact" className="section-padding bg-[#0d0d14]">
      <div
        ref={ref}
        className={`container-max ${isVisible ? "reveal is-visible" : "reveal"}`}
      >
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Contact
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Let's Build Something Awesome.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 md:text-base">
            Tell me about your project and I'll get back to you as soon as
            possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2">
            <div className="card-base p-8">
              <h3 className="mb-6 text-lg font-semibold text-white">
                Direct Contact
              </h3>
              <div className="space-y-5">
                {/* Email */}
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/5 transition-colors group-hover:border-purple-500/40">
                    <Mail className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-300">
                      {contactConfig.email}
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${contactConfig.phone}`}
                  className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/5 transition-colors group-hover:border-purple-500/40">
                    <Phone className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-300">
                      {contactConfig.phoneDisplay}
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/5">
                    <MapPin className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium text-gray-300">
                      {contactConfig.location}
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/5 transition-colors group-hover:border-green-500/40">
                    <MessageCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="font-medium text-gray-300">
                      Chat with me directly
                    </p>
                  </div>
                </a>
              </div>

              {/* Social links */}
              <div className="mt-6 flex gap-3 border-t border-[#2a2a3a] pt-6">
                <a
                  href={contactConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a2a3a] bg-[#0f0f16] text-gray-400 transition-all hover:border-purple-500/40 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={contactConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a2a3a] bg-[#0f0f16] text-gray-400 transition-all hover:border-purple-500/40 hover:text-white"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a2a3a] bg-[#0f0f16] text-gray-400 transition-all hover:border-green-500/40 hover:text-green-400"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="card-base p-8"
              noValidate
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-gray-300"
                  >
                    Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="input-field"
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-gray-300"
                  >
                    Email <span className="text-purple-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-medium text-gray-300"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="input-field"
                    placeholder="Optional"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label
                    htmlFor="projectType"
                    className="mb-1.5 block text-sm font-medium text-gray-300"
                  >
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    value={form.projectType}
                    onChange={(e) => handleChange("projectType", e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option value="">Select a type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="budgetRange"
                    className="mb-1.5 block text-sm font-medium text-gray-300"
                  >
                    Budget Range{" "}
                    <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <select
                    id="budgetRange"
                    value={form.budgetRange}
                    onChange={(e) => handleChange("budgetRange", e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option value="">Select a range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-gray-300"
                  >
                    Message <span className="text-purple-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="input-field resize-none"
                    placeholder="Tell me about your project, goals, and timeline..."
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                  )}
                </div>
              </div>

              {/* Status messages */}
              {status === "success" && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <p className="text-sm text-green-300">
                    Thank you! Your message has been sent. I'll get back to you
                    soon.
                  </p>
                </div>
              )}
              {status === "error" && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                  <p className="text-sm text-red-300">
                    Something went wrong. Please try again or reach out via
                    email or WhatsApp.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary mt-6 w-full sm:w-auto"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

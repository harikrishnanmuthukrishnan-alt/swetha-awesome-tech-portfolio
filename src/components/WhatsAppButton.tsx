import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { contactConfig } from "@/data/site";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Show tooltip after a delay
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 12000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const whatsappUrl = `https://wa.me/${contactConfig.phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-end gap-3 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-10 opacity-0"
      }`}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative mb-1 hidden items-center gap-2 rounded-xl border border-[#2a2a3a] bg-[#12121a] px-4 py-2.5 shadow-xl sm:flex">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2a2a3a] text-gray-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="text-sm text-gray-300">Need help? Chat on WhatsApp</p>
        </div>
      )}

      {/* WhatsApp button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-110 hover:bg-green-400 hover:shadow-green-500/40 active:scale-95"
        aria-label="Contact on WhatsApp"
        style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {/* Notification dot */}
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500" />
        </span>
      </a>
    </div>
  );
}

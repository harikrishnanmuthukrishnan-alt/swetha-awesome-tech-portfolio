import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  Code2,
  Boxes,
  Briefcase,
  FolderKanban,
  Quote,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, useRouter } from "@/lib/router";

export type AdminSection =
  | "dashboard"
  | "profile"
  | "about"
  | "skills"
  | "services"
  | "experience"
  | "projects"
  | "testimonials"
  | "contact"
  | "settings";

interface AdminLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: ReactNode;
}

const navItems: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "about", label: "About", icon: FileText },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "services", label: "Services", icon: Boxes },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  activeSection,
  onSectionChange,
  children,
}: AdminLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { path } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (section: AdminSection) => {
    onSectionChange(section);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const activeLabel =
    navItems.find((n) => n.id === activeSection)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#1a1a25] bg-[#0d0d14] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-bold text-white">
            Awesome Tech
          </span>
          <span className="text-[10px] uppercase tracking-widest text-purple-400">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-400 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[#1a1a25] bg-[#0d0d14] transition-transform duration-300 lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b border-[#1a1a25] px-6 py-5">
              <button
                onClick={() => handleNav("dashboard")}
                className="flex flex-col items-start"
              >
                <span className="font-display text-lg font-bold text-white">
                  Awesome Tech
                </span>
                <span className="text-[10px] uppercase tracking-widest text-purple-400">
                  Admin Panel
                </span>
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNav(item.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-purple-500/10 text-white border border-purple-500/20"
                            : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="border-t border-[#1a1a25] px-3 py-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-64">
          {/* Desktop header */}
          <div className="hidden border-b border-[#1a1a25] bg-[#0d0d14] px-8 py-4 lg:block">
            <h1 className="text-xl font-semibold text-white">{activeLabel}</h1>
          </div>

          <div className="p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Loading spinner for admin sections
export function AdminLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
    </div>
  );
}

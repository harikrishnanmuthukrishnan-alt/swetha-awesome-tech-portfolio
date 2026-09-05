import { FolderKanban, Boxes, Code2, Briefcase, Quote, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { useContent } from "@/lib/content-content";
import type { AdminSection } from "./AdminLayout";

export default function AdminDashboard({
  onNavigate,
}: {
  onNavigate: (section: AdminSection) => void;
}) {
  const { siteContent, projects, services, skillCategories, skills, experience, testimonials } =
    useContent();

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderKanban, section: "projects" as AdminSection },
    { label: "Services", value: services.length, icon: Boxes, section: "services" as AdminSection },
    { label: "Skills", value: skills.length, icon: Code2, section: "skills" as AdminSection },
    { label: "Experience", value: experience.length, icon: Briefcase, section: "experience" as AdminSection },
    { label: "Testimonials", value: testimonials.length, icon: Quote, section: "testimonials" as AdminSection },
  ];

  const quickActions: { label: string; section: AdminSection; icon: React.ElementType }[] = [
    { label: "Add Project", section: "projects", icon: FolderKanban },
    { label: "Edit Profile", section: "profile", icon: User },
    { label: "Update Services", section: "services", icon: Boxes },
    { label: "Manage Skills", section: "skills", icon: Code2 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="card-base p-6">
        <h2 className="text-xl font-semibold text-white">
          Welcome back, {siteContent?.name ?? "Swetha"}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Manage your portfolio website content from this dashboard.
        </p>
        {siteContent && (
          <div className="mt-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">{siteContent.availability}</span>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => onNavigate(stat.section)}
              className="card-base card-hover p-5 text-left"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/5">
                <Icon className="h-5 w-5 text-purple-400" />
              </div>
              <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => onNavigate(action.section)}
                className="group flex items-center justify-between rounded-xl border border-[#2a2a3a] bg-[#12121a] px-5 py-4 transition-all hover:border-purple-500/40 hover:bg-[#1a1a25]"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-gray-200">{action.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-600 transition-colors group-hover:text-purple-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "@/lib/router";
import { LogOut, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { session, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!session) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#1a1a25] bg-[#0d0d14]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/5">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-white">
                Awesome Tech Admin
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-purple-400">
                Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="card-base p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/5">
            <ShieldCheck className="h-8 w-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Welcome to your Admin Dashboard
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            You are signed in as{" "}
            <span className="font-medium text-gray-200">
              {session.user.email}
            </span>
            . Content management features will be added here soon.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card-base p-5">
            <p className="text-xs text-gray-500">Status</p>
            <p className="mt-1 text-sm font-medium text-green-400">
              Authenticated
            </p>
          </div>
          <div className="card-base p-5">
            <p className="text-xs text-gray-500">Session</p>
            <p className="mt-1 text-sm font-medium text-gray-200">Active</p>
          </div>
          <div className="card-base p-5">
            <p className="text-xs text-gray-500">Role</p>
            <p className="mt-1 text-sm font-medium text-gray-200">
              Administrator
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

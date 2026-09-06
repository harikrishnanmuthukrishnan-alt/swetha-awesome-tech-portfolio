import { RouterProvider, useRouter } from "@/lib/router";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminLogin from "@/admin/AdminLogin";
import AdminDashboard from "@/admin/AdminDashboard";

function PublicSite() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <Skills />
        <Services />
        <Experience />
        <Projects />
        <Process />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function ProtectedDashboard() {
  const { session, loading } = useAuth();
  const { navigate } = useRouter();

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

  return <AdminDashboard />;
}

function AppRoutes() {
  const { path } = useRouter();

  if (path === "/admin/login") {
    return <AdminLogin />;
  }

  if (path === "/admin/dashboard") {
    return <ProtectedDashboard />;
  }

  return <PublicSite />;
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;

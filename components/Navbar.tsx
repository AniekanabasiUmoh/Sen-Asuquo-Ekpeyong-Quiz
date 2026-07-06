"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, ChevronDown, Award, School, Shield } from "lucide-react";
import { useRole, UserRole } from "@/lib/RoleContext";

function NavbarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, setPortalSelected } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlePortalSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setPortalSelected(true);
    setMobileOpen(false);
    router.push("/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: "#fff", borderColor: "#e8edf5", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative w-9 h-9">
            <Image src="/assets/brand/logo_state_quiz.png" alt="logo" fill className="object-contain" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-sm leading-tight tracking-wide" style={{ color: "var(--navy-950)" }}>SEN. ASUQUO EKPENYONG</div>
            <div className="text-[10px] tracking-widest" style={{ color: "var(--muted)" }}>QUIZ COMPETITION</div>
          </div>
        </Link>

        {/* Desktop nav - PERMANENT Menu */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {/* Homepage Link */}
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-50"
            style={{
              color: pathname === "/" ? "var(--navy-950)" : "var(--muted)",
              fontWeight: pathname === "/" ? 700 : 500,
              borderBottom: pathname === "/" ? "2px solid var(--gold-500)" : "2px solid transparent",
              borderRadius: pathname === "/" ? "0" : "8px",
              paddingBottom: pathname === "/" ? "6px" : "8px",
            }}
          >
            Homepage
          </Link>

          {/* Student Link */}
          <button
            onClick={() => handlePortalSelect("student")}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-50"
            style={{
              color: (pathname.startsWith("/dashboard") && role === "student") ? "var(--navy-950)" : "var(--muted)",
              fontWeight: (pathname.startsWith("/dashboard") && role === "student") ? 700 : 500,
              borderBottom: (pathname.startsWith("/dashboard") && role === "student") ? "2px solid var(--gold-500)" : "2px solid transparent",
              borderRadius: (pathname.startsWith("/dashboard") && role === "student") ? "0" : "8px",
              paddingBottom: (pathname.startsWith("/dashboard") && role === "student") ? "6px" : "8px",
            }}
          >
            Student
          </button>

          {/* School Coordinator Link */}
          <button
            onClick={() => handlePortalSelect("school")}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-50"
            style={{
              color: (pathname.startsWith("/dashboard") && role === "school") ? "var(--navy-950)" : "var(--muted)",
              fontWeight: (pathname.startsWith("/dashboard") && role === "school") ? 700 : 500,
              borderBottom: (pathname.startsWith("/dashboard") && role === "school") ? "2px solid var(--gold-500)" : "2px solid transparent",
              borderRadius: (pathname.startsWith("/dashboard") && role === "school") ? "0" : "8px",
              paddingBottom: (pathname.startsWith("/dashboard") && role === "school") ? "6px" : "8px",
            }}
          >
            School Coordinator
          </button>

          {/* Admin Link */}
          <button
            onClick={() => handlePortalSelect("admin")}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-50"
            style={{
              color: (pathname.startsWith("/dashboard") && role === "admin") ? "var(--navy-950)" : "var(--muted)",
              fontWeight: (pathname.startsWith("/dashboard") && role === "admin") ? 700 : 500,
              borderBottom: (pathname.startsWith("/dashboard") && role === "admin") ? "2px solid var(--gold-500)" : "2px solid transparent",
              borderRadius: (pathname.startsWith("/dashboard") && role === "admin") ? "0" : "8px",
              paddingBottom: (pathname.startsWith("/dashboard") && role === "admin") ? "6px" : "8px",
            }}
          >
            Admin
          </button>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            style={{ color: "var(--navy-950)" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-4 py-4 flex flex-col gap-1" style={{ background: "#fff", borderColor: "var(--border)" }}>
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={pathname === "/" ? { background: "rgba(10,22,40,0.05)", color: "var(--navy-950)", fontWeight: 700 } : { color: "var(--muted)" }}
          >
            Homepage
          </Link>
          <button
            onClick={() => handlePortalSelect("student")}
            className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
            style={(pathname.startsWith("/dashboard") && role === "student") ? { background: "rgba(10,22,40,0.05)", color: "var(--navy-950)", fontWeight: 700 } : { color: "var(--muted)" }}
          >
            Student
          </button>
          <button
            onClick={() => handlePortalSelect("school")}
            className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
            style={(pathname.startsWith("/dashboard") && role === "school") ? { background: "rgba(10,22,40,0.05)", color: "var(--navy-950)", fontWeight: 700 } : { color: "var(--muted)" }}
          >
            School Coordinator
          </button>
          <button
            onClick={() => handlePortalSelect("admin")}
            className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
            style={(pathname.startsWith("/dashboard") && role === "admin") ? { background: "rgba(10,22,40,0.05)", color: "var(--navy-950)", fontWeight: 700 } : { color: "var(--muted)" }}
          >
            Admin
          </button>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <div className="h-16 border-b sticky top-0 z-50" style={{ background: "#fff", borderColor: "#e8edf5" }} />
    }>
      <NavbarInner />
    </Suspense>
  );
}

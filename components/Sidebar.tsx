"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRole } from "@/lib/RoleContext";
import {
  LayoutDashboard, Trophy, FileText, School, BookOpen, ClipboardList, User, X,
  Users, UserPlus, BarChart3, Clipboard
} from "lucide-react";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role } = useRole();

  let navItems = [];
  if (role === "admin") {
    navItems = [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "All Schools", href: "/schools", icon: School },
      { label: "All Candidates", href: "/results", icon: Users },
      { label: "Manage Quizzes", href: "/weekly-quiz", icon: Clipboard },
      { label: "State Analytics", href: "/dashboard?tab=state-analytics", icon: BarChart3 },
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { label: "Profile", href: "/profile", icon: User },
    ];
  } else if (role === "school") {
    navItems = [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Our Students", href: "/dashboard?tab=students", icon: Users },
      { label: "Register Candidates", href: "/dashboard?tab=register", icon: UserPlus },
      { label: "School Analytics", href: "/dashboard?tab=analytics", icon: BarChart3 },
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { label: "Profile", href: "/profile", icon: User },
    ];
  } else {
    // student
    navItems = [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Weekly Quiz", href: "/weekly-quiz", icon: BookOpen },
      { label: "Exam Portal", href: "/exam-portal", icon: ClipboardList },
      { label: "My Results", href: "/results", icon: FileText },
      { label: "Profile", href: "/profile", icon: User },
    ];
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          transition-transform duration-300
          lg:translate-x-0 lg:relative lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: 260, background: "var(--navy-950)", minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image src="/assets/brand/calabar_education_crest.png" alt="crest" fill className="object-contain" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight tracking-wide">SEN. ASUQUO EKPENYONG</div>
            <div className="text-white/50 text-xs tracking-widest">QUIZ COMPETITION</div>
          </div>
          <button className="ml-auto text-white/50 lg:hidden" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = (() => {
              const [baseHref, queryStr] = href.split("?");
              if (pathname !== baseHref) return false;
              if (queryStr) {
                const key = queryStr.split("=")[0];
                const val = queryStr.split("=")[1];
                return searchParams.get(key) === val;
              }
              if (baseHref === "/dashboard") {
                return !searchParams.get("tab");
              }
              return true;
            })();

            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-link ${active ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Motivation card */}
        <div className="mx-3 mb-5 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex justify-center pt-4">
            <div className="relative w-16 h-16">
              <Image src="/assets/illustrations/sidebar_trophy_badge.png" alt="trophy" fill className="object-contain" />
            </div>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-white/80 text-xs font-medium leading-relaxed">
              Excellence is not by chance,<br />it is by choice!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

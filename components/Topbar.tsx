"use client";

import Image from "next/image";
import { Bell, Menu, ChevronDown, UserCheck } from "lucide-react";
import { useRole, UserRole } from "@/lib/RoleContext";

interface TopbarProps {
  breadcrumb: string[];
  onMenuClick: () => void;
}

export default function Topbar({ breadcrumb, onMenuClick }: TopbarProps) {
  const { role, setRole } = useRole();

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 h-16 border-b"
      style={{ background: "#fff", borderColor: "var(--border)" }}
    >
      <button
        className="lg:hidden text-gray-500 hover:text-gray-800"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm flex-1">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span style={{ color: "var(--muted)" }}>/</span>}
            <span style={{ color: i === breadcrumb.length - 1 ? "var(--text)" : "var(--muted)" }} className={i === breadcrumb.length - 1 ? "font-semibold" : ""}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all hover:bg-gray-50" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <UserCheck size={14} className="text-blue-600" />
          <span style={{ color: "var(--muted)" }}>Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-transparent font-bold cursor-pointer outline-none border-none p-0 pr-1 capitalize text-xs"
            style={{ color: "var(--navy-950)" }}
          >
            <option value="student">Student</option>
            <option value="school">School Coordinator</option>
            <option value="admin">State Admin</option>
          </select>
        </div>

        <button className="relative" style={{ color: "var(--muted)" }}>
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold" style={{ background: "var(--rose-500)" }}>3</span>
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2" style={{ borderColor: "var(--border)" }}>
            <Image src="/assets/admin/admin_avatar_james_bassey.png" alt="James Bassey" fill className="object-cover" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight" style={{ color: "var(--text)" }}>James Bassey</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              {role === "admin" ? "State Administrator" : role === "school" ? "School Coordinator" : "Candidate"}
            </div>
          </div>
          <ChevronDown size={15} style={{ color: "var(--muted)" }} />
        </div>
      </div>
    </header>
  );
}

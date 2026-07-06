"use client";

import { useState, Suspense } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardShellProps {
  children: React.ReactNode;
  breadcrumb: string[];
}

export default function DashboardShell({ children, breadcrumb }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Suspense fallback={<div className="w-64 flex-shrink-0" style={{ background: "var(--navy-950)" }} />}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar breadcrumb={breadcrumb} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--surface)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

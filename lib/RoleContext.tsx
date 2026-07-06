"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "school" | "admin";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  portalSelected: boolean;
  setPortalSelected: (selected: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("student");
  const [portalSelected, setPortalSelectedState] = useState<boolean>(false);

  // Load from localStorage on client-side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_role");
      if (saved === "student" || saved === "school" || saved === "admin") {
        setRoleState(saved);
      }
      const savedPortal = localStorage.getItem("portal_selected");
      if (savedPortal === "true") {
        setPortalSelectedState(true);
      }
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_role", newRole);
    }
  };

  const setPortalSelected = (selected: boolean) => {
    setPortalSelectedState(selected);
    if (typeof window !== "undefined") {
      localStorage.setItem("portal_selected", selected ? "true" : "false");
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, portalSelected, setPortalSelected }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}


import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LogOut, Users, FileText } from "lucide-react";
import { useOwner } from "@/lib/OwnerContext";
import OwnerWelcomePopup from "@/components/owner/OwnerWelcomePopup";

export default function OwnerLayout() {
  const { lock } = useOwner();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors border border-transparent ${
      isActive ? "bg-ink text-paper border-ink" : "text-ink/60 hover:text-ink hover:bg-ink/5 border-ink/10"
    }`;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <OwnerWelcomePopup />
      <header className="border-b border-ink/10 sticky top-0 z-10 bg-paper/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <h1 className="font-syne font-bold uppercase tracking-tight text-lg">Owner</h1>
            <nav className="flex gap-1 border border-ink/10 p-1 flex-wrap">
              <NavLink to="/owner" end className={linkClass}>
                <Users className="w-3.5 h-3.5" />
                Dashboard
              </NavLink>
              <NavLink to="/owner/profile" className={linkClass}>
                <FileText className="w-3.5 h-3.5" />
                Site profile
              </NavLink>
            </nav>
            <span className="hidden sm:inline text-ink/20 font-mono text-xs">|</span>
            <span className="font-mono text-[10px] text-ink/40 uppercase tracking-widest hidden sm:inline">
              Home · About · Contact · Footer
            </span>
          </div>
          <button
            type="button"
            onClick={() => lock()}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink/50 hover:text-ink border border-ink/15 px-3 py-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

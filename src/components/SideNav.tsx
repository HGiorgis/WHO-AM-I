import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, FolderGit2, FileText, Mail, ChevronRight } from "lucide-react";

export const SideNav: React.FC = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", to: "/", icon: Home },
    { id: "projects", label: "Projects", to: "/projects", icon: FolderGit2 },
    { id: "blog", label: "Blog", to: "/blog", icon: FileText },
    { id: "contact", label: "Contact", to: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* MOBILE ARROW (only visible when menu is closed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed left-3 top-1/2 -translate-y-1/2 z-50
            md:hidden
            w-9 h-16 flex items-center justify-center
            rounded-xl
            bg-white/10 backdrop-blur-xl border border-white/20
            opacity-70 hover:opacity-100
            transition-all duration-300
          "
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>
      )}

      {/* BACKDROP (click to close) */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40
          md:hidden
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* SIDENAV */}
      <div
        className={`
          fixed left-6 top-1/2 -translate-y-1/2 z-50
          flex flex-col gap-6 
          p-4 rounded-3xl
          bg-white/5 backdrop-blur-xl border border-white/10
          shadow-xl shadow-black/20
          transition-transform duration-500

          /* Desktop = unchanged */
          md:translate-x-0

          /* Mobile = sliding animation */
          ${open ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"}
        `}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => setOpen(false)} // Close on nav item click (mobile only)
              className={({ isActive }) =>
                `
                group relative flex items-center justify-center
                p-3 rounded-2xl transition-all duration-300

                ${
                  isActive
                    ? "bg-cyan-500/20 border border-cyan-400/40 scale-110"
                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110"
                }
              `
              }
            >
              <Icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />

              {/* Hover Label (unchanged, desktop only) */}
              <span className="
                absolute left-14 px-3 py-1 rounded-xl
                bg-black/70 text-gray-200 text-xs
                opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0
                pointer-events-none whitespace-nowrap
              ">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </> 
  );
};

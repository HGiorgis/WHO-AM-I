import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { trackEvent } from "@/api/trackApi";
import SiteMark from "@/components/brand/SiteMark";

const navLinks = [
  { label: "Home", path: "/Home", num: "01" },
  { label: "About", path: "/About", num: "02" },
  { label: "Projects", path: "/Projects", num: "03" },
  { label: "Contact", path: "/Contact", num: "04" },
];

export default function NavbarNew() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 mix-blend-multiply">
        <Link
          to="/Home"
          aria-label="HGIORGIS — home"
          className="font-mono text-xs tracking-[0.3em] uppercase text-ink font-bold flex items-center gap-3"
        >
          <SiteMark
            className="w-8 h-8 shrink-0 rounded-lg shadow-sm"
            title="HGIORGIS"
            aria-hidden
          />
          <span className="flex flex-col leading-tight">
            <span>HGIORGIS</span>
            <span className="text-[10px] tracking-[0.25em] text-ink/40 font-normal normal-case">
              Whoami
            </span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 border border-[#2ecc71]/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-pulse" />
            <span className="font-mono text-[9px] text-[#2ecc71] uppercase tracking-widest">
              Available
            </span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col gap-[5px] group"
          aria-label="Open menu"
        >
          <span className="block w-6 h-[2px] bg-ink transition-all group-hover:w-8" />
          <span className="block w-8 h-[2px] bg-ink transition-all" />
          <span className="block w-5 h-[2px] bg-ink transition-all group-hover:w-8" />
        </button>
      </header>

      {/* Full screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[200] bg-ink flex items-center justify-center"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-6 md:right-10 text-paper"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="flex flex-col gap-2 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 60, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    to={link.path}
                    onClick={() => {
                      trackEvent(
                        "click",
                        `nav:${link.path}`,
                        location.pathname,
                      );
                      setOpen(false);
                    }}
                    className="group flex items-center gap-4 px-10 py-3"
                  >
                    <span className="font-mono text-xs text-paper/30">
                      {link.num}
                    </span>
                    <span
                      className={`font-syne font-bold uppercase tracking-tight leading-none transition-colors ${
                        location.pathname === link.path
                          ? "text-[#f5c842]"
                          : "text-paper group-hover:text-[#f5c842]"
                      }`}
                      style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
                    >
                      {link.label}
                    </span>
                    <ArrowUpRight className="w-6 h-6 text-paper/30 group-hover:text-[#f5c842] transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <p className="font-mono text-xs text-paper/30 uppercase tracking-widest">
                Full-Stack · DevOps · Architect
              </p>
              <p className="font-mono text-xs text-paper/30">
                © {new Date().getFullYear()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

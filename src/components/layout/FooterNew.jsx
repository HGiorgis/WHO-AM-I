import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import MarqueeBand from "./MarqueeBand";
import SiteMark from "@/components/brand/SiteMark";
import { fetchContactInfo } from "@/api/portfolioApi";

const NAV = [
  ["Home", "/Home"],
  ["About", "/About"],
  ["Projects", "/Projects"],
  ["Contact", "/Contact"],
];

const fallbackContact = {
  email: "hello@yourname.dev",
  location: "San Francisco, CA",
  status: "Available for new projects",
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

export default function FooterNew() {
  const [info, setInfo] = useState(fallbackContact);

  useEffect(() => {
    fetchContactInfo()
      .then((data) => {
        if (data && (data.email || data.socials?.length)) {
          setInfo({ ...fallbackContact, ...data });
        }
      })
      .catch(() => {});
  }, []);

  const emailHref = info.email ? `mailto:${info.email}` : "#";

  return (
    <footer className="bg-ink text-paper">
      <MarqueeBand inverted />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <p className="font-mono text-xs text-paper/30 uppercase tracking-widest mb-4">
              Navigation
            </p>
            <nav className="space-y-2">
              {NAV.map(([l, p]) => (
                <Link
                  key={p}
                  to={p}
                  className="flex items-center gap-1 text-paper/70 hover:text-paper transition-colors font-grotesk text-sm group"
                >
                  {l}{" "}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="font-mono text-xs text-paper/30 uppercase tracking-widest mb-4">
              Connect
            </p>
            <div className="space-y-2">
              {(info.socials || []).map((s) => (
                <a
                  key={`${s.label}-${s.href}`}
                  href={s.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-paper/70 hover:text-[#f5c842] transition-colors font-grotesk text-sm group"
                >
                  {s.label || "Link"}{" "}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
              {info.email && (
                <a
                  href={emailHref}
                  className="flex items-center gap-1 text-paper/70 hover:text-[#f5c842] transition-colors font-grotesk text-sm group"
                >
                  Email ({info.email}){" "}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              )}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs text-paper/30 uppercase tracking-widest mb-4">
              Status
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse" />
              <span className="text-sm text-paper/70">{info.status || "—"}</span>
            </div>
            <p className="text-xs text-paper/30 font-mono">
              {info.location || "—"}
            </p>
          </div>
        </div>
        <div className="border-t border-paper/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            to="/Home"
            aria-label="Whoami — home"
            className="flex items-center gap-3 font-syne font-bold text-2xl tracking-tight text-paper hover:text-[#f5c842] transition-colors"
          >
            <SiteMark className="w-10 h-10 rounded-lg shrink-0" aria-hidden />
            <span>WHOAMI</span>
          </Link>
          <p className="font-mono text-xs text-paper/30">
            © {new Date().getFullYear()} — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

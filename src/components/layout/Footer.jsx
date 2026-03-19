import React from "react";
import { Link } from "react-router-dom";
import { Terminal, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/Home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold">
              <span className="text-primary">&lt;</span>Dev
              <span className="text-primary">/&gt;</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

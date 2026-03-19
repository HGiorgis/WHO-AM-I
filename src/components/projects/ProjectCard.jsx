import React from "react";
import GlassCard from "../layout/GlassCard";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project, delay = 0 }) {
  return (
    <GlassCard delay={delay} className="overflow-hidden group">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary/10 via-secondary to-accent/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10" />
        <span className="text-5xl font-bold text-primary/20 group-hover:scale-110 transition-transform duration-500">
          {project.title.charAt(0)}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-md bg-secondary/60 border border-border/50 text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border/30">
          <a
            href="#"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-3.5 h-3.5" /> Code
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
          </a>
        </div>
      </div>
    </GlassCard>
  );
}

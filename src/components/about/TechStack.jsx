import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../layout/GlassCard";

const categories = [
  {
    title: "Frontend",
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Python", "Go", "PostgreSQL", "Redis"],
  },
  {
    title: "DevOps",
    items: ["Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins"],
  },
  {
    title: "Cloud",
    items: ["AWS", "GCP", "Azure", "Cloudflare", "Vercel"],
  },
];

export default function TechStack() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((cat, i) => (
        <GlassCard key={cat.title} delay={i * 0.1} className="p-6">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            {cat.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {cat.items.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 text-sm rounded-lg bg-secondary/60 border border-border/50 text-foreground/80"
              >
                {item}
              </span>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

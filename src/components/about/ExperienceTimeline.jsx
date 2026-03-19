import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Senior DevOps Engineer",
    company: "Cloud Solutions Inc.",
    period: "2022 – Present",
    description:
      "Leading cloud infrastructure and CI/CD pipeline automation for enterprise clients.",
  },
  {
    role: "Full-Stack Developer & Architect",
    company: "TechForge Labs",
    period: "2019 – 2022",
    description:
      "Designed and built scalable microservice architectures serving 10M+ users.",
  },
  {
    role: "System Engineer",
    company: "DataStream Corp",
    period: "2017 – 2019",
    description:
      "Managed server infrastructure, optimized performance, and ensured 99.99% uptime.",
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="space-y-6">
      {experiences.map((exp, i) => (
        <motion.div
          key={exp.role}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          className="relative pl-8 border-l border-border/50"
        >
          <div className="absolute left-0 top-1 -translate-x-1/2 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-xs text-primary font-medium mb-1">{exp.period}</p>
          <h3 className="text-lg font-semibold">{exp.role}</h3>
          <p className="text-sm text-muted-foreground mb-1">{exp.company}</p>
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            {exp.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

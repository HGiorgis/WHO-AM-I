import React from "react";
import { Code2, Server, Cloud, GitBranch } from "lucide-react";
import GlassCard from "../layout/GlassCard";
import { motion } from "framer-motion";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Building modern, responsive web applications with React, Next.js, and cutting-edge frontend technologies.",
    tags: ["React", "TypeScript", "Node.js"],
  },
  {
    icon: Server,
    title: "System Engineering",
    description:
      "Designing robust server architectures, databases, and backend systems that handle millions of requests.",
    tags: ["Linux", "PostgreSQL", "Redis"],
  },
  {
    icon: Cloud,
    title: "Cloud Architecture",
    description:
      "Architecting scalable cloud solutions on AWS, GCP, and Azure with focus on cost optimization.",
    tags: ["AWS", "Terraform", "Microservices"],
  },
  {
    icon: GitBranch,
    title: "DevOps & CI/CD",
    description:
      "Implementing automated pipelines, containerization, and infrastructure as code for seamless delivery.",
    tags: ["Docker", "Kubernetes", "GitHub Actions"],
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">
            What I Do
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Expertise & Services
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <GlassCard key={service.title} delay={i * 0.1} className="p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <service.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

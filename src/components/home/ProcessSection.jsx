import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Discover",
    desc: "Deep dive into your requirements, constraints, and goals. No guessing — only clarity.",
    color: "#e84040",
  },
  {
    num: "02",
    title: "Architect",
    desc: "Design clean system architecture, data models, and API contracts before a single line of code.",
    color: "#f5c842",
  },
  {
    num: "03",
    title: "Build",
    desc: "Iterative development with continuous feedback. Production-ready code, clean and maintainable.",
    color: "#4fa3e0",
  },
  {
    num: "04",
    title: "Deploy",
    desc: "Docker, CI/CD pipelines, cloud infra, monitoring — shipped and running with zero drama.",
    color: "#2ecc71",
  },
];

export default function ProcessSection() {
  return (
    <section className="border-t border-ink/10 py-20 px-6 md:px-10 bg-ink text-paper">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-paper/30 mb-3">
              How I Work
            </p>
            <h2
              className="font-syne font-bold uppercase leading-none text-paper"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              THE <span className="text-[#f5c842]">PROCESS</span>
            </h2>
          </div>
          <p className="text-sm text-paper/40 max-w-xs leading-relaxed">
            A structured, no-surprises workflow from idea to production.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-paper/10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-ink p-7 group hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] text-paper/25 uppercase tracking-widest">
                  {step.num}
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: step.color }}
                />
              </div>
              <h3
                className="font-syne font-bold uppercase mb-3 transition-colors"
                style={{ fontSize: "1.3rem", color: "white" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-paper/45 leading-relaxed">
                {step.desc}
              </p>

              {/* Step connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 w-px h-8 bg-paper/10 -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

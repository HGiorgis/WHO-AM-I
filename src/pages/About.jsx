import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MarqueeBand from "../components/layout/MarqueeBand";
import { fetchAbout } from "@/api/portfolioApi";

function SkillBar({ name, level, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-grotesk text-sm font-medium">{name}</span>
        <span className="font-mono text-xs text-ink/40">{level}%</span>
      </div>
      <div className="h-[3px] bg-ink/8 w-full relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: delay + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute top-0 left-0 h-full"
          style={{ background: color }}
        />
      </div>
    </motion.div>
  );
}

const skillsFallback = [
  { name: "Laravel / PHP", level: 95, color: "#e84040" },
  { name: "Django / Python", level: 92, color: "#f5c842" },
  { name: "Node.js / JavaScript", level: 90, color: "#4fa3e0" },
  { name: "React / Frontend", level: 85, color: "#2ecc71" },
  { name: "Docker & CI/CD", level: 93, color: "#e84040" },
  { name: "API Design & Security", level: 96, color: "#f5c842" },
  { name: "Encryption & Zero-Knowledge", level: 88, color: "#4fa3e0" },
  { name: "Cloud Infrastructure", level: 89, color: "#2ecc71" },
];

const stackFallback = [
  {
    cat: "Backend",
    items: ["Laravel", "Django", "Node.js", "Python", "PHP", "Go"],
  },
  {
    cat: "Frontend",
    items: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
  },
  {
    cat: "DevOps",
    items: ["Docker", "Nginx", "CI/CD", "GitHub Actions", "Linux"],
  },
  {
    cat: "Data & Cloud",
    items: ["MySQL", "PostgreSQL", "Redis", "AWS S3", "Cloud VPS"],
  },
];

const expFallback = [
  {
    role: "Full-Stack & Backend Engineer",
    co: "Independent / Freelance",
    period: "Present",
    color: "#e84040",
    desc: "End-to-end delivery: APIs, SaaS-style products, security-conscious design, and DevOps — Laravel, Django, React, Docker & cloud.",
  },
  {
    role: "Systems & integration focus",
    co: "Client projects",
    period: "—",
    color: "#f5c842",
    desc: "Backend architecture, third-party integrations, performance, and maintainable deployments.",
  },
];

export default function About() {
  const [skills, setSkills] = useState(skillsFallback);
  const [stack, setStack] = useState(stackFallback);
  const [exp, setExp] = useState(expFallback);

  useEffect(() => {
    fetchAbout()
      .then((data) => {
        if (data?.skills?.length) setSkills(data.skills);
        if (data?.stack?.length) setStack(data.stack);
        if (data?.experience?.length) setExp(data.experience);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Header */}
      <section className="pt-32 pb-0 px-6 md:px-10 border-b border-ink/10">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-6"
          >
            02 — About
          </motion.p>
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-syne font-bold uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              THE
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-syne font-bold uppercase leading-none tracking-tight text-[#e84040]"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              ENGINEER
            </motion.h1>
          </div>
        </div>
      </section>

      <MarqueeBand />

      {/* Bio + Skills */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-6">
              Profile
            </p>
            <p className="text-lg leading-relaxed text-ink/80 mb-6">
              <span className="font-bold text-ink">HGIORGIS</span> —
              Hailegiorgis Wagaye: engineer focused on{" "}
              <span className="font-bold text-ink">
                secure, scalable systems
              </span>{" "}
              and clear architecture you can grow with.
            </p>
            <p className="text-sm leading-relaxed text-ink/55 mb-6">
              Production-ready backends and full-stack product work with{" "}
              <strong className="text-ink">
                Laravel, Django, Node.js, and React
              </strong>
              , plus Docker, CI/CD, and pragmatic cloud deployment.
            </p>
            <p className="text-sm leading-relaxed text-ink/55 mb-10">
              From SaaS-style platforms and APIs to verification flows,
              analytics, and cryptography-heavy features — collaborating with
              teams that need reliability and maintainability. Works with
              startups and growing teams to turn complex requirements into
              reliable, well-structured systems that are built to scale.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                ["Focus", "Backend & SaaS Architecture"],
                ["Security", "Zero-Knowledge & Encryption"],
                ["DevOps", "Docker, CI/CD, Cloud"],
                ["Mindset", "Clean Code, Built to Scale"],
              ].map(([k, v]) => (
                <div key={k} className="border-l-2 border-ink/10 pl-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-1">
                    {k}
                  </p>
                  <p className="font-grotesk text-sm font-medium text-ink/80">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-6">
              Core Skills
            </p>
            <div className="space-y-6">
              {skills.map((s, i) => (
                <SkillBar key={s.name} {...s} delay={i * 0.06} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-ink/10 py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-12">
            Experience
          </p>
          <div className="divide-y divide-ink/10">
            {exp.map((e, i) => (
              <motion.div
                key={e.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="py-8 grid md:grid-cols-3 gap-4 group"
              >
                <div className="flex items-start gap-4 md:col-span-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 mt-2"
                    style={{ background: e.color }}
                  />
                  <div>
                    <h3
                      className="font-syne font-bold uppercase tracking-tight group-hover:text-[#e84040] transition-colors"
                      style={{ fontSize: "clamp(1rem, 2.5vw, 1.6rem)" }}
                    >
                      {e.role}
                    </h3>
                    <p className="text-sm text-ink/50 mt-1 mb-3">{e.co}</p>
                    <p className="text-sm text-ink/50 leading-relaxed">
                      {e.desc}
                    </p>
                  </div>
                </div>
                <div className="flex md:justify-end items-start">
                  <span className="font-mono text-sm text-ink/35">
                    {e.period}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-t border-ink/10 bg-ink text-paper py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/30 mb-12">
            Tech Stack
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            {stack.map((s, i) => (
              <motion.div
                key={s.cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-widest mb-4"
                  style={{
                    color: ["#e84040", "#f5c842", "#4fa3e0", "#2ecc71"][i],
                  }}
                >
                  {s.cat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 text-xs border border-paper/10 text-paper/60 hover:border-paper/40 hover:text-paper transition-colors cursor-default font-mono"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 border-t border-paper/10 pt-16 max-w-3xl"
          >
            <p className="font-syne font-bold text-2xl md:text-3xl text-paper/80 leading-snug">
              "Works with startups and growing teams to turn complex
              requirements into reliable,{" "}
              <span className="text-[#f5c842]">
                well-structured systems that are built to scale.
              </span>
              "
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

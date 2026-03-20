import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowDown,
  ShieldCheck,
  Server,
  Key,
  Link2,
  FileText,
  BarChart2,
  Lock,
  Cpu,
} from "lucide-react";
import SiteMark from "@/components/brand/SiteMark";
import SquareFlowLoader from "@/components/ui/SquareFlowLoader";
import MarqueeBand from "../components/layout/MarqueeBand";
import ProcessSection from "../components/home/ProcessSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import TypedRole from "../components/home/TypedRole";
import { fetchHome } from "@/api/portfolioApi";

const panelsFallback = [
  { num: "01", tag: "BACKEND", title: ["SAAS", "ARCHITECT"], sub: "Building subscription platforms, user management systems, and scalable backend APIs with Laravel & Django.", accent: "#e84040", shape: "circle" },
  { num: "02", tag: "SECURITY", title: ["ZERO-KNOWLEDGE", "SYSTEMS"], sub: "Designing end-to-end encrypted vaults, KYC verification services, and client-side crypto applications.", accent: "#f5c842", shape: "square" },
  { num: "03", tag: "DEVOPS", title: ["HIGH-AVAILABILITY", "INFRA"], sub: "Deploying containerized systems with CI/CD pipelines, Nginx load balancing, and cloud infrastructure.", accent: "#4fa3e0", shape: "diamond" },
];

function AnimTitle({ lines, accent }) {
  return (
    <div>
      {lines.map((line, li) => (
        <div key={li} className="overflow-hidden">
          <motion.p
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: li * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-syne font-bold uppercase leading-none"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
          >
            {li === 1 ? <span style={{ color: accent }}>{line}</span> : line}
          </motion.p>
        </div>
      ))}
    </div>
  );
}

function Shape({ type, color }) {
  const base = "absolute pointer-events-none";
  if (type === "circle")
    return (
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`${base} w-14 h-14 rounded-full top-8 right-8`}
        style={{ background: color, opacity: 0.8 }}
      />
    );
  if (type === "square")
    return (
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className={`${base} w-10 h-10 top-8 right-10`}
        style={{ background: color, opacity: 0.8 }}
      />
    );
  return (
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [45, 55, 45] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      className={`${base} w-12 h-12 top-6 right-8`}
      style={{ background: color, opacity: 0.8, transform: "rotate(45deg)" }}
    />
  );
}

function PanelItem({ panel, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex flex-col justify-between p-8 md:p-10 border-r border-ink/10 last:border-r-0 min-h-[70vh] md:min-h-[60vh] group cursor-pointer"
      data-cursor
    >
      <motion.div
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 1, background: panel.accent }}
        className="absolute inset-0 opacity-5 pointer-events-none"
      />

      <Shape type={panel.shape} color={panel.accent} />

      <div className="flex items-center justify-between mb-10">
        <span className="font-mono text-xs text-ink/30">{panel.num}</span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border"
          style={{ borderColor: panel.accent, color: panel.accent }}
        >
          {panel.tag}
        </span>
      </div>

      <div className="flex justify-center my-4">
        <div
          className="w-32 h-32 rounded-full border-4 overflow-hidden flex items-center justify-center bg-ink/5 relative group-hover:scale-105 transition-transform duration-500"
          style={{ borderColor: panel.accent }}
        >
          <span
            className="font-syne font-bold text-5xl"
            style={{ color: panel.accent, opacity: 0.35 }}
          >
            {panel.num}
          </span>
          <svg
            className="absolute inset-0 w-full h-full animate-spin-slow"
            viewBox="0 0 128 128"
            fill="none"
          >
            <circle
              cx="64"
              cy="64"
              r="62"
              stroke={panel.accent}
              strokeWidth="1"
              strokeDasharray="6 8"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      <div className="mt-6">
        <AnimTitle lines={panel.title} accent={panel.accent} />
      </div>

      <div className="mt-6">
        <Link
          to="/About"
          className="inline-flex items-center justify-center w-10 h-10 border border-ink/20 rounded-full hover:bg-ink hover:text-paper transition-all group/btn mr-3"
        >
          <ArrowDown className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
        </Link>
        <span className="text-xs text-ink/40 font-mono">Explore</span>
      </div>

      <p className="mt-5 text-sm text-ink/50 leading-relaxed">{panel.sub}</p>
    </motion.div>
  );
}

/* ─── Hero ─────────────────────────────────── */
function Hero() {
  const { scrollYProgress } = useScroll();
  const yTitle = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-0 pt-24 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <p
          className="font-syne font-bold uppercase text-ink/[0.03] whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 22vw, 20rem)",
            letterSpacing: "-0.04em",
          }}
        >
          BACKEND
        </p>
      </div>

      <motion.div
        style={{ y: yTitle, opacity }}
        className="max-w-7xl mx-auto px-6 md:px-10 w-full pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-xl border border-[#e84040]/25"
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <SiteMark className="w-14 h-14 md:w-16 md:h-16 rounded-xl shadow-md relative z-10" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-ink/35 uppercase tracking-[0.35em] mb-1">
              Identity mark
            </p>
            <p className="font-mono text-xs text-ink/50 uppercase tracking-[0.35em]">
              Portfolio — 2024
            </p>
          </div>
        </motion.div>
        <div className="mb-6">
          <TypedRole />
        </div>

        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-bold uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
          >
            BACKEND
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-2 flex items-end gap-6 flex-wrap">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-bold uppercase leading-none tracking-tight text-[#e84040]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
          >
            ARCHITECT
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="w-5 h-5 rounded-full bg-[#f5c842] mb-4 hidden md:block"
          />
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-bold uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
          >
            &amp; DEVOPS
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-10 gap-6"
        >
          <p className="text-sm text-ink/50 max-w-sm leading-relaxed">
            Building secure, scalable SaaS platforms, verification systems, and
            high-availability infrastructure for startups.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/Projects"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-ink text-paper px-6 py-3 hover:bg-[#e84040] transition-colors"
            >
              View Work <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/Contact"
              className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
            >
              Hire Me
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="w-[1px] h-10 bg-ink/20"
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/30">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

function PanelsSection({ panels = panelsFallback }) {
  const list = Array.isArray(panels) && panels.length ? panels : panelsFallback;
  return (
    <section className="border-t border-ink/10">
      <div className="grid md:grid-cols-3">
        {list.map((p, i) => (
          <PanelItem key={p.num || i} panel={p} index={i} />
        ))}
      </div>
    </section>
  );
}

const worksFallback = [
  { title: "KYC Verification Service", cat: "Security · Django", year: "2024", icon: ShieldCheck, color: "#e84040" },
  { title: "LinkFlow — Redirect & Pixel Tracking", cat: "Node.js · Tracking", year: "2024", icon: Link2, color: "#f5c842" },
  { title: "Sankrypt — Zero-Knowledge Vault", cat: "Security · Encryption", year: "2023", icon: Key, color: "#4fa3e0" },
  { title: "HA Laravel Infrastructure", cat: "DevOps · Docker · CI/CD", year: "2022",
    icon: Cpu,
    color: "#2ecc71",
  },
];

function SelectedWork({ works = worksFallback }) {
  const list = Array.isArray(works) && works.length ? works : worksFallback;
  return (
    <section className="border-t border-ink/10 py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
            Selected Work
          </p>
          <Link
            to="/Projects"
            className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-ink/60 hover:text-ink transition-colors"
          >
            All 8 Projects <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-ink/10">
          {list.map((w, i) => {
            const Icon = w.icon || Server;
            return (
            <motion.div
              key={w.title || i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex items-center justify-between py-6 group cursor-pointer"
              data-cursor
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-xs text-ink/30 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="w-8 h-8 border flex items-center justify-center shrink-0 transition-all group-hover:border-current"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: w.color || "#0f0f0f" }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h3
                  className="font-syne font-bold uppercase tracking-tight group-hover:text-[#e84040] transition-colors"
                  style={{ fontSize: "clamp(1rem, 2.5vw, 1.8rem)" }}
                >
                  {w.title}
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <span className="hidden sm:block font-mono text-xs text-ink/40">
                  {w.cat}
                </span>
                <span className="font-mono text-xs text-ink/30">{w.year}</span>
                <ArrowUpRight className="w-4 h-4 text-ink/25 group-hover:text-[#e84040] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </motion.div>
          ); })}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ─────────────────────────────────── */
function Stats() {
  const data = [
    { val: "8+", label: "Projects Shipped" },
    { val: "3", label: "Core Frameworks" },
    { val: "99.9%", label: "Uptime Record" },
    { val: "∞", label: "Lines of Code" },
  ];

  return (
    <section className="bg-ink text-paper border-t border-paper/10 py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-paper/10">
        {data.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="px-6 py-8 first:pl-0 last:pr-0"
          >
            <p
              className="font-syne font-bold leading-none mb-2"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: ["#e84040", "#f5c842", "#4fa3e0", "#2ecc71"][i],
              }}
            >
              {d.val}
            </p>
            <p className="font-mono text-xs text-paper/40 uppercase tracking-widest">
              {d.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Services Strip ────────────────────────── */
function ServicesStrip() {
  const services = [
    { icon: Server, label: "SaaS Platforms", desc: "Laravel · Django · React" },
    {
      icon: ShieldCheck,
      label: "Verification Systems",
      desc: "KYC · OCR · Face Match",
    },
    {
      icon: Key,
      label: "Encryption Apps",
      desc: "Zero-Knowledge · Crypto APIs",
    },
    { icon: Cpu, label: "DevOps & Infra", desc: "Docker · CI/CD · Nginx" },
    {
      icon: FileText,
      label: "Automation",
      desc: "PDF · Google Sheets · Scripts",
    },
    {
      icon: BarChart2,
      label: "Analytics & Reporting",
      desc: "Data Viz · Dashboards",
    },
  ];

  return (
    <section className="border-t border-ink/10 py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-10">
          What I Build
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-ink/8">
          {services.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-paper p-7 group hover:bg-ink/[0.02] transition-colors cursor-default"
            >
              <s.icon className="w-5 h-5 mb-4 text-ink/40 group-hover:text-[#e84040] transition-colors" />
              <h3 className="font-syne font-bold uppercase text-base mb-1">
                {s.label}
              </h3>
              <p className="font-mono text-xs text-ink/40">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [panels, setPanels] = useState(panelsFallback);
  const [works, setWorks] = useState(worksFallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHome()
      .then((data) => {
        if (data?.panels?.length) setPanels(data.panels);
        if (data?.works?.length) {
          setWorks(
            data.works.map((w) => ({ ...w, icon: w.icon || Server }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />
      <MarqueeBand />
      {loading ? (
        <section className="border-t border-ink/10 py-20 flex flex-col items-center justify-center gap-4">
          <SquareFlowLoader size="md" />
          <span className="font-mono text-xs text-ink/40">Loading panels…</span>
        </section>
      ) : (
        <>
          <PanelsSection panels={panels} />
          <ServicesStrip />
          <SelectedWork works={works} />
        </>
      )}
      <ProcessSection />
      <TestimonialsSection />
      <Stats />
    </>
  );
}

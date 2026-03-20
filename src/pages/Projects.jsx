import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  X,
  Link2,
  ShieldCheck,
  Server,
  Cpu,
  Key,
} from "lucide-react";
import MarqueeBand from "../components/layout/MarqueeBand";
import { fetchProjects } from "@/api/portfolioApi";
import { trackEvent } from "@/api/trackApi";
import SquareFlowLoader from "@/components/ui/SquareFlowLoader";

const ICON_MAP = {
  django: ShieldCheck,
  security: ShieldCheck,
  laravel: Server,
  react: Link2,
  node: Link2,
  encryption: Key,
  docker: Cpu,
  cicd: Cpu,
  default: Server,
};

function normalizeFeatureHighlights(raw) {
  const list = Array.isArray(raw) ? raw.map((x) => (x && typeof x === "object" ? x : {})) : [];
  const out = [];
  for (let i = 0; i < 3; i++) {
    const h = list[i] || {};
    out.push({
      title: h.title || `Highlight ${i + 1}`,
      body: h.body || h.text || h.desc || "",
      image: typeof h.image === "string" ? h.image : h.img || "",
    });
  }
  return out;
}

function mapApiProjectToUi(p, index) {
  const firstTag = p.tags && p.tags[0] ? p.tags[0].toLowerCase() : "";
  const Icon = ICON_MAP[firstTag] || ICON_MAP.default;
  const gallery = Array.isArray(p.gallery_images) ? p.gallery_images : [];
  return {
    id: p.id,
    num: String(index + 1).padStart(2, "0"),
    title: p.title,
    subtitle: p.subtitle || "",
    desc: p.description || p.desc || "",
    year: p.year || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    color: p.color || "#0f0f0f",
    icon: Icon,
    featured: !!p.featured,
    cat: firstTag || "fullstack",
    liveUrl: p.live_url || p.liveUrl,
    githubUrl: p.github_url || p.githubUrl,
    coverImage: p.cover_image || p.coverImage || "",
    galleryImages: gallery.filter(Boolean).slice(0, 2),
    featureHighlights: normalizeFeatureHighlights(p.feature_highlights || p.featureHighlights),
  };
}

const cats = [
  { key: "all", label: "All" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "systems", label: "Systems" },
  { key: "security", label: "Security" },
  { key: "devops", label: "DevOps" },
  { key: "automation", label: "Automation" },
];

function ProjectDetailPopup({ project, onClose }) {
  if (!project) return null;
  const Icon = project.icon;
  const thumbs = project.galleryImages || [];
  const features = project.featureHighlights || normalizeFeatureHighlights([]);

  const handleLiveClick = (e) => {
    e.stopPropagation();
    trackEvent("click", `project_live:${project.title}`, "/Projects");
    window.open(project.liveUrl, "_blank", "noopener,noreferrer");
  };
  const handleGithubClick = (e) => {
    e.stopPropagation();
    trackEvent("click", `project_github:${project.title}`, "/Projects");
    window.open(project.githubUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-paper border border-ink/15 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col"
      >
        <div className="relative flex-shrink-0 border-b border-ink/10">
          {project.coverImage ? (
            <div className="relative aspect-[21/9] min-h-[200px] max-h-[46vh] w-full overflow-hidden bg-ink/5">
              <img
                src={project.coverImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
                style={{ backgroundColor: project.color }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
            </div>
          ) : (
            <div
              className="h-28 w-full opacity-90"
              style={{
                background: `linear-gradient(135deg, ${project.color}33 0%, transparent 70%), var(--paper, #faf8f5)`,
              }}
            />
          )}
          <div className="p-5 md:p-7 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-12 h-12 flex items-center justify-center border shrink-0 bg-paper"
                style={{ borderColor: project.color, color: project.color }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-syne font-bold uppercase tracking-tight text-xl md:text-2xl text-ink">
                  {project.title}
                </h2>
                {project.subtitle && (
                  <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest mt-0.5">
                    {project.subtitle}
                  </p>
                )}
                <p className="font-mono text-xs text-ink/40 mt-1">{project.year}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-ink/50 hover:text-ink transition-colors shrink-0 border border-ink/10 bg-paper"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 md:p-7 overflow-y-auto flex-1 space-y-6">
          {thumbs.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {thumbs.map((url, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden border border-ink/10 bg-ink/[0.03] aspect-[4/3]"
                >
                  <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-ink/80 leading-relaxed">{project.desc}</p>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-3">
              Project highlights (3)
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="border border-ink/12 overflow-hidden flex flex-col bg-paper hover:border-ink/25 transition-colors"
                >
                  <div className="relative aspect-[16/10] bg-ink/5 shrink-0">
                    {f.image ? (
                      <img src={f.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-40"
                        style={{ background: `linear-gradient(160deg, ${project.color}44, transparent)` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: project.color }} />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity pointer-events-none"
                      style={{ backgroundColor: project.color }}
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-syne font-bold uppercase text-xs tracking-tight text-ink leading-tight">
                      {f.title}
                    </h3>
                    <p className="font-mono text-[10px] text-ink/55 mt-2 leading-relaxed flex-1">
                      {f.body || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-[11px] border border-ink/15 text-ink/60 font-mono"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveClick}
                className="inline-flex items-center gap-2 px-4 py-3 border border-ink/20 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGithubClick}
                className="inline-flex items-center gap-2 px-4 py-3 border border-ink/20 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                View code
              </a>
            )}
            {!project.liveUrl && !project.githubUrl && (
              <span className="font-mono text-xs text-ink/40">No links for this project.</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeaturedCard({ project, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const Icon = project.icon;

  const handleClick = () => {
    trackEvent("click", `project_detail_open:${project.title}`, "/Projects");
    onSelect?.(project);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="border border-ink/10 relative overflow-hidden group cursor-pointer flex flex-col"
      data-cursor
    >
      {project.coverImage ? (
        <div className="relative h-44 w-full overflow-hidden shrink-0 border-b border-ink/10">
          <img
            src={project.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 opacity-30 mix-blend-multiply"
            style={{ backgroundColor: project.color }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/30 to-transparent" />
        </div>
      ) : null}
      {/* Animated fill */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0 }}
        initial={{ scaleY: 0 }}
        style={{ originY: 1, background: project.color }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
      />

      <div className="p-7 flex flex-col h-full relative flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-11 h-11 flex items-center justify-center border"
            style={{ borderColor: project.color, color: project.color }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink/30">
              {project.year}
            </span>
            <motion.div
              animate={{ x: hovered ? 3 : 0, y: hovered ? -3 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight
                className="w-4 h-4"
                style={{ color: hovered ? project.color : "rgba(0,0,0,0.2)" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-1">
          <span className="font-mono text-[10px] text-ink/30 uppercase tracking-widest">
            {project.num}
          </span>
        </div>
        <h3
          className="font-syne font-bold uppercase tracking-tight leading-tight mb-1 transition-colors duration-300"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            color: hovered ? project.color : "inherit",
          }}
        >
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="font-mono text-[11px] text-ink/40 uppercase tracking-wider mb-4">
            {project.subtitle}
          </p>
        )}

        <p className="text-sm text-ink/60 leading-relaxed flex-1 mb-6">
          {project.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[11px] border border-ink/12 text-ink/50 font-mono"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectRow({ project, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const Icon = project.icon;

  const handleClick = () => {
    trackEvent("click", `project_detail_open:${project.title}`, "/Projects");
    onSelect?.(project);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="relative border-b border-ink/10 group overflow-hidden cursor-pointer"
      data-cursor
    >
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        style={{ originX: 0, background: project.color }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
      />

      <div className="flex flex-col md:flex-row md:items-center py-7 gap-4 relative">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <span className="font-mono text-xs text-ink/30 w-6 shrink-0">
            {project.num}
          </span>
          {project.coverImage ? (
            <div className="w-11 h-11 shrink-0 rounded-sm overflow-hidden border border-ink/10">
              <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="w-8 h-8 flex items-center justify-center border shrink-0"
              style={{
                borderColor: hovered ? project.color : "rgba(0,0,0,0.1)",
                color: hovered ? project.color : "rgba(0,0,0,0.3)",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="min-w-0">
            <motion.h3
              animate={{ x: hovered ? 6 : 0 }}
              transition={{ duration: 0.3 }}
              className="font-syne font-bold uppercase tracking-tight leading-none"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
                color: hovered ? project.color : "inherit",
              }}
            >
              {project.title}
              {project.subtitle && (
                <span className="font-mono text-[10px] text-ink/30 ml-3 font-normal tracking-wider align-middle hidden sm:inline">
                  — {project.subtitle}
                </span>
              )}
            </motion.h3>
            <p className="text-xs text-ink/45 mt-1 line-clamp-1 hidden md:block">
              {project.desc}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[11px] border border-ink/12 text-ink/40 font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <span className="font-mono text-xs text-ink/30">{project.year}</span>
          <motion.div
            animate={{ x: hovered ? 3 : 0, y: hovered ? -3 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight
              className="w-5 h-5"
              style={{ color: hovered ? project.color : "rgba(0,0,0,0.18)" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const PROJECTS_SCROLL_PAGE = "/Projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollTrackedRef = useRef(false);
  const moreSectionRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchProjects()
      .then((data) => {
        const list = (data.projects || []).map(mapApiProjectToUi);
        setProjects(list);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.cat === active);
  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  useEffect(() => {
    if (!moreSectionRef.current || scrollTrackedRef.current) return;
    const el = moreSectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !scrollTrackedRef.current) {
          scrollTrackedRef.current = true;
          trackEvent("scroll", "projects_more_section", PROJECTS_SCROLL_PAGE);
        }
      },
      { threshold: 0.3, rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [featured.length, rest.length]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailPopup
            key={selectedProject.id ?? selectedProject.title}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
      {/* Header */}
      <section className="pt-32 pb-0 px-6 md:px-10 border-b border-ink/10">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-6"
          >
            03 — Projects
          </motion.p>
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-syne font-bold uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              SELECTED
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-syne font-bold uppercase leading-none tracking-tight text-[#4fa3e0]"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              WORK
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-ink/50 max-w-xl mb-10"
          >
            8 projects spanning security systems, SaaS platforms, DevOps
            infrastructure, and automation tools.
          </motion.p>
        </div>
      </section>

      <MarqueeBand />

      {/* Filter */}
      <div className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-ink/10 px-6 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 flex-wrap">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                trackEvent("click", `filter:${c.key}`, "/Projects");
                setActive(c.key);
              }}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 transition-all ${
                active === c.key
                  ? "bg-ink text-paper"
                  : "text-ink/50 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-ink/30">
            {filtered.length} projects
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <SquareFlowLoader size="lg" />
            <span className="font-mono text-xs text-ink/40">Loading projects…</span>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-ink/50 font-mono text-sm py-24">No projects yet. Add some from the owner dashboard.</p>
        ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Featured grid */}
            {featured.length > 0 && (
              <>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-6">
                  Featured
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 mb-12">
                  {featured.map((p, i) => (
                    <div key={p.id ?? p.num ?? p.title} className="bg-paper">
                      <FeaturedCard project={p} index={i} onSelect={setSelectedProject} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Rest as rows */}
            {rest.length > 0 && (
              <>
                <p ref={moreSectionRef} className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-2">
                  More Projects
                </p>
                {rest.map((p, i) => (
                  <ProjectRow key={p.id ?? p.num ?? p.title} project={p} index={i} onSelect={setSelectedProject} />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        )}
      </div>
    </div>
  );
}

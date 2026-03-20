import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  FolderOpen,
  Users,
  Clock,
  MousePointer,
  Activity,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Mail,
  Crosshair,
  Zap,
  AlertTriangle,
} from "lucide-react";
import {
  getVisitorStats,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getOwnerMessages,
  patchOwnerMessageRead,
  notifyOwnerInboxUpdated,
} from "@/api/ownerApi";
import SquareFlowLoader from "@/components/ui/SquareFlowLoader";

const PERIODS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

/** Country code (e.g. "US") → flag emoji (e.g. 🇺🇸) */
function countryFlag(code) {
  if (!code || typeof code !== "string" || code.length !== 2) return "—";
  const a = code.toUpperCase().split("").map((c) => 0x1f1e6 - 65 + c.charCodeAt(0));
  return a.length === 2 ? String.fromCodePoint(...a) : "—";
}

function formatDateTime(isoStr) {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  } catch {
    return isoStr;
  }
}

/** High-signal meta keys first; long / noisy blobs skipped in the dashboard. */
const EVENT_META_PRIORITY = [
  "tag",
  "label",
  "text",
  "href",
  "id",
  "name",
  "role",
  "selector",
  "metric",
  "duration",
  "value",
];

function clipMetaStr(str, n = 42) {
  const s = String(str ?? "");
  return s.length <= n ? s : `${s.slice(0, n)}…`;
}

function formatMetaScalar(val) {
  if (val == null) return "";
  if (typeof val === "number") {
    if (!Number.isFinite(val)) return "—";
    return Math.abs(val) < 10 && !Number.isInteger(val) ? String(Math.round(val * 100) / 100) : String(Math.round(val));
  }
  if (typeof val === "boolean") return val ? "yes" : "no";
  if (typeof val === "object") return "object";
  return clipMetaStr(val, 36);
}

function heatmapPointXY(p) {
  if (Array.isArray(p) && p.length >= 2) {
    const nx = Number(p[0]);
    const ny = Number(p[1]);
    if (Number.isFinite(nx) && Number.isFinite(ny)) return { nx, ny };
  }
  if (p && typeof p === "object") {
    const nx = Number(p.x ?? p.nx);
    const ny = Number(p.y ?? p.ny);
    if (Number.isFinite(nx) && Number.isFinite(ny)) return { nx, ny };
  }
  return null;
}

function HeatmapMetaPreview({ meta }) {
  const raw = Array.isArray(meta?.points) ? meta.points : [];
  const pts = raw.map(heatmapPointXY).filter(Boolean);
  const vw = 104;
  const vh = 40;
  if (!pts.length) {
    return <span className="text-ink/40 font-mono text-[10px]">No samples</span>;
  }
  return (
    <div className="flex items-center gap-2 min-w-0">
      <svg
        width={vw}
        height={vh}
        className="shrink-0 border border-ink/15 bg-ink/[0.04]"
        viewBox={`0 0 ${vw} ${vh}`}
        aria-hidden
      >
        {pts.map((p, i) => {
          const cx = Math.max(0, Math.min(1, p.nx)) * vw;
          const cy = Math.max(0, Math.min(1, p.ny)) * vh;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={2.2}
              className="fill-[#e84040]/70"
            />
          );
        })}
      </svg>
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="font-mono text-[9px] text-ink/55 flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-ink/40 shrink-0" />
          {pts.length} sample{pts.length !== 1 ? "s" : ""}
        </span>
        {meta?.w != null && meta?.h != null ? (
          <span className="font-mono text-[9px] text-ink/40">{meta.w}×{meta.h}px</span>
        ) : null}
      </div>
    </div>
  );
}

function EventMetaSummary({ ev }) {
  const rawType = String(ev?.event_type || ev?.type || "").toLowerCase();
  const meta = ev?.meta && typeof ev.meta === "object" ? ev.meta : {};

  if (meta._truncated && Array.isArray(meta.keys)) {
    const keys = meta.keys;
    return (
      <div className="flex flex-wrap items-center gap-1">
        <span className="font-mono text-[8px] uppercase tracking-wider px-1 py-0.5 border border-ink/20 text-ink/50">
          Trimmed
        </span>
        {keys.slice(0, 5).map((k) => (
          <span
            key={k}
            className="font-mono text-[9px] text-ink/55 bg-ink/[0.06] px-1 py-0.5 border border-ink/8"
          >
            {k}
          </span>
        ))}
        {keys.length > 5 ? (
          <span className="font-mono text-[9px] text-ink/35">+{keys.length - 5}</span>
        ) : null}
      </div>
    );
  }

  if (rawType === "heatmap") {
    return <HeatmapMetaPreview meta={meta} />;
  }

  if (rawType === "web_vitals") {
    const entries = Object.entries(meta).filter(([k, v]) => !k.startsWith("_") && v != null && v !== "");
    const limited = entries.slice(0, 4);
    if (!limited.length) {
      return <span className="text-ink/35 font-mono text-[10px]">—</span>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {limited.map(([k, v]) => (
          <span
            key={k}
            className="inline-flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 rounded-sm border border-[#4fa3e0]/30 bg-[#4fa3e0]/10 text-ink/85"
            title={`${k}: ${JSON.stringify(v)}`}
          >
            <Zap className="w-3 h-3 text-[#2d8bc4] shrink-0 opacity-90" />
            <span className="text-ink/45">{k}</span>
            <span className="font-medium tabular-nums">{formatMetaScalar(v)}</span>
          </span>
        ))}
      </div>
    );
  }

  if (rawType === "js_error") {
    const entries = Object.entries(meta).filter(([k, v]) => !k.startsWith("_") && v != null && v !== "");
    const limited = entries.slice(0, 3);
    if (!limited.length) {
      return <span className="text-ink/35 font-mono text-[10px]">—</span>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {limited.map(([k, v]) => (
          <span
            key={k}
            className="inline-flex items-center gap-1 font-mono text-[9px] px-1.5 py-0.5 rounded-sm border border-[#e84040]/25 bg-[#e84040]/8 text-ink/80 max-w-[10rem]"
            title={`${k}: ${JSON.stringify(v)}`}
          >
            <AlertTriangle className="w-3 h-3 text-[#c43d3d] shrink-0" />
            <span className="text-ink/50">{k}</span>
            <span className="truncate">{formatMetaScalar(v)}</span>
          </span>
        ))}
      </div>
    );
  }

  const keys = Object.keys(meta).filter((k) => !k.startsWith("_"));
  if (!keys.length) {
    return <span className="text-ink/35 font-mono text-[10px]">—</span>;
  }

  const ordered = [
    ...EVENT_META_PRIORITY.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !EVENT_META_PRIORITY.includes(k)),
  ]
    .filter((k) => {
      const v = meta[k];
      return !(typeof v === "object" && v !== null);
    })
    .slice(0, 4);

  if (!ordered.length) {
    return <span className="text-ink/35 font-mono text-[10px]">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {ordered.map((k) => (
        <span
          key={k}
          className="inline-flex items-baseline gap-0.5 font-mono text-[9px] px-1.5 py-0.5 rounded-sm border border-ink/12 bg-ink/[0.04] max-w-[11rem]"
          title={`${k}: ${String(meta[k])}`}
        >
          <span className="text-ink/45 shrink-0">{k}</span>
          <span className="text-ink/80 truncate">{formatMetaScalar(meta[k])}</span>
        </span>
      ))}
    </div>
  );
}

function eventTypeBadge(ev) {
  const t = String(ev?.event_type || ev?.type || "—").toLowerCase();
  const label = (ev?.event_type || ev?.type || "—").toUpperCase();
  let cls =
    "border-ink/15 bg-ink/[0.06] text-ink/70";
  let Icon = MousePointer;
  if (t === "heatmap") {
    cls = "border-amber-700/25 bg-amber-500/10 text-amber-900/90";
    Icon = Crosshair;
  } else if (t === "web_vitals") {
    cls = "border-[#4fa3e0]/35 bg-[#4fa3e0]/12 text-ink/85";
    Icon = Zap;
  } else if (t === "js_error") {
    cls = "border-[#e84040]/30 bg-[#e84040]/10 text-[#8f2a2a]";
    Icon = AlertTriangle;
  }
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${cls}`}
    >
      <Icon className="w-3 h-3 opacity-80 shrink-0" />
      {label.length > 14 ? `${label.slice(0, 14)}…` : label}
    </span>
  );
}

function eventPageTargetCell(ev) {
  const path = ev.page || ev.path || "";
  const target = ev.target || "";
  if (!path && !target) return <span className="text-ink/40">—</span>;
  return (
    <div className="space-y-0.5 min-w-0 max-w-md">
      {path ? (
        <p className="text-sm text-ink font-medium truncate" title={path}>
          {path}
        </p>
      ) : null}
      {target ? (
        <p
          className="font-mono text-[10px] text-ink/55 truncate"
          title={target}
        >
          {target}
        </p>
      ) : null}
    </div>
  );
}

const VISITORS_PAGE_SIZE = 10;
const EVENTS_PAGE_SIZE = 20;

function Pagination({ page, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-ink/10">
      <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">
        {totalItems === 0 ? "0 items" : `${from}–${to} of ${totalItems}`}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="p-2 border border-ink/10 font-mono text-xs text-ink/60 hover:bg-ink/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-mono text-xs text-ink/50 px-2">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="p-2 border border-ink/10 font-mono text-xs text-ink/60 hover:bg-ink/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const [tab, setTab] = useState("visitors"); // "visitors" | "projects" | "messages"
  const [period, setPeriod] = useState("week");
  const [visitorData, setVisitorData] = useState({
    visitors: [],
    summary: { totalVisits: 0, totalTime: 0, byPage: [] },
    events: [],
    insights: {},
  });
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [visitorError, setVisitorError] = useState(null);
  const [projectForm, setProjectForm] = useState(null); // { open: true } or { open: true, edit: project }

  useEffect(() => {
    let cancelled = false;
    setLoadingVisitors(true);
    setVisitorError(null);
    getVisitorStats(period)
      .then((data) => {
        if (!cancelled) {
          setVisitorData(data || { visitors: [], summary: {}, events: [], insights: {} });
          setVisitorError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setVisitorData({
            visitors: [],
            summary: { totalVisits: 0, totalTime: 0, byPage: [] },
            events: [],
            insights: {},
          });
          setVisitorError(err?.message || "Could not load visitor data. Check VITE_OWNER_API_URL and owner key.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingVisitors(false);
      });
    return () => { cancelled = true; };
  }, [period]);

  useEffect(() => {
    let cancelled = false;
    setLoadingProjects(true);
    getProjects()
      .then((data) => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : data?.projects || [];
          setProjects(list);
        }
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProjects(false);
      });
    return () => { cancelled = true; };
  }, [tab]);

  useEffect(() => {
    if (tab !== "messages") return;
    let cancelled = false;
    setLoadingMessages(true);
    getOwnerMessages()
      .then((list) => {
        if (!cancelled) setMessages(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => { cancelled = true; };
  }, [tab]);

  return (
    <>
      <div className="border-b border-ink/10 bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex gap-1 border border-ink/10 p-1 w-fit flex-wrap">
            {[
              { id: "visitors", label: "Visitor monitor", icon: Users },
              { id: "projects", label: "Projects", icon: FolderOpen },
              { id: "messages", label: "Messages", icon: Mail },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    tab === t.id
                      ? "bg-ink text-paper"
                      : "text-ink/60 hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {tab === "visitors" && (
          <VisitorMonitor
            period={period}
            setPeriod={setPeriod}
            data={visitorData}
            loading={loadingVisitors}
            error={visitorError}
          />
        )}
        {tab === "projects" && (
          <ProjectManagement
            projects={projects}
            setProjects={setProjects}
            formState={projectForm}
            setFormState={setProjectForm}
            loading={loadingProjects}
          />
        )}
        {tab === "messages" && (
          <MessagesSection messages={messages} loading={loadingMessages} />
        )}
      </main>
    </>
  );
}

function VisitorMonitor({ period, setPeriod, data, loading, error }) {
  const { visitors = [], summary = {}, events = [], insights = {} } = data;
  const { totalVisits = 0, totalTime = 0, byPage = [] } = summary;
  const {
    liveNow = 0,
    avgScrollPct = 0,
    devices = [],
    browsers = [],
    trafficTypes = [],
    topReferrers = [],
    topFlows = [],
  } = insights || {};
  const [visitorPage, setVisitorPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);

  useEffect(() => {
    setVisitorPage(1);
    setEventPage(1);
  }, [period]);

  const visitorsPaginated = visitors.slice(
    (visitorPage - 1) * VISITORS_PAGE_SIZE,
    visitorPage * VISITORS_PAGE_SIZE
  );
  const eventsPaginated = events.slice(
    (eventPage - 1) * EVENTS_PAGE_SIZE,
    eventPage * EVENTS_PAGE_SIZE
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {error && (
        <div className="border border-[#e84040]/30 bg-[#e84040]/5 px-6 py-4 flex items-center gap-3">
          <span className="font-mono text-xs text-[#e84040]">{error}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <span className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">
            Analytics
          </span>
          <h2 className="font-syne font-bold uppercase tracking-tight text-3xl mt-1">
            Visitor monitor
          </h2>
          <p className="text-sm text-ink/60 mt-2 max-w-xl">
            Who visited, which page, how long they stayed, and what they clicked.
            Data comes from your backend when connected.
          </p>
        </div>
        <div className="flex border border-ink/15 p-1 gap-0">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                period === p.value ? "bg-ink text-paper" : "text-ink/60 hover:bg-ink/5"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ——— Section: Overview ——— */}
      <section className="space-y-6">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/50 flex items-center gap-2">
          <BarChart2 className="w-3.5 h-3.5" />
          Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total visits", value: totalVisits, icon: Users },
          { label: "Total time (min)", value: Math.round(totalTime || 0), icon: Clock },
          { label: "Events (clicks)", value: events.length, icon: MousePointer },
          { label: "Live now (~5m)", value: liveNow, icon: Activity },
          { label: "Avg scroll %", value: avgScrollPct, icon: BarChart2 },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border border-ink/10 p-6 flex items-center gap-4"
          >
            <div className="w-10 h-10 border border-ink/15 flex items-center justify-center">
              <Icon className="w-5 h-5 text-ink/60" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">
                {label}
              </p>
              <p className="font-syne font-bold text-2xl text-ink mt-0.5">
                {loading ? "—" : value}
              </p>
            </div>
          </div>
        ))}
        </div>

        <div className="border border-ink/10">
          <div className="border-b border-ink/10 px-6 py-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-ink/50" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
              Time by page
            </span>
          </div>
          <div className="divide-y divide-ink/10">
            {loading ? (
              <div className="px-6 py-12 flex flex-col items-center justify-center gap-3 text-ink/50 font-mono text-sm">
                <SquareFlowLoader size="sm" />
                <span>Loading…</span>
              </div>
            ) : byPage.length > 0 ? (
              byPage.map((row, i) => (
                <div
                  key={i}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <span className="font-medium text-ink">{row.page || row.path || "—"}</span>
                  <span className="font-mono text-sm text-ink/60 text-right max-w-[55%]">
                    {row.duration != null ? `${row.duration} min` : ""}
                    {row.duration != null && row.visits != null ? " · " : ""}
                    {row.visits != null ? `${row.visits} visits` : ""}
                    {row.avgScrollPct != null && row.avgScrollPct > 0
                      ? ` · ~${row.avgScrollPct}% scroll`
                      : ""}
                    {row.duration == null && row.visits == null ? "—" : ""}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-ink/50 font-mono text-sm">
                {error ? "Fix connection to see data." : "No data for this period. Visit portfolio pages to generate tracking data."}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ——— Section: Traffic & funnels ——— */}
      <section className="space-y-6">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/50 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" />
          Traffic & journeys
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-ink/10 p-6 space-y-3">
            <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">Devices</p>
            {loading ? (
              <p className="text-ink/40 font-mono text-sm">…</p>
            ) : devices.length ? (
              <ul className="space-y-1 font-mono text-xs text-ink/80">
                {devices.map((d) => (
                  <li key={d.device_type} className="flex justify-between gap-4">
                    <span>{d.device_type || "—"}</span>
                    <span className="text-ink/50">{d.c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink/40 font-mono text-sm">No device data yet.</p>
            )}
          </div>
          <div className="border border-ink/10 p-6 space-y-3">
            <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">Browsers</p>
            {loading ? (
              <p className="text-ink/40 font-mono text-sm">…</p>
            ) : browsers.length ? (
              <ul className="space-y-1 font-mono text-xs text-ink/80">
                {browsers.map((b) => (
                  <li key={b.browser} className="flex justify-between gap-4">
                    <span>{b.browser || "—"}</span>
                    <span className="text-ink/50">{b.c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink/40 font-mono text-sm">No browser data yet.</p>
            )}
          </div>
          <div className="border border-ink/10 p-6 space-y-3">
            <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">Traffic type</p>
            {loading ? (
              <p className="text-ink/40 font-mono text-sm">…</p>
            ) : trafficTypes.length ? (
              <ul className="space-y-1 font-mono text-xs text-ink/80">
                {trafficTypes.map((t) => (
                  <li key={t.traffic_type} className="flex justify-between gap-4">
                    <span>{t.traffic_type || "—"}</span>
                    <span className="text-ink/50">{t.c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink/40 font-mono text-sm">No traffic buckets yet.</p>
            )}
          </div>
          <div className="border border-ink/10 p-6 space-y-3">
            <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">Top referrers</p>
            {loading ? (
              <p className="text-ink/40 font-mono text-sm">…</p>
            ) : topReferrers.length ? (
              <ul className="space-y-1 font-mono text-xs text-ink/80 break-all">
                {topReferrers.map((r) => (
                  <li key={r.host} className="flex justify-between gap-4">
                    <span>{r.host}</span>
                    <span className="text-ink/50 shrink-0">{r.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink/40 font-mono text-sm">No referrer data.</p>
            )}
          </div>
        </div>
        <div className="border border-ink/10 p-6 space-y-3">
          <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">Common paths (funnel-style)</p>
          {loading ? (
            <p className="text-ink/40 font-mono text-sm">…</p>
          ) : topFlows.length ? (
            <ul className="space-y-2 font-mono text-[11px] text-ink/80 leading-relaxed">
              {topFlows.map((f) => (
                <li key={f.flow} className="flex justify-between gap-4 border-b border-ink/5 pb-2 last:border-0">
                  <span className="break-all">{f.flow}</span>
                  <span className="text-ink/50 shrink-0">{f.count}×</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink/40 font-mono text-sm">Need multi-page sessions to build path flows.</p>
          )}
        </div>
      </section>

      {/* ——— Section: Visitors ——— */}
      <section className="space-y-4">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/50 flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          Visitors
        </h3>
        <div className="border border-ink/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    IP
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    Country
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50 w-12">
                    Flag
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    Device
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    Traffic
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    Last seen
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center gap-3 text-ink/50 font-mono text-sm">
                        <SquareFlowLoader size="sm" />
                        <span>Loading…</span>
                      </div>
                    </td>
                  </tr>
                ) : visitorsPaginated.length > 0 ? (
                  visitorsPaginated.map((v, i) => {
                  const ip = v.ip ?? v.ip_address ?? "—";
                  const country = v.country ?? v.country_code ?? "—";
                  const code = v.country_code ?? (v.country && v.country.length === 2 ? v.country : null);
                  const rowIndex = (visitorPage - 1) * VISITORS_PAGE_SIZE + i;
                  return (
                    <tr key={v.id ?? v.session_id ?? rowIndex} className="border-b border-ink/5">
                      <td className="px-6 py-3 font-mono text-xs text-ink/80">
                        {ip}
                      </td>
                      <td className="px-6 py-3 text-sm text-ink">
                        {typeof country === "string" && country.length > 2 ? country : code || "—"}
                      </td>
                      <td className="px-6 py-3 text-lg leading-none">
                        {code ? countryFlag(code) : "—"}
                      </td>
                      <td className="px-6 py-3 font-mono text-[10px] text-ink/70 max-w-[120px]">
                        {[v.device_type, v.browser].filter(Boolean).join(" · ") || "—"}
                      </td>
                      <td className="px-6 py-3 font-mono text-[10px] text-ink/60">
                        {v.traffic_type || "—"}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-ink/60">
                        {formatDateTime(v.last_seen_at ?? v.lastSeenAt)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink/50 font-mono text-sm">
                    No visitors yet. Connect backend and add tracking to your site.
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={visitorPage}
            totalItems={visitors.length}
            pageSize={VISITORS_PAGE_SIZE}
            onPageChange={setVisitorPage}
          />
        </div>
      </section>

      {/* ——— Section: Clicks & events ——— */}
      <section className="space-y-4">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/50 flex items-center gap-2">
          <MousePointer className="w-3.5 h-3.5" />
          Clicks & events
        </h3>
        <div className="border border-ink/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    When
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50">
                    Page / Target
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50 whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink/50 min-w-[14rem]">
                    Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center gap-3 text-ink/50 font-mono text-sm">
                        <SquareFlowLoader size="sm" />
                        <span>Loading…</span>
                      </div>
                    </td>
                  </tr>
                ) : eventsPaginated.length > 0 ? (
                  eventsPaginated.map((ev, i) => {
                    const rowIndex = (eventPage - 1) * EVENTS_PAGE_SIZE + i;
                    return (
                      <tr key={ev.id ?? rowIndex} className="border-b border-ink/5">
                        <td className="px-6 py-3 font-mono text-xs text-ink/70">
                          {formatDateTime(ev.timestamp || ev.created_at)}
                        </td>
                        <td className="px-6 py-3 text-sm text-ink">
                          {ev.page || ev.path || ev.target || "—"}
                        </td>
                        <td className="px-6 py-3 font-mono text-xs text-ink/60 uppercase">
                          {ev.event_type || ev.type || ev.event || "—"}
                        </td>
                        <td
                          className="px-6 py-3 font-mono text-[10px] text-ink/50 max-w-xs truncate"
                          title={ev.meta ? JSON.stringify(ev.meta) : ""}
                        >
                          {ev.meta && Object.keys(ev.meta).length
                            ? `${JSON.stringify(ev.meta).slice(0, 80)}${
                                JSON.stringify(ev.meta).length > 80 ? "…" : ""
                              }`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-ink/50 font-mono text-sm">
                      No events yet. Connect backend and add tracking to your site.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={eventPage}
            totalItems={events.length}
            pageSize={EVENTS_PAGE_SIZE}
            onPageChange={setEventPage}
          />
        </div>
      </section>
    </motion.div>
  );
}

function messageIsUnread(m) {
  if (!m || typeof m !== "object") return true;
  const r = m.read;
  if (r === true || r === 1 || r === "1" || r === "true") return false;
  return true;
}

function MessagesSection({ messages, loading, setMessages }) {
  const [busyId, setBusyId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const unreadCount = messages.filter(messageIsUnread).length;

  const markRead = async (id) => {
    setBusyId(id);
    try {
      await patchOwnerMessageRead(id, true);
      setMessages((prev) =>
        prev.map((x) => (x.id === id ? { ...x, read: true } : x))
      );
      notifyOwnerInboxUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  const markAllRead = async () => {
    const ids = messages.filter(messageIsUnread).map((m) => m.id);
    if (ids.length === 0) return;
    setBulkBusy(true);
    try {
      await Promise.all(ids.map((id) => patchOwnerMessageRead(id, true)));
      setMessages((prev) => prev.map((x) => ({ ...x, read: true })));
      notifyOwnerInboxUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-syne font-bold uppercase tracking-tight text-2xl">
            Contact messages
          </h2>
          <p className="text-sm text-ink/60 mt-1">
            Messages sent from the site contact form. You also get Telegram notifications for each new message.
            Mark as read when handled — the welcome summary only counts unread.
          </p>
        </div>
        {messages.length > 0 && unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={bulkBusy || loading}
            className="self-start border border-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink/70 hover:bg-ink/5 disabled:opacity-50"
          >
            {bulkBusy ? "Updating…" : `Mark all read (${unreadCount})`}
          </button>
        )}
      </div>
      <div className="border border-ink/10">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-16 flex flex-col items-center justify-center gap-3 text-ink/50 font-mono text-sm">
              <SquareFlowLoader size="sm" />
              <span>Loading messages…</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="px-6 py-16 text-center text-ink/50 font-mono text-sm">
              No messages yet.
            </div>
          ) : (
            <div className="divide-y divide-ink/10">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`px-6 py-5 ${!messageIsUnread(m) ? "bg-ink/[0.02]" : "bg-[#e84040]/[0.04]"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-grotesk font-medium text-ink">
                          {m.name || "—"}
                        </p>
                        {messageIsUnread(m) && (
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#c43d3d] border border-[#c43d3d]/30 px-1.5 py-0.5">
                            Unread
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${m.email || ""}`}
                        className="font-mono text-xs text-ink/60 hover:text-[#4fa3e0]"
                      >
                        {m.email || "—"}
                      </a>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-mono text-[10px] text-ink/40">
                        {formatDateTime(m.created_at)}
                      </span>
                      {messageIsUnread(m) && (
                        <button
                          type="button"
                          onClick={() => markRead(m.id)}
                          disabled={busyId === m.id}
                          className="font-mono text-[10px] uppercase tracking-widest border border-ink/20 px-2 py-1 text-ink/70 hover:bg-ink/5 disabled:opacity-50"
                        >
                          {busyId === m.id ? "…" : "Mark read"}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-wrap">
                    {m.message || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectManagement({ projects, setProjects, formState, setFormState, loading }) {
  const [submitting, setSubmitting] = useState(false);
  const emptyFeatureForm = () => ({
    f1t: "",
    f1b: "",
    f1img: "",
    f2t: "",
    f2b: "",
    f2img: "",
    f3t: "",
    f3b: "",
    f3img: "",
  });

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    desc: "",
    year: new Date().getFullYear().toString(),
    tags: "",
    liveUrl: "",
    githubUrl: "",
    coverImage: "",
    gallery1: "",
    gallery2: "",
    featured: false,
    color: "#0f0f0f",
    ...emptyFeatureForm(),
  });

  const openCreate = () => {
    setForm({
      title: "",
      subtitle: "",
      desc: "",
      year: new Date().getFullYear().toString(),
      tags: "",
      liveUrl: "",
      githubUrl: "",
      coverImage: "",
      gallery1: "",
      gallery2: "",
      featured: false,
      color: "#0f0f0f",
      ...emptyFeatureForm(),
    });
    setFormState({ open: true });
  };

  const openEdit = (p) => {
    const gallery = Array.isArray(p.gallery_images) ? p.gallery_images : [];
    const fh = Array.isArray(p.feature_highlights) ? p.feature_highlights : [];
    const slot = (i) => {
      const h = fh[i] || {};
      return {
        t: h.title || "",
        b: h.body || h.text || h.desc || "",
        img: h.image || h.img || "",
      };
    };
    const s0 = slot(0);
    const s1 = slot(1);
    const s2 = slot(2);
    setForm({
      title: p.title || "",
      subtitle: p.subtitle || "",
      desc: p.description || p.desc || "",
      year: p.year || new Date().getFullYear().toString(),
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""),
      liveUrl: p.live_url || p.liveUrl || "",
      githubUrl: p.github_url || p.githubUrl || "",
      coverImage: p.cover_image || p.coverImage || "",
      gallery1: gallery[0] || "",
      gallery2: gallery[1] || "",
      featured: !!p.featured,
      color: p.color || "#0f0f0f",
      f1t: s0.t,
      f1b: s0.b,
      f1img: s0.img,
      f2t: s1.t,
      f2b: s1.b,
      f2img: s1.img,
      f3t: s2.t,
      f3b: s2.b,
      f3img: s2.img,
    });
    setFormState({ open: true, edit: p });
  };

  const closeForm = () => setFormState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const feature_highlights = [
      { title: form.f1t, body: form.f1b, image: form.f1img },
      { title: form.f2t, body: form.f2b, image: form.f2img },
      { title: form.f3t, body: form.f3b, image: form.f3img },
    ].map((x) => ({
      title: (x.title || "").trim() || "Highlight",
      body: (x.body || "").trim(),
      image: (x.image || "").trim(),
    }));

    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      description: form.desc,
      desc: form.desc,
      year: form.year,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      live_url: form.liveUrl || "",
      github_url: form.githubUrl || "",
      cover_image: (form.coverImage || "").trim(),
      gallery_images: [form.gallery1, form.gallery2].map((u) => (u || "").trim()).filter(Boolean),
      feature_highlights,
      featured: form.featured,
      color: form.color,
    };
    try {
      if (formState?.edit?.id) {
        await updateProject(formState.edit.id, payload);
        setProjects((prev) =>
          prev.map((p) => (p.id === formState.edit.id ? { ...p, ...payload } : p))
        );
      } else {
        const created = await createProject(payload);
        const newProject = created.project || created;
        setProjects((prev) => (newProject ? [...prev, newProject] : prev));
      }
      closeForm();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <span className="font-mono text-[10px] text-ink/50 uppercase tracking-widest">
            Content
          </span>
          <h2 className="font-syne font-bold uppercase tracking-tight text-3xl mt-1">
            Projects
          </h2>
          <p className="text-sm text-ink/60 mt-2 max-w-xl">
            Add and manage portfolio projects. Data is saved to your backend when
            connected.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 border border-ink bg-ink text-paper px-4 py-3 font-syne font-bold uppercase tracking-tight text-sm hover:bg-ink/90 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          Add project
        </button>
      </div>

      {/* Project list */}
      <div className="border border-ink/10">
        <div className="border-b border-ink/10 px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-ink/60">
          All projects
        </div>
        <div className="divide-y divide-ink/10">
          {loading ? (
            <div className="px-6 py-12 flex flex-col items-center justify-center gap-3 text-ink/50 font-mono text-sm">
              <SquareFlowLoader size="sm" />
              <span>Loading…</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="px-6 py-12 text-center text-ink/50 font-mono text-sm">
              No projects yet. Add one or connect your backend to load existing
              data.
            </div>
          ) : (
            projects.map((p) => (
              <div
                key={p.id || p.title}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-syne font-bold uppercase tracking-tight text-ink">
                    {p.title}
                  </h3>
                  {p.subtitle && (
                    <p className="font-mono text-[11px] text-ink/50 mt-0.5">
                      {p.subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink/50 hover:text-ink"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink/50 hover:text-ink"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className="font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:text-ink border border-ink/15 px-3 py-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-ink/50 hover:text-red-600 border border-ink/15 hover:border-red-200"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit modal */}
      {formState?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-paper border border-ink/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-ink/10 flex items-center justify-between">
              <h3 className="font-syne font-bold uppercase tracking-tight">
                {formState.edit ? "Edit project" : "New project"}
              </h3>
              <button
                onClick={closeForm}
                className="font-mono text-[11px] text-ink/50 hover:text-ink"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk focus:outline-none focus:border-ink/40"
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  Subtitle
                </label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk focus:outline-none focus:border-ink/40"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  Description *
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  rows={3}
                  className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk focus:outline-none focus:border-ink/40 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                    Year
                  </label>
                  <input
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="w-full h-10 border border-ink/15 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="Laravel, React, API"
                  className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk focus:outline-none focus:border-ink/40"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  Live URL
                </label>
                <input
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk focus:outline-none focus:border-ink/40"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk focus:outline-none focus:border-ink/40"
                />
              </div>
              <div className="border-t border-ink/10 pt-4 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                  Images (URLs) — main + 2 gallery + 3 highlight cards
                </p>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                    Main / cover image
                  </label>
                  <input
                    type="url"
                    value={form.coverImage}
                    onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                    placeholder="https://…"
                    className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk text-sm focus:outline-none focus:border-ink/40"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                      Gallery image 1
                    </label>
                    <input
                      type="url"
                      value={form.gallery1}
                      onChange={(e) => setForm((f) => ({ ...f, gallery1: e.target.value }))}
                      placeholder="https://…"
                      className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk text-sm focus:outline-none focus:border-ink/40"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                      Gallery image 2
                    </label>
                    <input
                      type="url"
                      value={form.gallery2}
                      onChange={(e) => setForm((f) => ({ ...f, gallery2: e.target.value }))}
                      placeholder="https://…"
                      className="w-full border border-ink/15 px-4 py-2 text-ink bg-paper font-grotesk text-sm focus:outline-none focus:border-ink/40"
                    />
                  </div>
                </div>
                {[1, 2, 3].map((n) => {
                  const tKey = `f${n}t`;
                  const bKey = `f${n}b`;
                  const iKey = `f${n}img`;
                  return (
                    <div key={n} className="border border-ink/10 p-3 space-y-2 bg-ink/[0.02]">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink/45">
                        Highlight {n}
                      </p>
                      <input
                        value={form[tKey]}
                        onChange={(e) => setForm((f) => ({ ...f, [tKey]: e.target.value }))}
                        placeholder="Title"
                        className="w-full border border-ink/15 px-3 py-2 text-ink bg-paper font-grotesk text-sm focus:outline-none focus:border-ink/40"
                      />
                      <textarea
                        value={form[bKey]}
                        onChange={(e) => setForm((f) => ({ ...f, [bKey]: e.target.value }))}
                        placeholder="Short description"
                        rows={2}
                        className="w-full border border-ink/15 px-3 py-2 text-ink bg-paper font-grotesk text-sm focus:outline-none focus:border-ink/40 resize-none"
                      />
                      <input
                        type="url"
                        value={form[iKey]}
                        onChange={(e) => setForm((f) => ({ ...f, [iKey]: e.target.value }))}
                        placeholder="Image URL"
                        className="w-full border border-ink/15 px-3 py-2 text-ink bg-paper font-grotesk text-sm focus:outline-none focus:border-ink/40"
                      />
                    </div>
                  );
                })}
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="border border-ink/20"
                />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink/70">
                  Featured
                </span>
              </label>
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="border border-ink bg-ink text-paper px-4 py-3 font-syne font-bold uppercase tracking-tight text-sm hover:bg-ink/90 disabled:opacity-60"
                >
                  {submitting ? "Saving…" : formState.edit ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="border border-ink/15 px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:bg-ink/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

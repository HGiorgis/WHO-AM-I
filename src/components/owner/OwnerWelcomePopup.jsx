import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Users, Activity, FolderKanban } from "lucide-react";
import { getVisitorStats, getOwnerMessages, getProjects } from "@/api/ownerApi";

const LAST_VISIT_KEY = "owner_last_visit_iso";

function isUnreadMessage(m) {
  if (!m || typeof m !== "object") return false;
  const r = m.read;
  if (r === true || r === 1 || r === "1" || r === "true") return false;
  return true;
}
export const OWNER_POPUP_DISMISSED_KEY = "owner_welcome_popup_dismissed_v1";

function formatLastVisit(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

/**
 * Top-left summary when entering the owner area: previous session time + 4 live stats.
 */
export default function OwnerWelcomePopup() {
  const [open, setOpen] = useState(false);
  const [lastVisitLabel, setLastVisitLabel] = useState(null);
  const [stats, setStats] = useState({
    unreadMessages: 0,
    visitorsWeek: 0,
    eventsWeek: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const markNowForNextLogin = () => {
      try {
        localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
      } catch {
        /* ignore */
      }
    };

    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(OWNER_POPUP_DISMISSED_KEY) === "1";
    } catch {
      /* ignore */
    }

    const prevIso = (() => {
      try {
        return localStorage.getItem(LAST_VISIT_KEY);
      } catch {
        return null;
      }
    })();

    setLastVisitLabel(formatLastVisit(prevIso));
    markNowForNextLogin();

    if (dismissed) {
      setOpen(false);
      setLoading(false);
      return;
    }

    setOpen(true);

    let cancelled = false;
    const loadStats = async () => {
      try {
        const [vData, msgs, proj] = await Promise.all([
          getVisitorStats("week"),
          getOwnerMessages(),
          getProjects(),
        ]);
        if (cancelled) return;
        const messageList = Array.isArray(msgs) ? msgs : [];
        const unread = messageList.filter(isUnreadMessage).length;
        const projectsList = proj?.projects ?? (Array.isArray(proj) ? proj : []);
        setStats({
          unreadMessages: unread,
          visitorsWeek: vData?.summary?.totalVisits ?? 0,
          eventsWeek: Array.isArray(vData?.events) ? vData.events.length : 0,
          projects: projectsList.length,
        });
      } catch {
        /* keep zeros */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadStats();

    const onInboxUpdated = () => {
      if (cancelled) return;
      loadStats();
    };
    window.addEventListener("owner-inbox-updated", onInboxUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("owner-inbox-updated", onInboxUpdated);
    };
  }, []);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(OWNER_POPUP_DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  const fourRows = [
    {
      key: "inbox",
      icon: Mail,
      label: "Unread messages",
      value: loading
        ? "…"
        : stats.unreadMessages === 0
          ? "All caught up"
          : `${stats.unreadMessages} new`,
      highlight: !loading && stats.unreadMessages > 0,
    },
    {
      key: "visitors",
      icon: Users,
      label: "Visitors (7 days)",
      value: loading ? "…" : String(stats.visitorsWeek),
      highlight: !loading && stats.visitorsWeek > 0,
    },
    {
      key: "events",
      icon: Activity,
      label: "Tracked events (7 days)",
      value: loading ? "…" : String(stats.eventsWeek),
      highlight: !loading && stats.eventsWeek > 0,
    },
    {
      key: "projects",
      icon: FolderKanban,
      label: "Portfolio projects",
      value: loading ? "…" : String(stats.projects),
      highlight: false,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-labelledby="owner-welcome-title"
          aria-describedby="owner-welcome-desc"
          initial={{ opacity: 0, x: -16, y: -8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed top-4 left-4 z-[100] w-[min(calc(100vw-2rem),19rem)] border border-ink/20 bg-paper/98 backdrop-blur-md shadow-[8px_8px_0_0_rgba(15,15,15,0.06)]"
        >
          <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2 border-b border-ink/10">
            <div className="min-w-0">
              <p
                id="owner-welcome-title"
                className="font-syne font-bold uppercase text-sm tracking-tight text-ink"
              >
                Welcome back
              </p>
              <p id="owner-welcome-desc" className="font-mono text-[10px] text-ink/55 mt-1 leading-relaxed">
                <span className="text-ink/40 uppercase tracking-widest text-[9px]">Last session</span>
                <br />
                <span className="text-ink">{lastVisitLabel || "First visit on this device"}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="p-1.5 border border-ink/15 text-ink/50 hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
              aria-label="Close summary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="px-4 pt-2 pb-1 font-mono text-[9px] uppercase tracking-widest text-ink/40">
            At a glance
          </p>
          <ul className="px-2 pb-2 space-y-0">
            {fourRows.map(({ key, icon: Icon, label, value, highlight }) => (
              <li
                key={key}
                className={`flex items-start gap-3 px-2 py-2.5 border-b border-ink/5 last:border-0 ${
                  highlight ? "bg-[#e84040]/[0.07]" : ""
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 mt-0.5 ${highlight ? "text-[#e84040]" : "text-ink/35"}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-ink/40">{label}</p>
                  <p className="font-mono text-xs text-ink mt-0.5 break-words leading-snug">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useRef } from "react";
import {
  buildTrackingContext,
  trackSessionInit,
  trackScrollDepth,
  trackPerformance,
  trackJsError,
  trackHeatmapSample,
} from "@/api/trackApi";

function throttle(fn, wait) {
  let t = 0;
  let lastArgs;
  return function throttled(...args) {
    lastArgs = args;
    const now = Date.now();
    if (now - t >= wait) {
      t = now;
      fn(...lastArgs);
    }
  };
}

/**
 * Scroll depth, sparse pointer samples, navigation timing / LCP, global errors.
 * Does not record form fields or keystrokes (privacy-safe baseline).
 * @param {string} pathname – current route (resets scroll max on change)
 */
export function useAdvancedAnalytics(pathname = "/") {
  const maxScrollRef = useRef(0);
  const pointsRef = useRef([]);
  const heatmapFlushRef = useRef(null);
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    maxScrollRef.current = 0;
  }, [pathname]);

  useEffect(() => {
    const ctx = buildTrackingContext();
    trackSessionInit(ctx);

    const onScroll = throttle(() => {
      const el = document.documentElement;
      const sh = el.scrollHeight - window.innerHeight;
      const path = pathRef.current || window.location.pathname || "/";
      if (sh <= 0) {
        trackScrollDepth(path, 100);
        return;
      }
      const pct = Math.min(100, Math.round((window.scrollY / sh) * 100));
      if (pct > maxScrollRef.current) {
        maxScrollRef.current = pct;
        trackScrollDepth(path, pct);
      }
    }, 450);

    window.addEventListener("scroll", onScroll, { passive: true });

    const onMove = throttle((ev) => {
      if (pointsRef.current.length >= 25) return;
      pointsRef.current.push([
        Math.round((ev.clientX / window.innerWidth) * 1000) / 1000,
        Math.round((ev.clientY / window.innerHeight) * 1000) / 1000,
        Date.now(),
      ]);
    }, 120);
    window.addEventListener("mousemove", onMove, { passive: true });

    heatmapFlushRef.current = window.setInterval(() => {
      const batch = pointsRef.current.splice(0, 40);
      if (batch.length) {
        trackHeatmapSample(batch, window.innerWidth, window.innerHeight);
      }
    }, 12000);

    const sendNavTiming = () => {
      try {
        const nav = performance.getEntriesByType?.("navigation")?.[0];
        if (nav && typeof nav.loadEventEnd === "number") {
          trackPerformance("navigation", {
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
            loadEvent: Math.round(nav.loadEventEnd || 0),
            transferSize: nav.transferSize || 0,
          });
        }
      } catch {
        /* ignore */
      }
    };
    const t0 = window.setTimeout(sendNavTiming, 2000);

    let lcpObserver;
    try {
      lcpObserver = new PerformanceObserver((list) => {
        const e = list.getEntries().at(-1);
        if (e?.startTime) {
          trackPerformance("LCP", { value: Math.round(e.startTime) });
          try {
            lcpObserver.disconnect();
          } catch {
            /* ignore */
          }
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* ignore */
    }

    const onErr = (ev) => {
      trackJsError(ev.message || "error", {
        source: ev.filename,
        line: ev.lineno,
        col: ev.colno,
      });
    };
    const onRej = (ev) => {
      const r = ev.reason;
      trackJsError(r?.message || String(r || "unhandledrejection"), {
        unhandled: true,
      });
    };
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      window.clearTimeout(t0);
      if (heatmapFlushRef.current) window.clearInterval(heatmapFlushRef.current);
      try {
        lcpObserver?.disconnect();
      } catch {
        /* ignore */
      }
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);
}

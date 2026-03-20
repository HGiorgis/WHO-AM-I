/**
 * Send page views and events to the backend for owner analytics.
 * Uses VITE_OWNER_API_URL as base (e.g. http://localhost:8000/api).
 */

const getBaseUrl = () =>
  import.meta.env.VITE_OWNER_API_URL || "/api";

function getSessionId() {
  try {
    let id = sessionStorage.getItem("portfolio_session_id");
    if (!id) {
      id = "s_" + Math.random().toString(36).slice(2) + "_" + Date.now();
      sessionStorage.setItem("portfolio_session_id", id);
    }
    return id;
  } catch {
    return "s_" + Date.now();
  }
}

function send(body) {
  const base = getBaseUrl();
  const url = `${base.replace(/\/$/, "")}/track`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: getSessionId(), ...body }),
  }).catch(() => {});
}

function sendLeave(body) {
  const base = getBaseUrl();
  const url = `${base.replace(/\/$/, "")}/track/leave`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: getSessionId(), ...body }),
  }).catch(() => {});
}

/** Call when user lands on a page (path = e.g. /Home, /Projects) */
export function trackPageView(path) {
  return send({ type: "page_view", path: path || window.location.pathname || "/" });
}

/** Call when user clicks something (e.g. CTA, link). */
export function trackEvent(eventType = "click", target = "", path = "") {
  return send({
    type: "event",
    eventType,
    target: target || "",
    path: path || window.location.pathname || "/",
  });
}

/** Call when user leaves the page or tab (duration in seconds). */
export function trackLeave(path, durationSeconds) {
  return sendLeave({
    path: path || window.location.pathname || "/",
    durationSeconds: Math.round(durationSeconds || 0),
  });
}

/** First-load context: referrer, UTM, UA, landing path (no PII). */
export function trackSessionInit(context = {}) {
  return send({ type: "session_init", context });
}

/** Max scroll depth 0–100 for current path. */
export function trackScrollDepth(path, percent) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return send({ type: "scroll", path: path || window.location.pathname || "/", percent: p });
}

/** Web vitals or navigation timing (small JSON only). */
export function trackPerformance(metricName, meta = {}) {
  return send({
    type: "performance",
    path: window.location.pathname || "/",
    metric: metricName,
    meta,
  });
}

export function trackJsError(message, meta = {}) {
  return send({
    type: "error",
    path: window.location.pathname || "/",
    message: String(message || "").slice(0, 500),
    meta,
  });
}

/** Sparse pointer samples for heatmap-style analytics (coordinates 0–1). */
export function trackHeatmapSample(points, w, h) {
  if (!points?.length) return Promise.resolve();
  return send({
    type: "heatmap",
    path: window.location.pathname || "/",
    points: points.slice(0, 40),
    w,
    h,
  });
}

/** Build context object for session_init / optional attach to events. */
export function buildTrackingContext() {
  try {
    const ua = navigator.userAgent || "";
    const ref = document.referrer || "";
    let landing = sessionStorage.getItem("portfolio_landing_path");
    if (!landing) {
      landing = window.location.pathname + (window.location.search || "");
      sessionStorage.setItem("portfolio_landing_path", landing);
    }
    const params = new URLSearchParams(window.location.search || "");
    return {
      userAgent: ua.slice(0, 512),
      referrer: ref.slice(0, 2048),
      landingPath: landing.slice(0, 500),
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      lang: navigator.language || "",
    };
  } catch {
    return {};
  }
}

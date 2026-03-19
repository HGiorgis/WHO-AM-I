/**
 * Send page views and events to the backend for owner analytics.
 * Uses VITE_OWNER_API_URL as base (e.g. http://localhost:8000/api).
 */

const getBaseUrl = () =>
  import.meta.env.VITE_OWNER_API_URL || "";

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
  if (!base) return Promise.resolve();
  const url = `${base.replace(/\/$/, "")}/track`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: getSessionId(), ...body }),
  }).catch(() => {});
}

function sendLeave(body) {
  const base = getBaseUrl();
  if (!base) return Promise.resolve();
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

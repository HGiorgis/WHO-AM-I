/**
 * Owner API – backend-ready for Django.
 *
 * Set VITE_OWNER_API_URL in .env (e.g. http://localhost:8000/api) to point to your backend.
 *
 * Expected Django endpoints:
 *   POST   /owner/validate     Body: { key }     → { valid: true } or 401
 *   GET    /owner/projects     Header: X-Owner-Key or Authorization: Key <key>  → { projects: [...] }
 *   POST   /owner/projects     Body: project payload  → { project: {...} }
 *   PATCH  /owner/projects/:id Body: partial project  → { project: {...} }
 *   DELETE /owner/projects/:id → 204
 *   GET    /owner/visitors?period=day|week|month|year  → { visitors, summary: { totalVisits, totalTime, byPage }, events }
 *   GET    /owner/visitors/events?period=...  → { events: [{ timestamp, page, type }] }
 */

const getBaseUrl = () =>
  import.meta.env.VITE_OWNER_API_URL || "/api";

function getOwnerKey() {
  try {
    return sessionStorage.getItem("owner_key") || "";
  } catch {
    return "";
  }
}

function authHeaders() {
  const key = getOwnerKey();
  return {
    "Content-Type": "application/json",
    ...(key ? { "X-Owner-Key": key, Authorization: `Key ${key}` } : {}),
  };
}

async function request(endpoint, options = {}) {
  const url = `${getBaseUrl().replace(/\/$/, "")}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  if (!res.ok) {
    const err = new Error(res.statusText || "Request failed");
    err.status = res.status;
    err.body = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json().catch(() => ({}));
}

/** Validate owner key. Backend: POST /owner/validate or similar */
export async function validateOwnerKey(key) {
  try {
    const url = `${getBaseUrl().replace(/\/$/, "")}/owner/validate`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.valid === true || data.success === true)) return true;
    if (res.status === 401 || res.status === 403) return false;
    // When backend not ready: accept a dev key for frontend testing
    if (import.meta.env.DEV && key === "owner-dev-key") return true;
    return false;
  } catch {
    // Backend not reachable: allow dev key so you can build frontend
    if (import.meta.env.DEV && key === "owner-dev-key") return true;
    return false;
  }
}

/** Get all projects – backend: GET /owner/projects or /api/projects */
export async function getProjects() {
  try {
    return await request("/owner/projects");
  } catch {
    return { projects: [], total: 0 };
  }
}

/** Create project – backend: POST /owner/projects */
export async function createProject(payload) {
  return request("/owner/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Update project – backend: PATCH /owner/projects/:id */
export async function updateProject(id, payload) {
  return request(`/owner/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/** Delete project – backend: DELETE /owner/projects/:id */
export async function deleteProject(id) {
  return request(`/owner/projects/${id}`, { method: "DELETE" });
}

/**
 * Visitor stats – backend: GET /owner/visitors?period=day|week|month|year
 * Expected shape: { visitors: [...], summary: { totalVisits, totalTime, byPage } }
 */
export async function getVisitorStats(period = "week") {
  try {
    return await request(`/owner/visitors?period=${period}`);
  } catch {
    return {
      visitors: [],
      summary: { totalVisits: 0, totalTime: 0, byPage: [] },
      events: [],
      insights: {},
    };
  }
}

/**
 * Visitor events (clicks, page views) – GET /owner/visitors/events?period=...
 */
export async function getVisitorEvents(period = "week") {
  try {
    return await request(`/owner/visitors/events?period=${period}`);
  } catch {
    return { events: [] };
  }
}

/** GET /owner/content — { blocks: { home_panels, about, contact_info } } */
export async function getOwnerContent() {
  return request("/owner/content");
}

/** PATCH /owner/content/<slug> — body: { body: { ... } } */
export async function patchOwnerContent(slug, body) {
  return request(`/owner/content/${slug}`, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
}

/** GET /owner/messages — contact form submissions */
export async function getOwnerMessages() {
  try {
    const data = await request("/owner/messages");
    return data.messages || [];
  } catch {
    return [];
  }
}

/** PATCH /owner/messages/:id — body: { read: true|false } */
export async function patchOwnerMessageRead(id, read = true) {
  return request(`/owner/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ read }),
  });
}

/** Fired in the browser after inbox read state changes (welcome popup listens). */
export function notifyOwnerInboxUpdated() {
  try {
    window.dispatchEvent(new CustomEvent("owner-inbox-updated"));
  } catch {
    /* ignore */
  }
}

/**
 * Public portfolio API – projects, home, about, contact (no auth).
 * Uses VITE_OWNER_API_URL as base.
 */

const getBaseUrl = () =>
  import.meta.env.VITE_OWNER_API_URL || "";

async function get(endpoint) {
  const base = getBaseUrl();
  if (!base) return null;
  const res = await fetch(`${base.replace(/\/$/, "")}${endpoint}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

async function post(endpoint, body) {
  const base = getBaseUrl();
  if (!base) throw new Error("No API URL");
  const res = await fetch(`${base.replace(/\/$/, "")}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

/** GET /api/projects */
export async function fetchProjects() {
  try {
    return await get("/projects");
  } catch {
    return { projects: [] };
  }
}

/** GET /api/home – panels, featuredProjects, works */
export async function fetchHome() {
  try {
    return await get("/home");
  } catch {
    return { panels: [], featuredProjects: [], works: [] };
  }
}

/** GET /api/about – skills, stack, experience */
export async function fetchAbout() {
  try {
    return await get("/about");
  } catch {
    return { skills: [], stack: [], experience: [] };
  }
}

/** GET /api/contact-info – email, location, status, socials */
export async function fetchContactInfo() {
  try {
    return await get("/contact-info");
  } catch {
    return null;
  }
}

/** POST /api/contact – submit message */
export async function submitContact(data) {
  return post("/contact", data);
}

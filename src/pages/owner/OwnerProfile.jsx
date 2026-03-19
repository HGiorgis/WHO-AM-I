import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { getOwnerContent, patchOwnerContent } from "@/api/ownerApi";

const TABS = [
  { id: "contact", label: "Contact & footer" },
  { id: "home", label: "Home panels" },
  { id: "about", label: "About page" },
];

const emptyPanel = () => ({
  num: "01",
  tag: "TAG",
  title: ["Line one", "Line two"],
  sub: "Short description for this panel.",
  accent: "#e84040",
  shape: "circle",
});

function normalizeContact(body) {
  return {
    email: body.email || "",
    location: body.location || "",
    status: body.status || "",
    responseTime: body.responseTime || "",
    socials: Array.isArray(body.socials) ? body.socials.map((s) => ({ label: s.label || "", href: s.href || "" })) : [],
  };
}

export default function OwnerProfile() {
  const [section, setSection] = useState("contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const [contact, setContact] = useState(normalizeContact({}));
  const [panels, setPanels] = useState([]);
  const [aboutText, setAboutText] = useState("{}");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { blocks = {} } = await getOwnerContent();
      setContact(normalizeContact(blocks.contact_info || {}));
      const hp = blocks.home_panels || {};
      setPanels(Array.isArray(hp.panels) && hp.panels.length ? hp.panels.map((p) => ({
        num: p.num || "01",
        tag: p.tag || "",
        title: Array.isArray(p.title) ? [...p.title, "", ""].slice(0, 2) : ["", ""],
        sub: p.sub || "",
        accent: p.accent || "#0f0f0f",
        shape: p.shape || "circle",
      })) : [emptyPanel()]);
      setAboutText(JSON.stringify(blocks.about || { skills: [], stack: [], experience: [] }, null, 2));
    } catch (e) {
      setError(e?.message || "Failed to load content");
      setPanels([emptyPanel()]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const saveContact = async () => {
    setSaving(true);
    setError(null);
    try {
      await patchOwnerContent("contact_info", {
        email: contact.email.trim(),
        location: contact.location.trim(),
        status: contact.status.trim(),
        responseTime: contact.responseTime.trim(),
        socials: contact.socials.filter((s) => s.label.trim() || s.href.trim()),
      });
      showNotice("Contact & footer saved.");
    } catch (e) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const saveHome = async () => {
    setSaving(true);
    setError(null);
    try {
      const cleaned = panels.map((p) => ({
        num: p.num?.trim() || "01",
        tag: p.tag?.trim() || "",
        title: [
          (p.title?.[0] ?? "").trim() || "—",
          (p.title?.[1] ?? "").trim() || "—",
        ],
        sub: p.sub?.trim() || "",
        accent: p.accent?.trim() || "#0f0f0f",
        shape: p.shape || "circle",
      }));
      await patchOwnerContent("home_panels", { panels: cleaned });
      showNotice("Home panels saved.");
    } catch (e) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    setError(null);
    try {
      const parsed = JSON.parse(aboutText);
      if (typeof parsed !== "object" || parsed === null) throw new Error("Root must be a JSON object");
      await patchOwnerContent("about", parsed);
      showNotice("About page saved.");
    } catch (e) {
      setError(e instanceof SyntaxError ? "Invalid JSON in About" : e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => {
    setContact((c) => ({ ...c, socials: [...c.socials, { label: "", href: "" }] }));
  };
  const removeSocial = (i) => {
    setContact((c) => ({ ...c, socials: c.socials.filter((_, j) => j !== i) }));
  };

  const addPanel = () => setPanels((p) => [...p, emptyPanel()]);
  const removePanel = (i) => setPanels((p) => (p.length <= 1 ? p : p.filter((_, j) => j !== i)));

  const updatePanel = (i, field, value) => {
    setPanels((prev) => {
      const next = [...prev];
      const row = { ...next[i] };
      if (field === "title0") row.title = [value, row.title?.[1] || ""];
      else if (field === "title1") row.title = [row.title?.[0] || "", value];
      else row[field] = value;
      next[i] = row;
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-mono text-[10px] text-ink/50 uppercase tracking-widest mb-2">Site profile</p>
        <h2 className="font-syne font-bold uppercase tracking-tight text-2xl mb-2">
          Content blocks
        </h2>
        <p className="text-sm text-ink/60 mb-8 max-w-2xl">
          Edit what appears on the Home page (hero panels), About page (skills, stack, experience), and Contact page plus the site footer (email, location, status, social links). Run{" "}
          <code className="font-mono text-xs bg-ink/5 px-1">python manage.py seed_data</code> to restore defaults.
        </p>

        {notice && (
          <div className="mb-6 border border-[#2ecc71]/30 bg-[#2ecc71]/10 px-4 py-3 font-mono text-xs text-ink">
            {notice}
          </div>
        )}
        {error && (
          <div className="mb-6 border border-[#e84040]/30 bg-[#e84040]/5 px-4 py-3 font-mono text-xs text-[#e84040]">
            {error}
          </div>
        )}

        <div className="flex gap-1 border border-ink/10 p-1 mb-8 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSection(t.id)}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                section === t.id ? "bg-ink text-paper" : "text-ink/60 hover:bg-ink/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-ink/50 font-mono text-sm py-16">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading…
          </div>
        ) : (
          <>
            {section === "contact" && (
              <div className="space-y-6 border border-ink/10 p-6 md:p-8">
                {[
                  ["email", "Email", "text"],
                  ["location", "Location", "text"],
                  ["status", "Status line", "text"],
                  ["responseTime", "Response time", "text"],
                ].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={contact[key]}
                      onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
                      className="w-full border border-ink/15 px-4 py-3 text-sm font-grotesk bg-transparent focus:outline-none focus:border-ink/40"
                    />
                  </div>
                ))}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
                      Social links (footer & contact)
                    </span>
                    <button
                      type="button"
                      onClick={addSocial}
                      className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink border border-ink/15 px-2 py-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {contact.socials.length === 0 && (
                      <p className="text-sm text-ink/40">No social links. Click Add.</p>
                    )}
                    {contact.socials.map((s, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <input
                          placeholder="Label"
                          value={s.label}
                          onChange={(e) => {
                            const v = e.target.value;
                            setContact((c) => {
                              const socials = [...c.socials];
                              socials[i] = { ...socials[i], label: v };
                              return { ...c, socials };
                            });
                          }}
                          className="flex-1 border border-ink/15 px-3 py-2 text-sm font-mono"
                        />
                        <input
                          placeholder="https://…"
                          value={s.href}
                          onChange={(e) => {
                            const v = e.target.value;
                            setContact((c) => {
                              const socials = [...c.socials];
                              socials[i] = { ...socials[i], href: v };
                              return { ...c, socials };
                            });
                          }}
                          className="flex-[2] border border-ink/15 px-3 py-2 text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => removeSocial(i)}
                          className="p-2 text-ink/40 hover:text-[#e84040] border border-ink/10"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveContact}
                  className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#2ecc71] hover:text-ink transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save contact & footer
                </button>
              </div>
            )}

            {section === "home" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-ink/60">Panels shown on the Home page below the hero.</p>
                  <button
                    type="button"
                    onClick={addPanel}
                    className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest border border-ink/15 px-3 py-2 hover:bg-ink/5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add panel
                  </button>
                </div>
                {panels.map((p, i) => (
                  <div key={i} className="border border-ink/10 p-6 space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removePanel(i)}
                      className="absolute top-4 right-4 p-2 text-ink/40 hover:text-[#e84040]"
                      aria-label="Remove panel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid sm:grid-cols-2 gap-4 pr-10">
                      <Field label="Num" value={p.num} onChange={(v) => updatePanel(i, "num", v)} />
                      <Field label="Tag" value={p.tag} onChange={(v) => updatePanel(i, "tag", v)} />
                    </div>
                    <Field label="Title line 1" value={p.title?.[0] || ""} onChange={(v) => updatePanel(i, "title0", v)} />
                    <Field label="Title line 2" value={p.title?.[1] || ""} onChange={(v) => updatePanel(i, "title1", v)} />
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block mb-1">Sub</label>
                      <textarea
                        value={p.sub}
                        onChange={(e) => updatePanel(i, "sub", e.target.value)}
                        rows={3}
                        className="w-full border border-ink/15 px-4 py-3 text-sm font-grotesk bg-transparent resize-y"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Accent (hex)" value={p.accent} onChange={(v) => updatePanel(i, "accent", v)} />
                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block mb-1">Shape</label>
                        <select
                          value={p.shape}
                          onChange={(e) => updatePanel(i, "shape", e.target.value)}
                          className="w-full border border-ink/15 px-4 py-3 text-sm font-mono bg-paper"
                        >
                          <option value="circle">circle</option>
                          <option value="square">square</option>
                          <option value="diamond">diamond</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveHome}
                  className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#2ecc71] hover:text-ink transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save home panels
                </button>
              </div>
            )}

            {section === "about" && (
              <div className="space-y-4 border border-ink/10 p-6 md:p-8">
                <p className="text-sm text-ink/60">
                  JSON object with <code className="font-mono text-xs">skills</code>, <code className="font-mono text-xs">stack</code>, and{" "}
                  <code className="font-mono text-xs">experience</code> arrays (same shape as <code className="font-mono text-xs">seed_data.py</code>).
                </p>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  spellCheck={false}
                  className="w-full min-h-[420px] border border-ink/15 p-4 font-mono text-xs leading-relaxed bg-ink/[0.02]"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveAbout}
                    className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#2ecc71] hover:text-ink transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save about page
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const o = JSON.parse(aboutText);
                        setAboutText(JSON.stringify(o, null, 2));
                      } catch {
                        setError("Cannot format: invalid JSON");
                      }
                    }}
                    className="font-mono text-[11px] uppercase tracking-widest border border-ink/15 px-4 py-3 hover:bg-ink/5"
                  >
                    Format JSON
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 block mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/15 px-4 py-3 text-sm font-grotesk bg-transparent"
      />
    </div>
  );
}

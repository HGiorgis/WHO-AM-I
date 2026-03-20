import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle, FileText } from "lucide-react";
import MarqueeBand from "../components/layout/MarqueeBand";
import { fetchContactInfo, submitContact } from "@/api/portfolioApi";
import { trackEvent } from "@/api/trackApi";

/** Matches seeded `CONTACT_INFO_BODY` when API is unavailable */
const contactInfoFallback = {
  email: "hailegiorgiswagaye@gmail.com",
  location: "Addis Ababa, Ethiopia",
  status: "Available for new projects",
  responseTime: "Within 24–48 hours",
  resumeUrl: "/HailegiorgisWagayeResume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/hgiorgis" },
    { label: "LinkedIn", href: "https://linkedin.com/in/hgiorgis23" },
    { label: "Twitter", href: "https://twitter.com/hgiorgis" },
  ],
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(null);
  const [info, setInfo] = useState(contactInfoFallback);

  useEffect(() => {
    fetchContactInfo()
      .then((data) => {
        if (data && (data.email || data.socials?.length))
          setInfo({ ...contactInfoFallback, ...data });
      })
      .catch(() => {});
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    setError(null);
    trackEvent("click", "contact_submit", "/Contact");
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      trackEvent("submit", "contact_form_success", "/Contact");
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err?.message || "Failed to send. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Header */}
      <section className="pt-32 pb-0 px-6 md:px-10 border-b border-ink/10">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-6"
          >
            04 — Contact
          </motion.p>
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-syne font-bold uppercase leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              LET'S
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-syne font-bold uppercase leading-none tracking-tight text-[#2ecc71]"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              CONNECT
            </motion.h1>
          </div>
        </div>
      </section>

      <MarqueeBand />

      {/* Main grid */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-lg text-ink/70 leading-relaxed mb-10 max-w-sm">
              Have a project in mind, a role to fill, or just want to say hi?
              I'm always open to new conversations.
            </p>

            <div className="space-y-5 mb-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${info.email || ""}`}
                  className="font-grotesk text-sm hover:text-[#2ecc71] transition-colors flex items-center gap-1 group"
                >
                  {info.email || "—"}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-1">
                  Location
                </p>
                <p className="font-grotesk text-sm">{info.location || "—"}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse" />
                  <p className="font-grotesk text-sm">{info.status || "—"}</p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-1">
                  Response Time
                </p>
                <p className="font-grotesk text-sm">
                  {info.responseTime || "—"}
                </p>
              </div>
            </div>

            {/* Resume download */}

            <a
              href="/HailegiorgisWagayeResume.pdf"
              download
              onClick={() =>
                trackEvent(
                  "download",
                  "HailegiorgisWagayeResume.pdf",
                  "/Contact",
                )
              }
              className="font-mono text-xs uppercase tracking-widest border border-ink/40 px-6 py-3 hover:border-ink hover:bg-ink/5 transition-colors inline-flex items-center gap-2 mb-10"
            >
              <FileText className="w-3.5 h-3.5" />
              See Resume
            </a>
            {/* Socials */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-4">
                Socials
              </p>
              <div className="flex flex-wrap gap-3">
                {(info.socials || []).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="flex items-center gap-1 px-4 py-2 border border-ink/20 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper hover:border-ink transition-all group"
                  >
                    {s.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-16 h-16 border border-[#2ecc71] flex items-center justify-center mb-6">
                    <CheckCircle className="w-7 h-7 text-[#2ecc71]" />
                  </div>
                  <h3 className="font-syne font-bold text-2xl uppercase mb-2">
                    Message Sent
                  </h3>
                  <p className="text-sm text-ink/50">I'll be in touch soon.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handle}
                  className="space-y-0 divide-y divide-ink/10 border border-ink/10"
                >
                  {error && (
                    <p className="px-4 py-3 text-sm text-[#e84040] bg-[#e84040]/10 border-b border-ink/10">
                      {error}
                    </p>
                  )}
                  {[
                    {
                      key: "name",
                      label: "Your Name",
                      type: "text",
                      placeholder: "John Doe",
                    },
                    {
                      key: "email",
                      label: "Email Address",
                      type: "email",
                      placeholder: "john@example.com",
                    },
                  ].map((f) => (
                    <div key={f.key} className="relative">
                      <motion.label
                        animate={{
                          y: focused === f.key || form[f.key] ? 8 : 22,
                          fontSize:
                            focused === f.key || form[f.key] ? "10px" : "13px",
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-4 font-mono uppercase tracking-widest text-ink/40 pointer-events-none z-10"
                        style={{ top: 0 }}
                      >
                        {f.label}
                      </motion.label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        onFocus={() => setFocused(f.key)}
                        onBlur={() => setFocused(null)}
                        onChange={(e) =>
                          setForm({ ...form, [f.key]: e.target.value })
                        }
                        required
                        className="w-full bg-transparent pt-7 pb-3 px-4 text-sm font-grotesk outline-none focus:bg-[#2ecc71]/5 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="relative">
                    <motion.label
                      animate={{
                        y: focused === "message" || form.message ? 8 : 22,
                        fontSize:
                          focused === "message" || form.message
                            ? "10px"
                            : "13px",
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-4 font-mono uppercase tracking-widest text-ink/40 pointer-events-none z-10"
                      style={{ top: 0 }}
                    >
                      Message
                    </motion.label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                      className="w-full bg-transparent pt-7 pb-3 px-4 text-sm font-grotesk outline-none resize-none focus:bg-[#2ecc71]/5 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-ink text-paper font-mono text-xs uppercase tracking-widest py-5 hover:bg-[#2ecc71] hover:text-ink transition-colors flex items-center justify-center gap-2 group"
                  >
                    Send Message
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

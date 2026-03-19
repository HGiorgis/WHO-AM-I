import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "Delivered a complex KYC verification system on time with exceptional code quality. Security-first mindset throughout.",
    name: "Ahmed Al-Rashid",
    role: "CTO, FinTech Startup",
    color: "#e84040",
  },
  {
    quote:
      "The SaaS platform he built handles thousands of daily users without a hiccup. Clean architecture, zero technical debt.",
    name: "Sara Mitchell",
    role: "Product Manager, SaaS Co.",
    color: "#f5c842",
  },
  {
    quote:
      "Our infrastructure costs dropped 40% after he redesigned our Docker + CI/CD setup. Absolute DevOps wizard.",
    name: "James Okafor",
    role: "Engineering Lead, ScaleUp",
    color: "#4fa3e0",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="border-t border-ink/10 py-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-12 text-center">
          What Clients Say
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div
              className="w-1 h-12 mx-auto mb-8"
              style={{ background: t.color }}
            />
            <p
              className="font-syne font-bold leading-snug mb-8 text-ink"
              style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}
            >
              "{t.quote}"
            </p>
            <p className="font-grotesk text-sm font-medium text-ink">
              {t.name}
            </p>
            <p className="font-mono text-xs text-ink/40 uppercase tracking-widest mt-1">
              {t.role}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 border border-ink/20 flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: i === current ? t.color : "rgba(0,0,0,0.2)",
                  transform: i === current ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 border border-ink/20 flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

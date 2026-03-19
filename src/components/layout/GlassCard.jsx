import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : {}}
      className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/20 ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

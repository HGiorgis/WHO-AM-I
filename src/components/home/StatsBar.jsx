import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "8+", label: "Years Experience" },
  { value: "50+", label: "Projects Delivered" },
  { value: "99.9%", label: "Uptime Achieved" },
  { value: "20+", label: "Technologies" },
];

export default function StatsBar() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02]"
            >
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

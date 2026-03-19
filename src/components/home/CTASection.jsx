import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-primary/5 via-white/[0.02] to-accent/5 backdrop-blur-xl p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Amazing
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Have a project in mind? I'm always open to discussing new
            opportunities and exciting challenges.
          </p>
          <Link
            to="/Contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 group"
          >
            Get In Touch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

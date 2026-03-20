import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-32 left-[15%] w-2 h-2 rounded-full bg-primary/60 animate-float" />
      <div
        className="absolute top-48 right-[20%] w-1.5 h-1.5 rounded-full bg-accent/60 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-40 left-[25%] w-1 h-1 rounded-full bg-primary/40 animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Available for new projects
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
        >
          <span className="text-foreground">I Build</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Digital Systems
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          <span className="font-semibold text-foreground/90">HGIORGIS</span>
          {" — "}Hailegiorgis Wagaye: full-stack, systems & DevOps — building
          secure, scalable backends and products that ship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/Projects"
            className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            View My Work
          </Link>
          <Link
            to="/About"
            className="px-8 py-3.5 border border-border rounded-xl font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            About Me
          </Link>
        </motion.div>

        {/* Terminal snippet */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 max-w-xl mx-auto"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">
                terminal
              </span>
            </div>
            <div className="p-5 font-mono text-sm text-left">
              <p className="text-muted-foreground">
                <span className="text-primary">→</span> ~/portfolio
              </p>
              <p className="mt-1">
                <span className="text-green-400">$</span>{" "}
                <span className="text-foreground">
                  echo &quot;HGIORGIS&quot;
                </span>
              </p>
              <p className="text-muted-foreground mt-1">
                Hailegiorgis Wagaye — full-stack · systems · DevOps
              </p>
              <p className="mt-2">
                <span className="text-green-400">$</span>{" "}
                <span className="text-foreground">cat skills.json</span>
              </p>
              <p className="text-primary mt-1">
                {`{ "stack": ["Laravel", "Django", "Node", "React", "Docker"] }`}
              </p>
              <p className="mt-2 flex items-center">
                <span className="text-green-400">$</span>{" "}
                <span className="w-2 h-5 bg-primary/70 animate-pulse ml-1" />
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

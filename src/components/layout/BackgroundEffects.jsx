import React from "react";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary gradient orb */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] animate-glow" />
      {/* Accent gradient orb */}
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px] animate-glow"
        style={{ animationDelay: "1.5s" }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

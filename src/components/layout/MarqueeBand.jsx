import React from "react";

const items = [
  "WEB DEVELOPER",
  "★",
  "SYSTEM ENGINEER",
  "★",
  "DEVOPS ARCHITECT",
  "★",
  "CLOUD NATIVE",
  "★",
  "FULL STACK",
  "★",
  "OPEN SOURCE",
  "★",
  "WEB DEVELOPER",
  "★",
  "SYSTEM ENGINEER",
  "★",
  "DEVOPS ARCHITECT",
  "★",
  "CLOUD NATIVE",
  "★",
  "FULL STACK",
  "★",
  "OPEN SOURCE",
  "★",
];

export default function MarqueeBand({ inverted = false }) {
  return (
    <div
      className={`overflow-hidden py-3 border-y border-ink/10 ${inverted ? "bg-ink" : "bg-paper"}`}
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {items.concat(items).map((item, i) => (
          <span
            key={i}
            className={`font-mono text-xs tracking-[0.25em] uppercase px-4 ${
              inverted ? "text-paper/40" : "text-ink/30"
            } ${item === "★" ? (inverted ? "text-[#f5c842]" : "text-[#e84040]") : ""}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

/**
 * 5-tile L conveyor: same motion as before, styled for the site (ink/paper, sharp tiles).
 * Default: transparent, works on paper. `variant="dark"` for ink/dark surfaces (outlines in paper).
 */
export default function SquareFlowLoader({
  className,
  label = "Loading",
  size = "md",
  variant = "default",
}) {
  const sizes = {
    sm: "conveyor-loader--sm",
    md: "conveyor-loader--md",
    lg: "conveyor-loader--lg",
  };

  return (
    <div
      className={cn(
        "conveyor-loader",
        sizes[size] || sizes.md,
        variant === "dark" && "conveyor-loader--dark",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div className="conveyor-loader__stage">
        <span className="conveyor-loader__tile" aria-hidden />
        <span className="conveyor-loader__tile" aria-hidden />
        <span className="conveyor-loader__tile" aria-hidden />
        <span className="conveyor-loader__tile" aria-hidden />
        <span className="conveyor-loader__tile" aria-hidden />
      </div>
    </div>
  );
}

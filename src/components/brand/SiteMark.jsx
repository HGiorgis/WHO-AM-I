import React, { useId } from "react";

/**
 * Same visual as /favicon.svg — pixel H, orange accent, light/dark via prefers-color-scheme.
 */
export default function SiteMark({
  className = "w-9 h-9",
  title = "HGIORGIS",
  "aria-hidden": ariaHidden,
  ...props
}) {
  const gid = useId().replace(/:/g, "");
  const accentId = `accentPx-${gid}`;
  const accentLightId = `accentPxLight-${gid}`;
  const scope = `siteMarkPx-${gid}`;
  const hide = ariaHidden === true;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={`${scope} ${className}`.trim()}
      role="img"
      aria-hidden={hide ? true : undefined}
      aria-label={hide ? undefined : title}
      {...props}
    >
      {!hide && <title>{title}</title>}
      <defs>
        <linearGradient id={accentId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6a00" />
          <stop offset="100%" stopColor="#ffb020" />
        </linearGradient>
        <linearGradient id={accentLightId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="100%" stopColor="#ff9100" />
        </linearGradient>
      </defs>
      <style>{`
        .${scope} .px-bg { fill: #0b0b0d; }
        .${scope} .px-w { fill: #f4f4f5; }
        .${scope} .px-a { fill: url(#${accentId}); }
        @media (prefers-color-scheme: light) {
          .${scope} .px-bg { fill: #fff8f4; }
          .${scope} .px-w { fill: #121214; }
          .${scope} .px-a { fill: url(#${accentLightId}); }
        }
      `}</style>
      <rect className="px-bg" width="32" height="32" rx="6" />
      <g transform="translate(4,4)">
        <rect className="px-a" x="1" y="-1" width="6" height="6" rx="1" />
        <rect className="px-w" x="1" y="6" width="6" height="6" rx="1" />
        <rect className="px-w" x="8" y="13" width="6" height="6" rx="1" />
        <rect className="px-w" x="16" y="13" width="6" height="6" rx="1" />
        <rect className="px-w" x="16" y="6" width="6" height="6" rx="1" />
        <rect className="px-w" x="16" y="20" width="6" height="6" rx="1" />
      </g>
    </svg>
  );
}

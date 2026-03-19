import React, { useId } from "react";

/**
 * Same visual as /favicon.svg — use for navbar, hero, etc.
 */
export default function SiteMark({
  className = "w-9 h-9",
  title = "Whoami",
  "aria-hidden": ariaHidden,
  ...props
}) {
  const gid = useId().replace(/:/g, "");
  const gradId = `siteMarkGrad-${gid}`;
  const hide = ariaHidden === true;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-hidden={hide ? true : undefined}
      aria-label={hide ? undefined : title}
      {...props}
    >
      {!hide && <title>{title}</title>}
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0f0f0f" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradId})`} />
      <path
        d="M16 7.5l7.2 8.5L16 24.5l-7.2-8.5L16 7.5z"
        fill="none"
        stroke="#f5f4f0"
        strokeWidth="1.15"
        strokeLinejoin="round"
        opacity="0.92"
      />
      <circle
        cx="16"
        cy="16"
        r="5.5"
        fill="none"
        stroke="#e84040"
        strokeWidth="0.9"
        opacity="0.55"
        strokeDasharray="3.2 2.4"
      />
      <circle
        cx="16"
        cy="16"
        r="3.2"
        fill="none"
        stroke="#f5f4f0"
        strokeWidth="0.75"
        opacity="0.35"
        strokeDasharray="2 2"
      />
      <circle cx="16" cy="16" r="2" fill="#e84040" />
      <circle cx="16" cy="16" r="0.85" fill="#f5f4f0" opacity="0.9" />
    </svg>
  );
}

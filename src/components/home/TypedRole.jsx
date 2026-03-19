import React, { useEffect, useState } from "react";

const roles = [
  "BACKEND ARCHITECT",
  "SAAS BUILDER",
  "DEVOPS ENGINEER",
  "SECURITY SPECIALIST",
  "FULL-STACK DEV",
];

export default function TypedRole() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = roles[roleIdx];
    let timeout;

    if (!deleting && displayed.length < full.length) {
      timeout = setTimeout(
        () => setDisplayed(full.slice(0, displayed.length + 1)),
        60,
      );
    } else if (!deleting && displayed.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  return (
    <span className="font-mono text-xs text-[#e84040] uppercase tracking-[0.3em]">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

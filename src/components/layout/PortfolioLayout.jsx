import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarNew from "./NavbarNew";
import FooterNew from "./FooterNew";
import Cursor from "./Cursor";
import ScrollProgress from "./ScrollProgress";
import BackToTop from "./BackToTop";
import { trackPageView, trackLeave } from "@/api/trackApi";
import { useAdvancedAnalytics } from "@/hooks/useAdvancedAnalytics";

export default function PortfolioLayout() {
  const location = useLocation();
  useAdvancedAnalytics(location.pathname || "/");
  const pathRef = useRef("");
  const startRef = useRef(0);

  useEffect(() => {
    const path = location.pathname || "/";
    // When navigating away from previous page, send time-on-page before switching
    const prevPath = pathRef.current;
    if (prevPath && prevPath !== path) {
      const duration = (Date.now() - startRef.current) / 1000;
      trackLeave(prevPath, duration);
    }
    trackPageView(path);
    pathRef.current = path;
    startRef.current = Date.now();
  }, [location.pathname]);

  useEffect(() => {
    const onLeave = () => {
      const duration = (Date.now() - startRef.current) / 1000;
      trackLeave(pathRef.current, duration);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") onLeave();
    };
    window.addEventListener("beforeunload", onLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("beforeunload", onLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-grotesk">
      <ScrollProgress />
      <Cursor />
      <BackToTop />
      <NavbarNew />
      <main>
        <Outlet />
      </main>
      <FooterNew />
    </div>
  );
}

// App.tsx - Full Router Integration + SideNav + Realm System
import React, { useState, useEffect } from "react";
import { Terminal } from "./components/Terminal";
import { CyberBackground } from "./components/CyberBackground";
import { DevRealm } from "./components/DevRealm";
import { DesignVault } from "./components/DesignVault";
import { GameSanctum } from "./components/GameSanctum";
import { CyberRealm } from "./components/CyberRealm";
import { Home } from "./components/Home";
import  Project  from "./components/Project";
import { RealmTransition } from "./components/RealmTransition";

import {
  Lock,
  Unlock,
  Terminal as TerminalIcon,
  Zap,
  Eye,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SideNav } from "./components/SideNav";

export type AccessLevel = "public" | "design" | "game";
export type CurrentRealm = "home" | "cyber" | "dev" | "design" | "game";

interface LockedPopup {
  id: string;
  realm: string;
  message: string;
  hint: string;
  icon: React.ReactNode;
}

const Blog = () => (
  <div className="text-white p-20 text-4xl font-light">BLOG</div>
);

const Contact = () => (
  <div className="text-white p-20 text-4xl font-light">CONTACT</div>
);

export default function Portfolio() {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("public");
  const [currentRealm, setCurrentRealm] = useState<CurrentRealm>("home");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [lockedPopups, setLockedPopups] = useState<LockedPopup[]>([]);
  const [terminalHover, setTerminalHover] = useState(false);

  useEffect(() => {
    const handleOpenTerminal = () => setTerminalOpen(true);
    window.addEventListener("openTerminal", handleOpenTerminal);
    return () =>
      window.removeEventListener("openTerminal", handleOpenTerminal);
  }, []);

  const showLockedPopup = (realm: string) => {
    const popup: LockedPopup = {
      id: Date.now().toString(),
      realm,
      message: `🔒 ${
        realm === "design" ? "Design Vault" : "Game Sanctum"
      } is locked`,
      hint:
        realm === "design"
          ? "Try: unlock design DESIGN_2024"
          : "Try: unlock game GAME_MASTER",
      icon:
        realm === "design" ? (
          <Eye className="w-5 h-5" />
        ) : (
          <Zap className="w-5 h-5" />
        ),
    };

    setLockedPopups((prev) => [...prev, popup]);

    setTimeout(() => {
      setLockedPopups((prev) =>
        prev.filter((p) => p.id !== popup.id)
      );
    }, 5000);
  };

  const removePopup = (id: string) => {
    setLockedPopups((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAccessCode = (code: string, realm: string) => {
    if (code === "DESIGN_2024" && realm === "design") {
      setAccessLevel("design");
      triggerRealmTransition("design");
      setLockedPopups((prev) =>
        prev.filter((p) => p.realm !== "design")
      );
    }
    if (code === "GAME_MASTER" && realm === "game") {
      setAccessLevel("game");
      triggerRealmTransition("game");
      setLockedPopups((prev) =>
        prev.filter((p) => p.realm !== "game")
      );
    }
  };

  const triggerRealmTransition = (targetRealm: CurrentRealm) => {
    setIsTransitioning(true);
    setShowContent(false);

    setTimeout(() => {
      setCurrentRealm(targetRealm);
      setIsTransitioning(false);
      setShowContent(true);
    }, 1500);
  };

  const handleRealmChange = (realm: string) => {
    const targetRealm = realm as CurrentRealm;

    if (targetRealm === "design" && accessLevel !== "design") {
      showLockedPopup("design");
      setTerminalOpen(true);
      return;
    }

    if (targetRealm === "game" && accessLevel !== "game") {
      showLockedPopup("game");
      setTerminalOpen(true);
      return;
    }

    if (targetRealm === currentRealm) return;

    triggerRealmTransition(targetRealm);
  };

  const renderCurrentRealm = () => {
    if (!showContent) return null;

    switch (currentRealm) {
      case "home":
        return <Home onRealmChange={handleRealmChange} />;
      case "cyber":
        return <CyberRealm onRealmChange={handleRealmChange} />;
      case "dev":
        return <DevRealm onRealmChange={handleRealmChange} />;
      case "design":
        return accessLevel === "design" ? (
          <DesignVault onRealmChange={handleRealmChange} />
        ) : (
          <LockedRealm
            realm="design"
            onRealmChange={handleRealmChange}
          />
        );
      case "game":
        return accessLevel === "game" ? (
          <GameSanctum onRealmChange={handleRealmChange} />
        ) : (
          <LockedRealm
            realm="game"
            onRealmChange={handleRealmChange}
          />
        );
      default:
        return <Home onRealmChange={handleRealmChange} />;
    }
  };

  return (
    <Router>
      <div className="relative bg-black min-h-screen overflow-hidden">
        {/* SIDE NAV (NOW SAFE INSIDE ROUTER) */}
        <SideNav />
        
        {/* BACKGROUND */}
        <div className="fixed inset-0">
          <CyberBackground active={currentRealm === "cyber" || currentRealm === "home"} />
          <div
            className={`absolute inset-0 transition-all duration-1000 ${
              currentRealm === "home"
                ? "bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black"
                : currentRealm === "cyber"
                ? "bg-gradient-to-br from-emerald-900/20 via-green-900/10 to-black"
                : currentRealm === "dev"
                ? "bg-gradient-to-br from-blue-900/20 via-indigo-900/10 to-black"
                : currentRealm === "design"
                ? "bg-gradient-to-br from-yellow-900/20 via-orange-900/10 to-black"
                : "bg-gradient-to-br from-cyan-900/20 via-blue-900/10 to-black"
            }`}
          />
        </div>

        {/* TRANSITION */}
        <RealmTransition
          isActive={isTransitioning}
          fromRealm={currentRealm}
        />

        {/* ROUTES */}
        <div className="relative z-10">
          <Routes>
            {/* HOME REALM PAGE */}
            <Route
              path="/"
              element={
                <>
                  {/* TERMINAL */}
                  <Terminal
                    isOpen={terminalOpen}
                    onToggle={() =>
                      setTerminalOpen(!terminalOpen)
                    }
                    onAccessCode={handleAccessCode}
                    currentRealm={currentRealm}
                    onRealmChange={handleRealmChange}
                  />

                  {/* TERMINAL BUTTON */}
                  <button
                    onClick={() => setTerminalOpen(true)}
                    onMouseEnter={() => setTerminalHover(true)}
                    onMouseLeave={() => setTerminalHover(false)}
                    className={`fixed top-6 right-6 z-50 font-mono text-sm border transition-all duration-500 transform ${
                      terminalHover
                        ? "bg-cyan-500/90 text-white scale-110 shadow-2xl shadow-cyan-500/50 border-cyan-400 "
                        : "bg-cyan-600/80 text-cyan-200 scale-100 shadow-lg shadow-cyan-500/20 border-cyan-400/50"
                    } p-3 rounded-xl backdrop-blur-sm`}
                  >
                    <div className="flex items-center space-x-2 transition-all duration-500">
                      <TerminalIcon className="w-5 h-5 transition-all duration-500" />
                      {terminalHover && (
                        <span className="text-xs animate-pulse transition-all duration-500">
                          ACCESS_TERMINAL
                        </span>
                      )}
                    </div>
                  </button>

                  {/* POPUPS */}
                  <div className="fixed bottom-6 right-6 z-40 space-y-3">
                    {lockedPopups.map((popup, index) => (
                      <LockedPopupNotification
                        key={popup.id}
                        popup={popup}
                        index={index}
                        onRemove={removePopup}
                        onTerminalOpen={() =>
                          setTerminalOpen(true)
                        }
                      />
                    ))}
                  </div>

                  {/* REALM CONTENT */}
                  <div
                    className={`transition-all duration-700 ${
                      showContent
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {renderCurrentRealm()}
                  </div>
                </>
              }
            />

            {/* SEPARATE ROUTES */}
            <Route path="/projects" element={<Project />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

/* ============= LOCKED POPUP ============= */
const LockedPopupNotification = ({
  popup,
  index,
  onRemove,
  onTerminalOpen,
}: {
  popup: LockedPopup;
  index: number;
  onRemove: (id: string) => void;
  onTerminalOpen: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(
      () => setIsVisible(true),
      80 * index
    );
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`flex items-start space-x-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm max-w-sm transform transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-full scale-95"
      } hover:scale-105 hover:border-red-400/50 cursor-pointer`}
      onClick={onTerminalOpen}
    >
      <div className="relative">
        <Lock className="w-6 h-6 text-red-400 animate-pulse" />
        <AlertTriangle className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-bounce" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          {popup.icon}
          <span className="text-red-300 font-semibold text-sm">
            {popup.realm === "design"
              ? "DESIGN VAULT"
              : "GAME SANCTUM"}
          </span>
        </div>
        <p className="text-red-200 text-xs mb-2">
          {popup.message}
        </p>

        <div className="flex items-center space-x-2">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
          <code className="text-yellow-300 text-xs font-mono bg-yellow-500/10 px-2 py-1 rounded">
            {popup.hint}
          </code>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(popup.id);
        }}
        className="text-red-400 hover:text-white transition-colors p-1 hover:bg-red-500/20 rounded"
      >
        <Unlock className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ============= LOCKED REALM PAGE ============= */
const LockedRealm = ({
  realm,
  onRealmChange,
}: {
  realm: string;
  onRealmChange: (realm: string) => void;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-white text-3xl">
      {realm.toUpperCase()} REALM LOCKED
    </div>
  );
};

import React from "react";
import { Outlet } from "react-router-dom";
import { useOwner } from "@/lib/OwnerContext";
import SquareFlowLoader from "@/components/ui/SquareFlowLoader";
import OwnerKeyGate from "./OwnerKeyGate";

export default function OwnerPage() {
  const { unlocked, loading } = useOwner();

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center gap-4">
        <SquareFlowLoader size="lg" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
          Loading
        </span>
      </div>
    );
  }

  if (!unlocked) {
    return <OwnerKeyGate />;
  }

  return <Outlet />;
}

import React from "react";
import { Outlet } from "react-router-dom";
import { useOwner } from "@/lib/OwnerContext";
import OwnerKeyGate from "./OwnerKeyGate";

export default function OwnerPage() {
  const { unlocked, loading } = useOwner();

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  if (!unlocked) {
    return <OwnerKeyGate />;
  }

  return <Outlet />;
}

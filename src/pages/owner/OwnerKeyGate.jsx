import React, { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Loader2 } from "lucide-react";
import { useOwner } from "@/lib/OwnerContext";

export default function OwnerKeyGate() {
  const { unlock } = useOwner();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!key.trim()) {
      setError("Enter your owner key.");
      return;
    }
    setLoading(true);
    try {
      const ok = await unlock(key.trim());
      if (!ok) setError("Invalid key. Try again.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="border border-ink/15 p-8 md:p-10 bg-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 border border-ink/20 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-ink/70" />
            </div>
            <div>
              <h1 className="font-syne font-bold uppercase tracking-tight text-ink text-xl">
                Owner access
              </h1>
              <p className="font-mono text-[11px] text-ink/50 uppercase tracking-widest mt-0.5">
                Portfolio dashboard
              </p>
            </div>
          </div>

          <p className="text-sm text-ink/60 mb-6">
            Enter your owner key to manage your portfolio and view analytics.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50">
              Owner key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="••••••••••••••••"
              autoComplete="off"
              className="w-full border border-ink/15 bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40 transition-colors"
              disabled={loading}
            />
            {error && (
              <p className="text-xs text-red-600 font-mono">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full border border-ink bg-ink text-paper py-3 font-syne font-bold uppercase tracking-tight text-sm hover:bg-ink/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Unlock"
              )}
            </button>
          </form>

          {import.meta.env.DEV && (
            <p className="mt-6 font-mono text-[10px] text-ink/40 border-t border-ink/10 pt-4">
              Dev: use <code className="bg-ink/10 px-1">owner-dev-key</code> if
              backend is not connected.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

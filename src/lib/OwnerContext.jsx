import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { validateOwnerKey as apiValidateKey } from "@/api/ownerApi";

const STORAGE_KEY = "owner_key";
const VALIDATED_KEY = "owner_key_validated";

const OwnerContext = createContext(null);

export function OwnerProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const validateStored = useCallback(async () => {
    try {
      const key = sessionStorage.getItem(STORAGE_KEY);
      const validated = sessionStorage.getItem(VALIDATED_KEY);
      if (!key || validated !== "1") {
        setUnlocked(false);
        return;
      }
      const ok = await apiValidateKey(key);
      if (!ok) {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(VALIDATED_KEY);
        setUnlocked(false);
      } else {
        setUnlocked(true);
      }
    } catch {
      setUnlocked(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateStored();
  }, [validateStored]);

  const unlock = useCallback(async (key) => {
    const ok = await apiValidateKey(key);
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, key);
      sessionStorage.setItem(VALIDATED_KEY, "1");
      setUnlocked(true);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(VALIDATED_KEY);
    setUnlocked(false);
  }, []);

  return (
    <OwnerContext.Provider value={{ unlocked, loading, unlock, lock, validateStored }}>
      {children}
    </OwnerContext.Provider>
  );
}

export function useOwner() {
  const ctx = useContext(OwnerContext);
  if (!ctx) throw new Error("useOwner must be used within OwnerProvider");
  return ctx;
}

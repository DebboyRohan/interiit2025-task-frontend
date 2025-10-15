"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth-store";

export function useStoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch current user if token exists but user doesn't
  useEffect(() => {
    if (isHydrated && token && !user) {
      // Optionally fetch user from API to verify token
      // This is useful if you want to validate the token on mount
      // For now, we trust the persisted state
    }
  }, [isHydrated, token, user]);

  return isHydrated;
}

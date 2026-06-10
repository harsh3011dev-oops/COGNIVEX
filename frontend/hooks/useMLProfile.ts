"use client";

import * as React from "react";
import { auth } from "@/lib/firebase";
import { getMLProfile, type MLProfile } from "@/lib/api";

const ML_REFETCH_EVENT = "cognivex:ml-refetch";

export function dispatchMLRefetch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ML_REFETCH_EVENT));
  }
}

export function useMLProfile() {
  const [mlProfile, setMlProfile] = React.useState<MLProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchProfile = React.useCallback(async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await getMLProfile(userId);
      setMlProfile(profile);
    } catch (err) {
      console.error("Failed to fetch ML profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load ML profile");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();

    const handleRefetch = () => {
      fetchProfile();
    };

    window.addEventListener(ML_REFETCH_EVENT, handleRefetch);
    return () => window.removeEventListener(ML_REFETCH_EVENT, handleRefetch);
  }, [fetchProfile]);

  return { mlProfile, loading, error, refetch: fetchProfile };
}

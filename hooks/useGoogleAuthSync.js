"use client";

import { useEffect } from "react";

export default function useGoogleAuthSync({
  session,
  googleStatus,
  setAuthState,
}) {
  useEffect(() => {
    console.log("🔵 Google Sync", { session, googleStatus });

    if (googleStatus !== "authenticated") return;
    if (!session?.user) return;

    const backendToken = session.user.accessToken;

    setAuthState({
      user: { ...session.user, source: "google" },
      token: backendToken,
      isAuthenticated: !!backendToken,
      loading: false,
    });
  }, [session, googleStatus]);
}

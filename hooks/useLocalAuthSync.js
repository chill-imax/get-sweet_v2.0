"use client";
import { useEffect } from "react";

export default function useLocalAuthSync({ googleStatus, setAuthState }) {
  useEffect(() => {
    if (googleStatus === "authenticated") return;

    console.log("🟡 Cargando LocalStorage Auth...");

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setAuthState({
        user: parsedUser,
        token: storedToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      localStorage.clear();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, [googleStatus]);
}

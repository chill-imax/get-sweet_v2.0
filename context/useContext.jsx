"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  // =========================
  // 1. ESPERAR NEXTAUTH
  // =========================
  useEffect(() => {
    if (status === "loading") return;

    // Usuario NO autenticado
    if (status === "unauthenticated") {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
      return;
    }

    // Usuario autenticado -> tenemos session.user
    if (status === "authenticated" && session?.user?.accessToken) {
      const token = session.user.accessToken;

      setAuthState((prev) => ({
        ...prev,
        token,
        isAuthenticated: true,
        loading: true, // seguimos cargando hasta pedir datos reales al backend
      }));
    }
  }, [status, session]);

  // =========================
  // 2. TRAER DATOS REALES DEL BACKEND SI HAY TOKEN
  // =========================
  useEffect(() => {
    if (!authState.token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
          {
            headers: { Authorization: `Bearer ${authState.token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setAuthState({
          user: data.user,
          token: authState.token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (err) {
        console.error("Error /me:", err);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    };

    fetchUser();
  }, [authState.token]);

  // =========================
  // 3. ROUTE GUARDS SIMPLES
  // =========================
  useEffect(() => {
    if (authState.loading) return;

    const protectedRoutes = ["/chat", "/settings"];
    const authPages = ["/sign-in", "/sign-up"];

    // a) No autenticado -> bloquea rutas protegidas
    if (!authState.isAuthenticated && protectedRoutes.includes(pathname)) {
      router.replace("/sign-in");
      return;
    }

    // b) Autenticado pero sin onboarding -> forzar onboarding
    if (
      authState.isAuthenticated &&
      authState.user &&
      !authState.user.onboardingCompleted
    ) {
      if (pathname !== "/onboarding") router.replace("/onboarding");
      return;
    }

    // c) Autenticado y en rutas de login -> mandarlo al chat
    if (authState.isAuthenticated && authPages.includes(pathname)) {
      router.replace("/chat");
    }
  }, [authState, pathname]);

  // =========================
  // 4. MÉTODOS
  // =========================

  const loginWithGoogle = () => signIn("google");

  const logout = async () => {
    localStorage.clear();
    await signOut({ redirect: false });
    router.push("/");
  };

  const updateOnboarding = async (data) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/onboarding`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const response = await res.json();
    if (!res.ok) throw new Error(response.message);

    setAuthState((prev) => ({
      ...prev,
      user: response.user,
    }));

    router.push("/chat");
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, loginWithGoogle, logout, updateOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

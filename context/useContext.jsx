"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/app/api/auth/axios";

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

  // =========================================================
  // 1. LOGOUT (Definido arriba para ser usado en listeners)
  // =========================================================
  const logout = useCallback(async () => {
    console.log("Ejecutando logout...");
    localStorage.removeItem("sweetToken");

    // Seteamos el estado a false inmediatamente para frenar peticiones
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });

    await signOut({ redirect: false });
    router.push("/sign-in");
  }, [router]);

  // =========================================================
  // 2. FUNCIÓN REUTILIZABLE PARA CARGAR PERFIL
  // =========================================================
  const fetchUser = useCallback(
    async (tokenToUse) => {
      const currentToken = tokenToUse || authState.token;
      if (!currentToken) return;

      try {
        const res = await api.get("/api/v1/user/profile");
        const data = res.data;
        const userData = data.user || data.data || data;

        setAuthState((prev) => ({
          ...prev,
          user: userData,
          token: currentToken,
          isAuthenticated: true,
          loading: false,
        }));
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Si el interceptor de axios funciona, este bloque catch
        // será secundario, pero lo dejamos por seguridad.
        if (err.response?.status === 401) {
          logout();
        }
      }
    },
    [authState.token, logout]
  );

  // =========================================================
  // 3. ESCUCHA DE EVENTO GLOBAL (AXIOS)
  // =========================================================
  useEffect(() => {
    const handleUnauthorized = () => {
      console.warn("Evento 401 recibido desde Axios");
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  // =========================================================
  // 4. HIDRATACIÓN & SYNC NEXTAUTH
  // =========================================================
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("sweetToken");

      if (storedToken && !authState.token) {
        setAuthState((prev) => ({
          ...prev,
          token: storedToken,
          isAuthenticated: true,
          // No quitamos loading hasta que fetchUser responda
        }));
      } else if (
        status === "authenticated" &&
        session?.user?.accessToken &&
        !storedToken
      ) {
        localStorage.setItem("sweetToken", session.user.accessToken);
        setAuthState((prev) => ({
          ...prev,
          token: session.user.accessToken,
          isAuthenticated: true,
        }));
      } else if (status === "unauthenticated" && !storedToken) {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    initAuth();
  }, [status, session, authState.token]);

  // =========================================================
  // 5. AUTO-FETCH CUANDO HAY TOKEN
  // =========================================================
  useEffect(() => {
    if (authState.token && !authState.user) {
      fetchUser(authState.token);
    }
  }, [authState.token, authState.user, fetchUser]);

  // =========================================================
  // 6. ROUTE GUARDS
  // =========================================================
  useEffect(() => {
    if (authState.loading) return;

    const protectedRoutes = [
      "/chat",
      "/settings",
      "/dashboard",
      "/campaign",
      "/onboarding",
    ];
    const authPages = ["/sign-in", "/sign-up"];
    const isProtectedRoute = protectedRoutes.some((r) =>
      pathname.startsWith(r)
    );

    if (!authState.isAuthenticated && isProtectedRoute) {
      router.replace("/sign-in");
      return;
    }

    if (authState.isAuthenticated && authState.user) {
      if (!authState.user.onboardingCompleted && pathname !== "/onboarding") {
        router.replace("/onboarding");
      } else if (
        authState.user.onboardingCompleted &&
        (authPages.includes(pathname) || pathname === "/onboarding")
      ) {
        router.replace("/chat");
      }
    }
  }, [
    authState.loading,
    authState.isAuthenticated,
    authState.user,
    pathname,
    router,
  ]);

  // =========================================================
  // 7. MÉTODOS EXPUESTOS
  // =========================================================
  const loginWithGoogle = () => signIn("google");

  const login = (userData, token) => {
    localStorage.setItem("sweetToken", token);
    setAuthState({
      user: userData,
      token: token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const register = async (userData) => {
    const res = await api.post("/api/v1/auth/register", userData);
    const data = res.data;
    if (data.token) {
      const userObj = data.user || data.data?.user || data;
      login(userObj, data.token);
    }
    return data;
  };

  const updateOnboarding = async (onboardingData) => {
    try {
      const res = await api.post("/api/v1/user/onboarding", onboardingData);
      const response = res.data;
      setAuthState((prev) => ({
        ...prev,
        user: { ...prev.user, ...response.user, onboardingCompleted: true },
      }));
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginWithGoogle,
        login,
        logout,
        register,
        updateOnboarding,
        refreshProfile: () => fetchUser(authState.token),
      }}
    >
      {/* Evita parpadeos de UI mientras carga el estado inicial */}
      {authState.loading && pathname !== "/sign-in" ? (
        <div className="flex items-center justify-center h-screen">
          Cargando...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

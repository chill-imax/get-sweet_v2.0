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
  // 1. FUNCIÓN REUTILIZABLE PARA CARGAR PERFIL
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
        // Solo limpiamos si el error es de autenticación (401)
        if (err.response?.status === 401) {
          localStorage.removeItem("sweetToken");
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      }
    },
    [authState.token]
  );

  // =========================================================
  // 2. HIDRATACIÓN & SYNC NEXTAUTH
  // =========================================================
  useEffect(() => {
    const initAuth = setTimeout(() => {
      const storedToken = localStorage.getItem("sweetToken");

      // CASO A: Hay un token en localStorage
      if (storedToken && !authState.token) {
        setAuthState((prev) => ({
          ...prev,
          token: storedToken,
          isAuthenticated: true,
        }));
      }
      // CASO B: Login con Google (NextAuth) detectado
      else if (
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
      }
      // CASO C: No hay nada
      else if (status === "unauthenticated" && !storedToken) {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    }, 0);

    return () => clearTimeout(initAuth);
  }, [status, session, authState.token]);

  // =========================================================
  // 3. AUTO-FETCH CUANDO HAY TOKEN
  // =========================================================
  useEffect(() => {
    if (authState.token && !authState.user) {
      fetchUser(authState.token);
    }
  }, [authState.token, authState.user, fetchUser]);

  // =========================================================
  // 4. ROUTE GUARDS
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

    if (
      !authState.isAuthenticated &&
      protectedRoutes.some((r) => pathname.startsWith(r))
    ) {
      router.replace("/sign-in");
      return;
    }

    if (
      authState.isAuthenticated &&
      authState.user &&
      !authState.user.onboardingCompleted
    ) {
      if (pathname !== "/onboarding") router.replace("/onboarding");
      return;
    }

    if (authState.isAuthenticated && authState.user?.onboardingCompleted) {
      if (authPages.includes(pathname) || pathname === "/onboarding") {
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
  // 5. MÉTODOS EXPUESTOS
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

  const logout = async () => {
    localStorage.removeItem("sweetToken");
    await signOut({ redirect: false });
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    router.push("/sign-in");
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

  const updateOnboarding = async (data) => {
    try {
      const res = await api.post("/api/v1/user/onboarding", data);
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
      {authState.loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

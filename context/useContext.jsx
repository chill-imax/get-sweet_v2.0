"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

  // 0. HIDRATACIÓN (Recuperar token local)
  useEffect(() => {
    // ✅ FIX: Envolvemos en setTimeout para evitar "Cascading Renders"
    const initAuth = setTimeout(() => {
      const storedToken = localStorage.getItem("sweetToken");

      if (storedToken) {
        setAuthState((prev) => ({
          ...prev,
          token: storedToken,
          isAuthenticated: true,
          // Mantenemos loading: true hasta que el fetchUser valide el token
        }));
      } else {
        // Si no hay token y NextAuth ya terminó de cargar y no hay sesión
        if (status === "unauthenticated") {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      }
    }, 0);

    return () => clearTimeout(initAuth);
  }, [status]); // Agregamos status a dep para asegurar consistencia inicial

  // 1. SYNC NEXTAUTH (Google Login)
  useEffect(() => {
    if (status === "loading") return;

    // ✅ FIX: Usamos setTimeout para romper la sincronía
    const syncTimeout = setTimeout(() => {
      // CASO A: Login exitoso con Google detectado
      if (
        status === "authenticated" &&
        session?.user?.accessToken &&
        !authState.token
      ) {
        localStorage.setItem("sweetToken", session.user.accessToken);

        setAuthState((prev) => ({
          ...prev,
          token: session.user.accessToken,
          isAuthenticated: true,
          loading: true, // Ponemos true para que el fetchUser traiga el perfil
        }));
      }

      // CASO B: No hay sesión ni token
      if (
        status === "unauthenticated" &&
        !localStorage.getItem("sweetToken") &&
        authState.loading // Solo actualizamos si seguía cargando
      ) {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    }, 0);

    return () => clearTimeout(syncTimeout);
  }, [status, session, authState.token, authState.loading]);

  // 2. FETCH PROFILE (Valida token y obtiene datos reales)
  useEffect(() => {
    if (!authState.token) return;

    // Eliminé el bloque síncrono que causaba conflicto aquí.
    // Dejamos que el fetch (que es asíncrono) maneje el estado final.

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await api.get("/api/v1/user/profile");

        if (isMounted) {
          const data = res.data;
          const userData = data.user || data.data || data;

          setAuthState({
            user: userData,
            token: authState.token,
            isAuthenticated: true,
            loading: false, // ✅ Aquí se apaga el loading de forma segura
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (isMounted) {
          localStorage.removeItem("sweetToken");
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [authState.token]);

  // =========================================================
  // 3. ROUTE GUARDS
  // =========================================================
  useEffect(() => {
    // Si está cargando, no tomamos decisiones de redirección aún
    if (authState.loading) return;

    const protectedRoutes = [
      "/chat",
      "/settings",
      "/dashboard",
      "/campaign",
      "/thank-u",
      "/onboarding",
    ];
    const authPages = ["/sign-in", "/sign-up"];

    // A. Protección básica
    if (
      !authState.isAuthenticated &&
      protectedRoutes.some((r) => pathname.startsWith(r))
    ) {
      router.replace("/sign-in");
      return;
    }

    // B. Forzar Onboarding
    if (
      authState.isAuthenticated &&
      authState.user &&
      !authState.user.onboardingCompleted
    ) {
      if (pathname !== "/onboarding") {
        router.replace("/onboarding");
      }
      return;
    }

    // C. Redirigir si ya está autenticado
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

  // --- MÉTODOS ---

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
        user: {
          ...prev.user,
          ...response.user,
          onboardingCompleted: true,
        },
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
      }}
    >
      {/* Si prefieres ver la app mientras carga (y que los redirects 
         sucedan visualmente), quita el check de loading. 
         Si quieres pantalla blanca hasta saber si hay user, déjalo así.
      */}
      {authState.loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

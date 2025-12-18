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

  // 0. HIDRATACIÓN
  useEffect(() => {
    const storedToken = localStorage.getItem("sweetToken");
    if (storedToken) {
      setAuthState((prev) => ({
        ...prev,
        token: storedToken,
        isAuthenticated: true,
        loading: true,
      }));
    } else {
      if (status === "unauthenticated") {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    }
  }, []);

  // 1. SYNC NEXTAUTH (GOOGLE)
  useEffect(() => {
    if (status === "loading") return;

    // LOGIN EXITOSO CON GOOGLE
    if (
      status === "authenticated" &&
      session?.user?.accessToken &&
      !authState.token
    ) {
      setAuthState((prev) => ({
        ...prev,
        token: session.user.accessToken,
        isAuthenticated: true,
        loading: true,
      }));
    }

    if (status === "unauthenticated" && !localStorage.getItem("sweetToken")) {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, [status, session]);

  // 2. FETCH PROFILE (Obtiene el flag onboardingCompleted)
  useEffect(() => {
    if (!authState.token) return;
    if (authState.user && authState.loading) {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`,
          { headers: { Authorization: `Bearer ${authState.token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error("Failed");

        const userData = data.user || data.data || data;

        setAuthState({
          user: userData,
          token: authState.token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        localStorage.removeItem("sweetToken");
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

  // =========================================================
  // 3. ROUTE GUARDS (AQUI ESTÁ LA MAGIA 🪄)
  // =========================================================
  useEffect(() => {
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

    // A. Protección básica: Si no estás logueado, fuera de rutas privadas
    if (
      !authState.isAuthenticated &&
      protectedRoutes.some((r) => pathname.startsWith(r))
    ) {
      router.replace("/sign-in");
      return;
    }

    // B. FORZAR ONBOARDING (Google & Tradicional)
    // Si estás logueado, pero el backend dice que NO terminaste el onboarding...
    if (
      authState.isAuthenticated &&
      authState.user &&
      !authState.user.onboardingCompleted
    ) {
      // ...y no estás ya en la página de onboarding...
      if (pathname !== "/onboarding") {
        console.log("🚦 Usuario nuevo detectado. Redirigiendo a Onboarding.");
        router.replace("/onboarding");
      }
      return; // Detener aquí para que no ejecute la regla C
    }

    // C. Si ya completaste onboarding, no te dejo entrar a Login/SignUp/Onboarding
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
      loading: false, // Dejamos false para que el Route Guard actúe inmediatamente
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    // Auto-Login
    if (data.token) {
      const userObj = data.user || data.data?.user || data;
      login(userObj, data.token);
    }
    return data;
  };
  const updateOnboarding = async (data) => {
    console.log("📤 Enviando datos de onboarding:", data); // LOG PARA DEPURAR

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        console.error("❌ Error Backend Onboarding:", response);
        throw new Error(response.message || "Onboarding failed");
      }

      console.log("✅ Onboarding Exitoso:", response);

      setAuthState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...response.user,
          onboardingCompleted: true,
        },
      }));
    } catch (error) {
      console.error("Error en updateOnboarding:", error);
      throw error; // Lanzamos el error para que el componente muestre el mensaje rojo
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
      {authState.loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

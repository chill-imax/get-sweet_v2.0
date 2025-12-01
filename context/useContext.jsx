"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

const AuthLogic = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // NextAuth
  const { data: session, status: googleStatus, update } = useSession();

  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  // --- EFECTO 1: Carga Inicial ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      if (googleStatus === "unauthenticated") {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    }
  }, [googleStatus]);

  // --- EFECTO 2: EL GUARDIA INTELIGENTE 🛡️ ---
  useEffect(() => {
    if (googleStatus === "authenticated" && session) {
      const backendToken = session.user.accessToken || null;
      const isOnboardingCompleted = !!session.user.onboardingCompleted;

      // 1. Sincronizar Estado Local
      if (authState.token !== backendToken) {
        setAuthState({
          user: { ...session.user, source: "google", id: session.user.id },
          token: backendToken,
          isAuthenticated: true,
          loading: false,
        });
      }

      // 2. LÓGICA DE NAVEGACIÓN PROFESIONAL

      if (!isOnboardingCompleted) {
        // CASO A: Usuario INCOMPLETO
        // Bloqueo total: Si no está en onboarding, lo mandamos allá.
        if (pathname !== "/onboarding") {
          console.log("🔒 Falta Onboarding -> Redirigiendo");
          router.replace("/onboarding"); // Usamos replace para no ensuciar el historial
        }
      } else {
        // CASO B: Usuario COMPLETO (Ya listo)

        // Rutas que un usuario logueado NO debería ver:
        const restrictedForAuthUsers = ["/sign-in", "/sign-up", "/register"];

        // Rutas fantasmas que queremos corregir:
        const ghostRoutes = ["/home"];

        if (restrictedForAuthUsers.includes(pathname)) {
          // Si intenta loguearse de nuevo, lo mandamos al chat
          console.log("✅ Usuario ya logueado -> Ir al Chat");
          router.replace("/chat");
        } else if (ghostRoutes.includes(pathname)) {
          // Si cae en el error 404 de /home, lo corregimos
          console.log("👻 Ruta fantasma detectada -> Corrigiendo a Chat");
          router.replace("/chat");
        }

        // NOTA: Si está en "/" (Landing), NO hacemos nada.
        // Dejamos que vea la landing page tranquilamente.
      }
    } else if (
      googleStatus === "unauthenticated" &&
      !localStorage.getItem("token")
    ) {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, [session, googleStatus, pathname]);

  // --- MÉTODOS ---
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthState({
      user: userData,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const loginWithGoogle = () => {
    signIn("google"); // Sin callbackUrl, dejamos que el Guardia decida
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    if (googleStatus === "authenticated") {
      await signOut({ redirect: false });
    }
    router.push("/sign-in");
  };

  const register = async ({ fullName, email, password }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error en registro");
    login(data.user, data.token);
  };

  const updateOnboarding = async (onboardingData) => {
    console.log("🚀 Enviando Onboarding...");
    const activeToken = authState.token || session?.user?.accessToken;

    if (!activeToken) {
      console.error("❌ Sin token");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/onboarding`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify(onboardingData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al actualizar");

      console.log("✅ Éxito. Actualizando sesión...");

      // Actualizamos la cookie de sesión
      await update({ onboardingCompleted: true });

      setAuthState((prev) => {
        const updatedUser = {
          ...prev.user,
          onboardingCompleted: true,
          ...data.user,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { ...prev, user: updatedUser };
      });

      // Redirigimos al chat
      router.push("/chat");
    } catch (error) {
      console.error("Error updateOnboarding:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginWithGoogle,
        logout,
        register,
        updateOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthLogic>{children}</AuthLogic>
    </SessionProvider>
  );
};

export const useAuth = () => useContext(AuthContext);

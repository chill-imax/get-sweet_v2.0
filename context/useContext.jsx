"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

// --- 1. COMPONENTE LÓGICO ---
const AuthLogic = ({ children }) => {
  const router = useRouter();

  // NextAuth Hook
  const { data: session, status: googleStatus } = useSession();

  // Estado Local Unificado
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  // --- EFECTO 1: Carga Inicial (Local Storage) ---
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
      // Si no hay local, dejamos loading en true hasta ver qué dice Google
      // (se maneja en el Efecto 2)
      if (googleStatus === "unauthenticated") {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    }
  }, []); // Solo al montar

  // --- EFECTO 2: Sincronización Google -> Estado Local ---
  // ESTO ES LO NUEVO: Si NextAuth detecta sesión, actualizamos nuestro estado local
  useEffect(() => {
    if (googleStatus === "authenticated" && session) {
      // Asumimos que en tu [...nextauth]/route.ts guardaste el token del backend en session.user.accessToken
      const backendToken = session.user.accessToken || null;

      // Solo actualizamos si es diferente para evitar loops
      if (authState.token !== backendToken) {
        const googleUser = {
          ...session.user,
          source: "google",
          _id: session.user.id, // Ojo: Asegúrate de que el ID venga mapeado
        };

        setAuthState({
          user: googleUser,
          token: backendToken, // ¡Ahora sí tenemos token para la API!
          isAuthenticated: true,
          loading: false,
        });

        // Opcional: Guardar en localStorage para persistencia híbrida
        // localStorage.setItem("token", backendToken);
      }
    } else if (
      googleStatus === "unauthenticated" &&
      !localStorage.getItem("token")
    ) {
      // Si Google dice "no", y no hay nada en local storage, terminamos de cargar
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, [session, googleStatus]);

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
    // Redirigir a Google
    signIn("google", { callbackUrl: "/home" }); // Ajusta tu ruta de destino
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Limpiamos estado local
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });

    // Si venía de Google, cerramos sesión allá también
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

  return (
    <AuthContext.Provider
      value={{
        ...authState, // Esto expone user, token, isAuthenticated, loading directamente
        login,
        loginWithGoogle,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- 2. EXPORT ---
export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthLogic>{children}</AuthLogic>
    </SessionProvider>
  );
};

export const useAuth = () => useContext(AuthContext);

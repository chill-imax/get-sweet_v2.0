"use client";
import { createContext, useContext, useState, useEffect } from "react";

const BASE_URL = "https://backend-get-sweet-v2-0.onrender.com/api/v1";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false); // 👈 terminamos de inicializar
  }, []);

const login = (userData, token) => {
if (userData && token) {
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(userData));
setUser(userData);
setToken(token);
setIsAuthenticated(true);
}
};

const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
setUser(null);
setToken(null);
setIsAuthenticated(false);
};

const register = async ({ fullName, email, password }) => {
const response = await fetch(`${BASE_URL}/auth/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ fullName, email, password }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || "Registration failed");
}

// Iniciar sesión automáticamente después de registrarse
login(data.user, data.token);

};

return (
<AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, register }}>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
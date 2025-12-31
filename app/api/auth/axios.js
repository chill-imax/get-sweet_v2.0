import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor de Request: Inyecta el token si existe
api.interceptors.request.use((config) => {
  // Nota: Asegúrate que la key sea consistente ('userToken' o 'token')
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Response: Manejo global de 401 (Kill Switch)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Usamos optional chaining (?.) para evitar errores si error.response es undefined (ej. error de red)
    if (error.response?.status === 401) {
      // 1. Limpieza total de la sesión
      localStorage.clear();

      // 2. Redirección forzada a la raíz
      if (typeof window !== "undefined") {
        // Usamos window.location.href para forzar un refresh completo y limpiar estados de memoria de React
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

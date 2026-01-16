import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const TOKEN_KEY = "sweetToken";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 1. Borramos el token
      localStorage.removeItem(TOKEN_KEY);

      // 2. EMITIR EVENTO PERSONALIZADO
      if (typeof window !== "undefined") {
        const event = new CustomEvent("auth:unauthorized");
        window.dispatchEvent(event);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

"use client";

import { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "@/components/ui/ToastContainer"; // Lo crearemos en el paso 2

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Eliminar notificación manual o automática
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Agregar una notificación
  const addToast = useCallback(
    (message, type = "info") => {
      const id = Date.now().toString(); // ID único basado en tiempo
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-eliminar después de 3 segundos
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  // Helpers para usar toast.success() o toast.error()
  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Renderizamos el contenedor visual aquí para que esté disponible en toda la app */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook interno para acceder al contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

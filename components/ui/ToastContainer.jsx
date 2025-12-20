"use client";

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

// Iconos según el tipo
const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

// Estilos de borde/fondo según el tipo
const styles = {
  success: "border-green-100 bg-white",
  error: "border-red-100 bg-white",
  warning: "border-amber-100 bg-white",
  info: "border-blue-100 bg-white",
};

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-5 right-5 z-999 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// Sub-componente individual con animación simple
function ToastItem({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);

  // Efecto para animar la entrada
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Función para cerrar con animación de salida
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300); // Esperar a que termine la transición
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 min-w-75 max-w-md p-4 rounded-xl shadow-lg border transition-all duration-300 transform
        ${styles[toast.type] || styles.info}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
      `}
    >
      {/* Icono */}
      <div className="shrink-0">{icons[toast.type]}</div>

      {/* Texto */}
      <div className="flex-1 text-sm font-medium text-gray-700">
        {toast.message}
      </div>

      {/* Botón Cerrar */}
      <button
        onClick={handleClose}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

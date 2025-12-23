import { useEffect, useState } from "react";

export const CurrencyInput = ({ value, onChange, placeholder, required }) => {
  // Estado local para manejar lo que se ve en el input
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar cuando el valor externo cambia (ej: carga inicial)
  useEffect(() => {
    if (value && !isFocused) {
      // Formato bonito: 1234.5 -> 1,234.50
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      setDisplayValue(formatted);
    } else if (!value && !isFocused) {
      setDisplayValue("");
    }
  }, [value, isFocused]);

  const handleChange = (e) => {
    // 1. Permitir solo números y un punto decimal
    const val = e.target.value.replace(/[^0-9.]/g, "");

    // 2. Evitar múltiples puntos decimales
    if ((val.match(/\./g) || []).length > 1) return;

    // 3. Actualizar visualmente (mientras escribe)
    setDisplayValue(val);

    // 4. Enviar al padre el valor limpio (para la BD)
    onChange(val);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value) {
      // Al salir, formateamos bonito de nuevo
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      setDisplayValue(formatted);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Al entrar, mostramos el valor crudo para editar fácil
    setDisplayValue(value ? value.toString() : "");
  };

  return (
    <div className="relative group">
      {/* Icono de Moneda Fijo */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold pointer-events-none z-10">
        $
      </div>

      <input
        type="text" // Usamos text para poder poner comas
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder || "0.00"}
        required={required}
        className={`w-full h-11 pl-7 pr-3 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 transition-all font-mono
          ${
            required && !value
              ? "border-amber-200 focus:border-amber-400 focus:ring-amber-100 bg-amber-50/30"
              : "border-gray-200 focus:ring-purple-200"
          }
        `}
      />

      {/* Texto de moneda a la derecha (opcional, decorativo) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
        USD
      </div>
    </div>
  );
};

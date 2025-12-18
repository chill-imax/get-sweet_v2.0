import React, { useState, useEffect } from "react";

export const EditableList = ({
  items,
  isEditing,
  onChange,
  colorClass = "bg-gray-50 text-gray-700 border-gray-200",
  label,
}) => {
  // 1. Estado local para manejar el texto crudo (con comas finales)
  const [localText, setLocalText] = useState("");

  // 2. Sincronizar: Solo actualizamos el texto local cuando entramos en modo edición
  // o si la lista viene vacía inicialmente. Esto rompe el ciclo de re-formateo.
  useEffect(() => {
    if (Array.isArray(items)) {
      setLocalText(items.join(", "));
    }
  }, [isEditing]); // Dependencia clave: solo al cambiar modo edición (o montaje)

  const handleTextChange = (e) => {
    const val = e.target.value;
    setLocalText(val); // ✅ Permitimos que el usuario vea lo que escribe (incluyendo comas)

    // Lógica para enviar al padre (Backend)
    // Convertimos el texto a array limpio, pero NO forzamos la vista a actualizarse con esto
    const newArray = val
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== ""); // Filtramos vacíos para la data

    onChange(newArray);
  };

  if (isEditing) {
    return (
      <textarea
        value={localText} // ✅ Vinculado al estado local (texto libre)
        onChange={handleTextChange}
        rows={3}
        placeholder="Separate items with commas (e.g. SEO, Marketing, AI)"
        className="w-full text-xs p-2 border rounded-lg outline-none bg-indigo-50/40 border-indigo-300 text-gray-600 resize-none"
      />
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <div className="text-[10px] text-gray-400 font-semibold">{label}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {items && items.length > 0 ? (
          items.map((item, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-medium border rounded-md px-2 py-0.5 ${colorClass}`}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-gray-300 italic text-xs">No items yet</span>
        )}
      </div>
    </div>
  );
};

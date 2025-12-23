"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Globe, ChevronDown, Check, X } from "lucide-react";

// Lista oficial de idiomas soportados por Google Ads (Top comunes)
const LANGUAGES = [
  { name: "English", flag: "🇺🇸" },
  { name: "Spanish", flag: "🇪🇸" },
  { name: "French", flag: "🇫🇷" },
  { name: "German", flag: "🇩🇪" },
  { name: "Portuguese", flag: "🇧🇷" },
  { name: "Italian", flag: "🇮🇹" },
  { name: "Dutch", flag: "🇳🇱" },
  { name: "Russian", flag: "🇷🇺" },
  { name: "Japanese", flag: "🇯🇵" },
  { name: "Chinese (Simplified)", flag: "🇨🇳" },
  { name: "Arabic", flag: "🇸🇦" },
  { name: "Korean", flag: "🇰🇷" },
  { name: "Turkish", flag: "🇹🇷" },
  { name: "Polish", flag: "🇵🇱" },
  { name: "Indonesian", flag: "🇮🇩" },
  { name: "Hindi", flag: "🇮🇳" },
];

export default function LanguagePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  // Si ya hay un valor seleccionado, queremos mostrarlo
  useEffect(() => {
    if (!isOpen) {
      // Cuando se cierra, reseteamos el buscador
      setSearch("");
    }
  }, [isOpen]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrado de la lista
  const filteredLanguages = useMemo(() => {
    if (!search) return LANGUAGES;
    return LANGUAGES.filter((lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Manejar selección
  const handleSelect = (langName) => {
    onChange(langName);
    setIsOpen(false);
    setSearch("");
  };

  // Limpiar selección
  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wide flex items-center gap-1">
        Language <span className="text-red-500 text-xs">*</span>
      </div>

      {/* Input simulado (Trigger) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-3 rounded-xl border bg-white flex items-center justify-between cursor-pointer transition-all ${
          isOpen
            ? "border-purple-300 ring-2 ring-purple-100"
            : !value
            ? "border-amber-200 bg-amber-50/30" // Amarillo si está vacío (Required)
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Globe
            className={`w-4 h-4 shrink-0 ${
              value ? "text-purple-600" : "text-gray-400"
            }`}
          />

          {value ? (
            <span className="text-sm text-gray-900 font-medium truncate">
              {/* Buscamos la bandera para mostrarla junto al nombre seleccionado */}
              <span className="mr-2">
                {LANGUAGES.find((l) => l.name === value)?.flag}
              </span>
              {value}
            </span>
          ) : (
            <span className="text-sm text-gray-400">Select language...</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Botón de borrar si hay valor */}
          {value && (
            <div
              role="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 mr-1 transition-colors"
            >
              <X className="w-3 h-3" />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Buscador interno */}
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <input
              autoFocus
              type="text"
              placeholder="Search language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic en el input
              className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200"
            />
          </div>

          {/* Lista */}
          <ul className="max-h-48 overflow-y-auto py-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <li
                  key={lang.name}
                  onClick={() => handleSelect(lang.name)}
                  className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between group transition-colors ${
                    value === lang.name
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {value === lang.name && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-xs text-gray-400 text-center">
                No languages found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

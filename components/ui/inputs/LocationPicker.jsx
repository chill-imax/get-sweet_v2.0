"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Loader2,
  Navigation,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function LocationPicker({ value, onChange }) {
  // Estado local del texto visible
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ ESTADO DE VALIDEZ: ¿Es lo que está escrito una ubicación real seleccionada?
  // Si viene un valor inicial (value), asumimos que es válido.
  const [isValid, setIsValid] = useState(!!value);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null); // Para controlar el tiempo de espera

  // Sincronizar si el valor externo cambia (ej: al cargar datos guardados)
  useEffect(() => {
    if (value) {
      setQuery(value);
      setIsValid(true);
    }
  }, [value]);

  // Cerrar dropdown si clic afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1️⃣ FUNCIÓN DE BÚSQUEDA REAL (Llamada a la API)
  const fetchLocations = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text
        )}&addressdetails=1&limit=5&featuretype=city`
      );
      const data = await res.json();
      setSuggestions(data);
      setIsOpen(true); // Abrimos solo cuando hay datos
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ MANEJADOR DE INPUT CON DEBOUNCE (La magia de la velocidad)
  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);

    // 🚨 MODO ESTRICTO: Mientras escribe, invalidamos el dato en el padre.
    // Esto obliga a seleccionar una opción al final.
    setIsValid(false);
    onChange("");

    // Limpiamos el timer anterior si el usuario sigue escribiendo
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Esperamos 500ms antes de buscar
    debounceRef.current = setTimeout(() => {
      fetchLocations(text);
    }, 500);
  };

  // 3️⃣ SELECCIONAR UNA OPCIÓN (Validación)
  const handleSelect = (place) => {
    const parts = [
      place.address.city || place.address.town || place.address.village,
      place.address.state,
      place.address.country,
    ].filter(Boolean);

    const finalLocation = parts.join(", ");

    setQuery(finalLocation);
    setIsValid(true); // ✅ Ahora sí es válido
    onChange(finalLocation); // Enviamos al padre

    setIsOpen(false);
    setSuggestions([]);
  };

  // 4️⃣ DETECTAR UBICACIÓN (Validación Automática)
  const handleDetectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLoading(true);
    setQuery("Detecting location..."); // Feedback visual
    onChange(""); // Invalidamos mientras carga

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          handleSelect(data);
        } catch (error) {
          console.error(error);
          setQuery("");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setLoading(false);
        setQuery("");
        alert("Could not detect location.");
      }
    );
  };

  // 5️⃣ MANEJAR BLUR (Cuando se sale del campo)
  const handleBlur = () => {
    // Si el usuario escribió algo pero no seleccionó nada (no es válido)
    // Borramos el campo para obligarlo a buscar de nuevo.
    if (!isValid && query !== "") {
      // Opcional: Puedes dejar el texto pero mostrar un error rojo.
      // Aquí lo limpiamos para ser estrictos como pediste.
      setQuery("");
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex justify-between items-center mb-1">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
          Geo Location <span className="text-red-500 text-xs">*</span>
        </div>
        {/* Indicador Visual de Estado */}
        {query && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isValid
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isValid ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Selected
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" /> Select form list
              </>
            )}
          </span>
        )}
      </div>

      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={handleBlur} // 🔒 Limpieza estricta al salir
          placeholder="Search & select a city (e.g. Madrid)"
          className={`w-full h-11 pl-10 pr-10 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 transition-all
            ${
              isValid
                ? "border-gray-200 focus:ring-purple-200 focus:border-purple-300"
                : "border-amber-200 focus:ring-amber-100 focus:border-amber-300 bg-amber-50/30" // Tono ámbar si no ha seleccionado
            }
          `}
        />

        {/* Icono Izquierda */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin
            className={`w-4 h-4 ${
              isValid ? "text-purple-500" : "text-gray-400"
            }`}
          />
        </div>

        {/* Botón Detectar (Derecha) */}
        <button
          type="button"
          onClick={handleDetectLocation}
          title="Detect my current location"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors p-1"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Dropdown de Sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(place);
              }}
              className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm text-gray-700 flex flex-col border-b border-gray-50 last:border-0 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold group-hover:text-purple-700 transition-colors">
                  {place.display_name.split(",")[0]}
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded group-hover:bg-purple-100 group-hover:text-purple-600">
                  {place.type || "City"}
                </span>
              </div>
              <span className="text-xs text-gray-500 truncate mt-0.5">
                {place.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

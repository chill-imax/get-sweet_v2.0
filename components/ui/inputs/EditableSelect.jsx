import { ChevronDown, Check } from "lucide-react";

export const EditableSelect = ({
  label,
  value,
  options, // Array de strings
  isEditing,
  onChange,
  placeholder = "Select an option",
}) => {
  return (
    <div className="w-full group">
      {/* Etiqueta */}
      {(isEditing || label) && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
            {label}
          </label>
        </div>
      )}

      {isEditing ? (
        <div className="relative">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="
              w-full 
              appearance-none 
              bg-white 
              text-sm
              text-gray-900 
              font-normal
              py-2.5 
              pl-3 
              pr-10 
              border 
              border-gray-200 
              rounded-xl 
              shadow-sm 
              outline-none 
              cursor-pointer 
              transition-all 
              duration-200
              hover:border-purple-300 
              hover:bg-gray-50
              focus:ring-2 
              focus:ring-purple-100 
              focus:border-purple-500
            "
          >
            <option value="" disabled className="text-gray-400 bg-gray-50">
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="text-gray-900 py-2">
                {opt}
              </option>
            ))}
          </select>

          {/* Icono de flecha con estilo */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-500 transition-colors duration-200">
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>
      ) : (
        // MODO LECTURA (READ-ONLY)
        <div
          className="
            relative 
            py-2 
            px-3 
            rounded-lg 
            border 
            border-transparent 
            hover:bg-gray-50 
            hover:border-gray-200 
            transition-all 
            duration-200
            cursor-default
          "
        >
          {value ? (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              <span className="text-sm italic">Not defined</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

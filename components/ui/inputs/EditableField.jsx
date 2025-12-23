import React from "react";

export const EditableField = ({
  label,
  value,
  isEditing,
  onChange,
  placeholder,
  className = "",
  forceLabel = false,
}) => (
  <div className={className}>
    {(isEditing || forceLabel) && (
      <div className="text-[11px] text-gray-400 font-bold mb-1">{label}</div>
    )}

    {isEditing ? (
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm p-2 border border-gray-300 rounded-lg
          focus:border-blue-500 outline-none bg-white text-gray-800 transition"
      />
    ) : (
      <div className="text-sm text-gray-600 font-medium wrap-break-word">
        {value || <span className="text-gray-300 italic text-sm">null</span>}
      </div>
    )}
  </div>
);

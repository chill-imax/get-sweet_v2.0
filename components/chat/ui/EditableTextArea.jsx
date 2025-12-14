import React from "react";

export const EditableTextArea = ({
  label,
  value,
  isEditing,
  onChange,
  placeholder,
}) => (
  <div>
    {label && (
      <div className="text-[10px] text-gray-400 font-bold mb-1">{label}</div>
    )}

    {isEditing ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full text-[12px] p-2 border rounded outline-none resize-none
          bg-indigo-50/40 border-indigo-300 text-gray-600"
      />
    ) : (
      <div className="text-[12px] text-gray-600 leading-snug wrap-break-word">
        {value || (
          <span className="text-gray-300 italic text-xs">Not defined</span>
        )}
      </div>
    )}
  </div>
);

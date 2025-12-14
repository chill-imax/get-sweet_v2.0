import React from "react";

export const EditableList = ({
  items,
  isEditing,
  onChange,
  colorClass = "bg-gray-50 text-gray-700 border-gray-200",
  label,
}) => {
  if (isEditing) {
    return (
      <textarea
        value={items?.join(", ") || ""}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          )
        }
        rows={2}
        placeholder="Separate items with commas"
        className="w-full text-xs p-2 border rounded outline-none
          bg-indigo-50/40 border-indigo-300 text-gray-600"
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

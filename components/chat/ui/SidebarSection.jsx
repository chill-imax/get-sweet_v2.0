"use client";

import { ChevronDown, Pencil } from "lucide-react";

export function SidebarSection({
  title,
  isOpen,
  onToggle,
  onEdit,
  preview,
  previewType,     // "text" | "colors"
  previewData,     // used when previewType === "colors"
  children,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${title} section`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle?.();
          }
        }}
        className="w-full p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
      >
        {/* Left */}
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>

          {/* TEXT PREVIEW */}
          {!isOpen && preview && previewType !== "colors" && (
            <p className="mt-1 text-xs text-gray-500 leading-snug line-clamp-2">
              {preview}
            </p>
          )}

          {/* COLOR PREVIEW */}
          {!isOpen &&
            previewType === "colors" &&
            Array.isArray(previewData) &&
            previewData.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                {previewData.slice(0, 6).map((color, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}

                {previewData.length > 6 && (
                  <span className="text-[10px] text-gray-400 ml-1">
                    +{previewData.length - 6}
                  </span>
                )}
              </div>
            )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="h-8 px-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              aria-label={`Edit ${title}`}
              title={`Edit ${title}`}
            >
              <span className="inline-flex items-center gap-1">
                <Pencil className="w-3 h-3" />
                Edit
              </span>
            </button>
          )}

          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

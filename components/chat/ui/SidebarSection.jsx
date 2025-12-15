"use client";

import { ChevronDown, Pencil } from "lucide-react";

export function SidebarSection({
  title,
  isOpen,
  onToggle,
  onEdit,
  preview, // ✅ NEW: collapsed preview text (string)
  children,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            {title}
          </h4>

          {/* ✅ Collapsed preview */}
          {!isOpen && preview ? (
            <div className="mt-1 text-sm text-gray-700 line-clamp-2">
              {preview}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onEdit ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent toggling when clicking edit
                onEdit();
              }}
              className="h-8 px-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1"
              aria-label={`Edit ${title}`}
              title={`Edit ${title}`}
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          ) : null}

          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Body */}
      {isOpen ? (
        <div className="px-4 pb-4">
          <div className="pt-3 border-t border-gray-100">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

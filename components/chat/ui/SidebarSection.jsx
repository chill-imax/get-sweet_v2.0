import { ChevronRight, ChevronDown, Pencil } from "lucide-react";
import React from "react";

export const SidebarSection = ({
  title,
  isOpen,
  onToggle,
  onEdit,
  children,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {title}
      </span>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            title="Edit Section"
            className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
          onClick={onToggle}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>

    <div
      className={`transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="p-4 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm cursor-text hover:border-blue-300 transition"
        onClick={onEdit}
      >
        {children}
      </div>
    </div>
  </div>
);

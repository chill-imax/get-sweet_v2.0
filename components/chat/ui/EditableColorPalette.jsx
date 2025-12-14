import React from "react";
import { Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_COLORS = 6;
const DEFAULT_COLOR = "#D3D3D3";

export const EditableColorPalette = ({ colors, isEditing, onChange }) => {
  const safeColors = Array.isArray(colors)
    ? colors.filter((c) => /^#[0-9A-F]{6}$/i.test(c))
    : [];

  const updateColor = (index, value) => {
    const hex = value.toUpperCase();
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return;

    const updated = [...safeColors];
    updated[index] = hex;
    onChange(updated);
  };

  const addColor = () => {
    if (safeColors.length >= MAX_COLORS) return;
    onChange([...safeColors, DEFAULT_COLOR]);
  };

  const removeColor = (index) => {
    onChange(safeColors.filter((_, i) => i !== index));
  };

  /* ---------------------------------------------------
   * READ MODE
   * --------------------------------------------------- */
  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-3">
        {safeColors.length > 0 ? (
          safeColors.map((color, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-mono text-gray-600">
                {color}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-300 italic text-xs">
            No colors defined
          </span>
        )}
      </div>
    );
  }

  /* ---------------------------------------------------
   * EDIT MODE
   * --------------------------------------------------- */
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {safeColors.map((color, idx) => (
            <motion.div
              key={color + idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="group relative"
            >
              {/* Color Block */}
              <div
                className="w-full aspect-square rounded-xl border border-gray-200 shadow-sm cursor-pointer"
                style={{ backgroundColor: color }}
              />

              {/* Invisible color picker overlay */}
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(idx, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Pick color"
              />

              {/* Remove button */}
              <button
                onClick={() => removeColor(idx)}
                className="
                  absolute -top-2 -right-2
                  bg-white border border-gray-200 rounded-full
                  p-1 shadow-sm
                  opacity-0 group-hover:opacity-100
                  transition
                "
                aria-label="Remove color"
              >
                <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-500" />
              </button>

              {/* Hex label */}
              <div className="mt-1 text-center">
                <input
                  type="text"
                  value={color}
                  maxLength={7}
                  onChange={(e) => updateColor(idx, e.target.value)}
                  className="
                    w-full text-[10px] font-mono text-center
                    bg-transparent outline-none
                    text-gray-600
                  "
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add color */}
        {safeColors.length < MAX_COLORS && (
          <button
            onClick={addColor}
            className="
              aspect-square rounded-xl border-2 border-dashed
              border-gray-300 text-gray-400
              hover:border-blue-500 hover:text-blue-500
              flex items-center justify-center
              transition
            "
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Limit hint */}
      <div className="flex justify-between items-center text-[10px] text-gray-400">
        <span>
          {safeColors.length}/{MAX_COLORS} colors
        </span>
        {safeColors.length >= MAX_COLORS && (
          <span className="text-red-500">Max colors reached</span>
        )}
      </div>
    </div>
  );
};

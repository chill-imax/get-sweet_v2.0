"use client";

import React, { useMemo, useRef } from "react";
import { Trash2, Plus } from "lucide-react";

const MAX_COLORS = 6;
const DEFAULT_COLOR = "#D3D3D3";

function isValidHex(value) {
  return /^#[0-9A-F]{6}$/i.test(value);
}

function normalizeHex(value) {
  if (!value) return "";
  let v = value.trim().toUpperCase();
  if (!v.startsWith("#")) v = "#" + v;
  return v;
}

export default function EditableColorPalette({ colors, isEditing, onChange }) {
  const safeColors = useMemo(() => {
    const arr = Array.isArray(colors) ? colors : [];
    return arr
      .map((c) => (typeof c === "string" ? c.toUpperCase() : ""))
      .filter((c) => isValidHex(c));
  }, [colors]);

  const pickerRefs = useRef([]);

  const setPickerRef = (idx, el) => {
    pickerRefs.current[idx] = el;
  };

  // ✅ Reliable picker open: .click() only (works as a user gesture from pointer events)
  const openPicker = (idx) => {
    const el = pickerRefs.current[idx];
    if (!el) return;
    el.click();
  };

  const updateColor = (index, value) => {
    const hex = normalizeHex(value);
    if (!isValidHex(hex)) return;
    const updated = [...safeColors];
    updated[index] = hex;
    onChange?.(updated);
  };

  const addColor = () => {
    if (safeColors.length >= MAX_COLORS) return;
    onChange?.([...safeColors, DEFAULT_COLOR]);
  };

  const removeColor = (index) => {
    onChange?.(safeColors.filter((_, i) => i !== index));
  };

  /* ---------------- READ MODE ---------------- */
  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-3">
        {safeColors.length > 0 ? (
          safeColors.map((color, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-mono text-gray-600">
                {color}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-300 italic text-xs">No colors defined</span>
        )}
      </div>
    );
  }

  /* ---------------- EDIT MODE ---------------- */
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {safeColors.map((color, idx) => (
          <div
            key={color + idx}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white"
          >
            {/* Swatch */}
            <div className="relative w-10 h-10 shrink-0">
              <button
                type="button"
                onPointerDown={(e) => {
                  // keep it a gesture + prevent focus weirdness
                  e.preventDefault();
                  openPicker(idx);
                }}
                className="w-10 h-10 rounded-lg border border-gray-200"
                style={{ backgroundColor: color }}
                aria-label={`Pick color ${color}`}
                title="Pick color"
              />

              {/* Hidden color input anchored to swatch (picker position stays sane) */}
              <input
                ref={(el) => setPickerRef(idx, el)}
                type="color"
                value={color}
                onChange={(e) => updateColor(idx, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            {/* Hex input (secondary + also opens picker on click) */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={color}
                maxLength={7}
                onChange={(e) => {
                  const next = normalizeHex(e.target.value);
                  // allow typing; only commit when valid
                  if (isValidHex(next)) updateColor(idx, next);
                }}
                onPointerDown={(e) => {
                  // ✅ This is a real user gesture; open picker reliably
                  // Don’t preventDefault here if you still want caret selection on click.
                  // If you *only* want picker, uncomment preventDefault().
                  // e.preventDefault();
                  openPicker(idx);
                }}
                onKeyDown={(e) => {
                  // keyboard: Enter/Space opens picker
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPicker(idx);
                  }
                }}
                className="
                  w-full h-10 px-3 rounded-lg border border-gray-200
                  font-mono text-sm text-gray-700
                  bg-gray-50/60
                  outline-none
                  focus:ring-2 focus:ring-gray-200
                  cursor-pointer
                "
                title="Click to pick a color (or type a hex code)"
              />
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeColor(idx)}
              className="h-10 w-10 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 transition flex items-center justify-center shrink-0"
              aria-label="Remove color"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-gray-400">
          {safeColors.length}/{MAX_COLORS} colors
        </div>

        {safeColors.length < MAX_COLORS && (
          <button
            type="button"
            onClick={addColor}
            className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add color
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";

const CompetitorCard = ({
  comp,
  isSelected,
  isMenuOpen,
  toggleSelection,
  toggleMenu,
  closeMenu,
  activeTab,
  onSave,
  onDelete,
  isAlreadySaved, // <--- Nueva prop recibida del padre
}) => {
  // Estado local para expandir/contraer texto
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper para listas
  const renderList = (items) => {
    if (Array.isArray(items)) return items.join(", ");
    return items;
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-200 group flex flex-col
        ${
          isSelected
            ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10"
            : "border-slate-200 hover:border-indigo-200 hover:shadow-lg"
        }
      `}
    >
      {/* --- BADGE: YA GUARDADO --- */}
      {isAlreadySaved && activeTab === "search" && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full border border-green-200 shadow-sm flex items-center gap-1">
          <span>✓</span> In Library
        </div>
      )}

      {/* CHECKBOX (Solo si no está guardado o estamos en librería) */}
      <div className="absolute top-4 left-4 z-20">
        <input
          type="checkbox"
          className="w-5 h-5 rounded text-indigo-600 cursor-pointer disabled:opacity-50"
          checked={isSelected}
          onChange={() => toggleSelection(comp.url)}
          disabled={isAlreadySaved && activeTab === "search"} // No seleccionar si ya está guardado
        />
      </div>

      {/* MENU DE TRES PUNTOS */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => toggleMenu(comp.url)}
          className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeMenu}></div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-30 animate-fade-in origin-top-right">
              {/* Botón Guardar (Condicional) */}
              {activeTab === "search" && (
                <button
                  onClick={() => !isAlreadySaved && onSave(comp)}
                  disabled={isAlreadySaved}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    isAlreadySaved
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  <span>{isAlreadySaved ? "✓" : "💾"}</span>
                  {isAlreadySaved ? "Saved" : "Save to Library"}
                </button>
              )}

              <button
                onClick={() => onDelete(comp)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <span>🗑️</span>{" "}
                {activeTab === "search" ? "Hide Card" : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* --- HEADER --- */}
      <div className="p-6 pl-12 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50 rounded-t-2xl">
        <h3
          className="font-bold text-xl text-slate-800 pr-8 line-clamp-1"
          title={comp.name}
        >
          {comp.name}
        </h3>

        {/* CORRECCIÓN 1: URL Desbordada arreglada con 'truncate' */}
        <a
          href={comp.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-indigo-500 hover:underline block w-full truncate mt-1"
          title={comp.url} // Tooltip nativo para ver la URL completa
        >
          {comp.url}
        </a>
      </div>

      {/* --- BODY --- */}
      <div className="p-6 flex flex-col gap-4 flex-grow">
        {/* CORRECCIÓN 2: Texto Expandible */}
        <div
          className="cursor-pointer group/text"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">
              Strategy / Offer
            </h4>
            <span className="text-[10px] text-indigo-400 opacity-0 group-hover/text:opacity-100 transition-opacity">
              {isExpanded ? "Show less" : "Read more"}
            </span>
          </div>

          <p
            className={`text-sm text-slate-600 transition-all duration-300 ${
              isExpanded ? "" : "line-clamp-3"
            }`}
          >
            {renderList(comp.analysis?.what_they_sell) ||
              renderList(comp.analysis?.core_services) ||
              "No detailed strategy data extracted."}
          </p>
        </div>

        {/* Pricing */}
        {comp.analysis?.pricing_model && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-auto">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Pricing Model
            </span>
            <span className="text-xs text-slate-800 font-medium leading-relaxed">
              {comp.analysis.pricing_model}
            </span>
          </div>
        )}

        {/* Footer: Colores y Score */}
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
          <div className="flex -space-x-1">
            {comp.brand_colors && comp.brand_colors.length > 0 ? (
              comp.brand_colors.map((c, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: c }}
                  title={c}
                ></div>
              ))
            ) : (
              <span className="text-[10px] text-slate-300 italic">
                No colors
              </span>
            )}
          </div>

          {comp.relevance_score && (
            <span
              className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide
              ${
                comp.relevance_score === "High"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : comp.relevance_score === "Medium"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              {comp.relevance_score} Match
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitorCard;

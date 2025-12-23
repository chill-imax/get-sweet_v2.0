"use client";

import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Check,
  ArrowRight,
  MoreHorizontal,
  Edit3,
  RefreshCw,
  CheckCircle,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/context/ToastContext";

export default function GeneratedResults({
  structure,
  viewMode,
  onDiscard,
  onApprove,
  onRegenerateGroup,
  onUpdateGroup,
}) {
  // Estado local para manejar selecciones (los favoritos)
  const [selectedIndices, setSelectedIndices] = useState([]);

  const toggleSelection = (idx) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (!structure) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-10">
      {/* 1. HEADER */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🧠</span>
          <h3 className="font-bold text-indigo-900">AI Strategy</h3>
        </div>
        <p className="text-sm text-indigo-800 leading-relaxed">
          {structure.campaignStrategy ||
            "Strategy generated based on your inputs."}
        </p>
      </div>

      {/* 2. GRUPOS DE ANUNCIOS */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex justify-between items-center">
          Generated Structure
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {selectedIndices.length} Selected
          </span>
        </h3>

        {structure.adGroups?.map((group, idx) => (
          <AdGroupResultCard
            key={idx}
            index={idx}
            group={group}
            viewMode={viewMode}
            isSelected={selectedIndices.includes(idx)}
            onToggleSelect={() => toggleSelection(idx)}
            onRegenerate={() =>
              onRegenerateGroup && onRegenerateGroup(idx, group)
            }
            onSaveEdit={(updatedGroup) =>
              onUpdateGroup && onUpdateGroup(idx, updatedGroup)
            }
          />
        ))}
      </div>

      {/* 3. EXTENSIONES */}
      {structure.extensions?.sitelinks?.length > 0 && (
        <div className="border border-gray-200 rounded-2xl p-5 bg-white opacity-80 hover:opacity-100 transition-opacity">
          <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase">
            Extensions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {structure.extensions.sitelinks.map((link, i) => (
              <div
                key={i}
                className="text-xs p-2 bg-gray-50 rounded border border-gray-100"
              >
                <div className="font-semibold text-blue-600 truncate">
                  {link.text}
                </div>
                <div className="text-gray-500 truncate">{link.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ACTION BAR (Aquí estaba el problema) */}
      <div className="sticky bottom-4 z-10 bg-gray-900/95 backdrop-blur text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 mt-8 border border-gray-700">
        <div className="hidden md:block">
          <div className="text-sm font-bold">Review Generated Draft</div>
          <div className="text-xs text-gray-300">
            {selectedIndices.length > 0
              ? `You have selected ${selectedIndices.length} groups to keep.`
              : "Review and approve all groups."}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onDiscard}
            className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </button>

          <button
            onClick={() => {
              const groupsToPublish =
                selectedIndices.length > 0 ? selectedIndices : null;
              onApprove(groupsToPublish);
            }}
            className="flex-1 md:flex-none h-10 px-6 rounded-xl bg-green-500 hover:bg-green-400 text-black text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <Check className="w-4 h-4" />
            {selectedIndices.length > 0
              ? `Launch (${selectedIndices.length})`
              : "Approve & Launch All"}
            <ArrowRight className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdGroupResultCard({
  group,
  index,
  viewMode,
  isSelected,
  onToggleSelect,
  onRegenerate,
  onSaveEdit,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Estado local para edición
  const [editedGroup, setEditedGroup] = useState(group);
  const menuRef = useRef(null);
  const toast = useToast();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejadores de Edición
  const handleSave = () => {
    onSaveEdit(editedGroup);
    setIsEditing(false);
    toast.success("Ads Group updated successfully.");
  };

  const handleCancelEdit = () => {
    setEditedGroup(group); // Revertir
    setIsEditing(false);
  };

  // Renderizar contenido Editable vs Solo Lectura
  return (
    <div
      className={`
        bg-white border rounded-2xl shadow-sm transition-all relative
        ${
          isSelected
            ? "border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-100"
            : "border-gray-200 hover:shadow-md"
        }
    `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {/* Lado Izquierdo: Info + Toggle Detalles */}
        <div
          className="flex-1 flex items-center gap-3 cursor-pointer"
          onClick={() => !isEditing && setIsOpen(!isOpen)}
        >
          {/* Indicador Visual de Selección */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect();
            }}
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              isSelected
                ? "bg-indigo-600 border-indigo-600"
                : "border-gray-300 hover:border-indigo-400"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>

          <div>
            {isEditing ? (
              <input
                value={editedGroup.name}
                onChange={(e) =>
                  setEditedGroup({ ...editedGroup, name: e.target.value })
                }
                className="text-base font-bold text-gray-900 border-b border-indigo-300 focus:outline-none px-1"
                autoFocus
              />
            ) : (
              <div className="text-base font-bold text-gray-900">
                {group.name}
              </div>
            )}

            <div className="flex gap-2 mt-1">
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {group.keywords?.length || 0} Keywords
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {group.ads?.length || 0} Ads
              </span>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Menú de Opciones (...) */}
        <div className="flex items-center gap-2" ref={menuRef}>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleCancelEdit}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* DROPDOWN MENU */}
              {showMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                      setIsOpen(true);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500" /> Edit Content
                  </button>
                  <button
                    onClick={() => {
                      onToggleSelect();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${
                        isSelected ? "text-indigo-600" : "text-gray-500"
                      }`}
                    />
                    {isSelected ? "Deselect" : "Select to Keep"}
                  </button>
                  <div className="h-px bg-gray-100 my-0"></div>
                  <button
                    onClick={() => {
                      onRegenerate();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Regenerate this Group
                  </button>
                </div>
              )}
            </div>
          )}

          {!isEditing && (
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* CUERPO DESPLEGABLE */}
      {isOpen && (
        <div className="border-t border-gray-100 p-4 space-y-5 bg-gray-50/30">
          {/* Si está editando, mostramos inputs, sino vista previa */}
          {isEditing ? (
            <EditModeBody group={editedGroup} setGroup={setEditedGroup} />
          ) : (
            <ViewModeBody group={group} viewMode={viewMode} />
          )}
        </div>
      )}
    </div>
  );
}

// --- Vista de Solo Lectura (Lo que ya tenías) ---
function ViewModeBody({ group, viewMode }) {
  return (
    <>
      {/* KEYWORDS */}
      <div>
        <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">
          Targeting
        </h5>
        <div className="flex flex-wrap gap-2">
          {group.keywords.map((kw, k) => (
            <span
              key={k}
              className={`text-xs px-2 py-1 rounded border ${
                kw.matchType === "EXACT"
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-yellow-50 text-yellow-700 border-yellow-100"
              }`}
            >
              {kw.matchType === "EXACT" ? `[${kw.text}]` : `"${kw.text}"`}
            </span>
          ))}
        </div>
      </div>
      {/* ADS */}
      <div>
        <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">
          Ad Preview
        </h5>
        {group.ads.map((ad, a) => (
          <div
            key={a}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div className="text-xl text-[#1a0dab] mb-1 hover:underline cursor-pointer">
              {ad.headlines[0]} | {ad.headlines[1]}
            </div>
            <div className="text-sm text-[#4d5156]">{ad.descriptions[0]}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// --- Vista de Edición (Inputs) ---
function EditModeBody({ group, setGroup }) {
  // Función helper para cambiar keywords
  const updateKeyword = (idx, val) => {
    const newKws = [...group.keywords];
    newKws[idx].text = val;
    setGroup({ ...group, keywords: newKws });
  };

  // Función helper para cambiar headlines
  const updateHeadline = (adIdx, hIdx, val) => {
    const newAds = [...group.ads];
    newAds[adIdx].headlines[hIdx] = val;
    setGroup({ ...group, ads: newAds });
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* EDITAR KEYWORDS */}
      <div>
        <label className="text-xs font-bold text-indigo-600 uppercase mb-2 block">
          Edit Keywords
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {group.keywords.map((kw, k) => (
            <input
              key={k}
              value={kw.text}
              onChange={(e) => updateKeyword(k, e.target.value)}
              className="text-xs p-2 border border-gray-200 rounded-lg focus:border-indigo-500 outline-none w-full"
            />
          ))}
        </div>
      </div>

      {/* EDITAR ADS */}
      <div>
        <label className="text-xs font-bold text-indigo-600 uppercase mb-2 block">
          Edit Ad Copy
        </label>
        {group.ads.map((ad, aIdx) => (
          <div key={aIdx} className="space-y-2">
            {ad.headlines.slice(0, 3).map((hl, hIdx) => (
              <input
                key={hIdx}
                value={hl}
                onChange={(e) => updateHeadline(aIdx, hIdx, e.target.value)}
                placeholder={`Headline ${hIdx + 1}`}
                className="text-sm p-2 border border-gray-200 rounded-lg focus:border-indigo-500 outline-none w-full font-medium"
              />
            ))}
            <textarea
              value={ad.descriptions[0]}
              onChange={(e) => {
                const newAds = [...group.ads];
                newAds[aIdx].descriptions[0] = e.target.value;
                setGroup({ ...group, ads: newAds });
              }}
              className="text-sm p-2 border border-gray-200 rounded-lg focus:border-indigo-500 outline-none w-full resize-none"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

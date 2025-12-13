"use client";
import {
  Layout,
  Target,
  X,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function RightSidebar({ isOpen, setIsOpen, activeContext }) {
  // NOTA: Aquí luego recibiremos los datos reales como props

  return (
    <>
      <div
        className={`
          fixed inset-y-0 right-0 z-40 w-80 bg-gray-50 border-l border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-5 bg-white shrink-0">
          <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
            {activeContext === "general" ? (
              <>
                <Layout className="w-4 h-4" /> Contexto de Marca
              </>
            ) : (
              <>
                <Target className="w-4 h-4" /> Detalles de Campaña
              </>
            )}
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {activeContext === "general" ? (
            // --- CONTENIDO GENERAL (Branding) ---
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Misión
                </label>
                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
                  Ayudar a dueños de negocios a automatizar su marketing sin
                  complicaciones.
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sweet suggestions
                </h4>
                <p className="text-xs text-blue-600 leading-snug">
                  Tu misión está clara. Ahora podrías crear una campaña para
                  atraer nuevos leads.
                </p>
              </div>
            </>
          ) : (
            // --- CONTENIDO CAMPAÑA ---
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Objetivo
                </label>
                <div className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  Aumentar ventas un 20%
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Assets
                  </label>
                  <span className="text-[10px] bg-gray-200 px-1.5 rounded text-gray-600">
                    3 listos
                  </span>
                </div>

                {/* Mock Assets */}
                <div className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-purple-300 transition cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700 font-medium">
                      Post Instagram
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500" />
                </div>
              </div>

              <button className="w-full py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4" />
                Aprobar y Publicar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

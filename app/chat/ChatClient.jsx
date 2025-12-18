"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import BrandImportPanel from "@/components/chat/onboarding/BrandImportPanel";

const DRAFT_KEY = "sweet:brandDraft";

export default function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeContext, setActiveContext] = useState("general");
  const [isLeftOpen, setIsLeftOpen] = useState(false);

  // Estados: "none" | "importing" | "draft_ready" | "locked" | "failed"
  const [brandStatus, setBrandStatus] = useState("none");
  const [brandDraft, setBrandDraft] = useState(null);

  // --- LÓGICA DE SIGNAL---
  const [aiCompletedSignal, setAiCompletedSignal] = useState(0);
  const aiCompleted = searchParams.get("aiCompleted") === "true";

  useEffect(() => {
    if (aiCompleted) {
      const timer = setTimeout(() => {
        setAiCompletedSignal(Date.now());
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [aiCompleted]);
  // ----------------------------------

  const headerTitle = useMemo(() => {
    if (brandStatus === "locked") return "Brand ready";
    if (brandStatus === "draft_ready") return "Draft ready";
    if (brandStatus === "importing") return "Importing brand…";
    return "Import your brand";
  }, [brandStatus]);

  function clearAICompletedParam() {
    router.replace("/chat");
    // Opcional: Resetear el signal localmente
    setAiCompletedSignal(0);
  }

  return (
    // 1. FIX LAYOUT: h-screen + overflow-hidden para congelar la altura total y evitar scroll en el body
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar Izquierdo */}
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        brandStatus={brandStatus}
      />

      {/* Área Principal (Columna derecha) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        {/* Header Fijo (No scrollea) */}
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => {}}
        />

        {/* 2. AREA DE CONTENIDO CON SCROLL */}
        {/* flex-1 toma el espacio restante. overflow-y-auto permite scroll solo aquí */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 relative">
          <div className="h-full">
            <BrandImportPanel
              brandStatus={brandStatus}
              // Eventos de estado
              onStartImport={() => {
                setBrandStatus("importing");
                setBrandDraft(null);
              }}
              onDraftReady={(draft) => {
                setBrandDraft(draft);
                setBrandStatus("draft_ready");
                try {
                  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
                } catch {}
              }}
              onImportFailed={() => setBrandStatus("failed")}
              // Redirecciones
              onGoToAIBrandSetup={() => router.push("/chat/brand-ai")}
              // Señal de vuelta del chat AI
              aiCompletedSignal={aiCompletedSignal}
              onAICompletedHandled={clearAICompletedParam}
              // ✅ FLUJO PRINCIPAL: Al confirmar importación, ir a REVISIÓN
              onConfirmBrand={(draft) => {
                try {
                  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
                } catch {}
                setBrandStatus("draft_ready");

                // Redirige al panel de detalles en modo revisión
                router.push("/chat/brand-details?mode=review");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

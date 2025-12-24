"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/useContext";
import { useCompany } from "@/context/CompanyContext";
import { useToast } from "@/context/ToastContext";
import { uid, buildDraftFromSources } from "./utils";

export function useBrandSources({
  onStartImport,
  onDraftReady,
  onImportFailed,
  onAICompletedHandled,
  aiCompletedSignal,
}) {
  const { token } = useAuth();
  const { companyData, updateCompanyState, loading } = useCompany();
  const toast = useToast();

  const [sources, setSources] = useState({
    website: {
      status: "none",
      url: "",
      lastUpdatedAt: null,
      error: null,
      data: null,
    },
    decks: [],
    // 🧠 UPDATE 1: Agregamos hasChatHistory al estado inicial
    ai: {
      status: "none",
      lastUpdatedAt: null,
      hasChatHistory: false,
    },
  });

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    body: "",
    confirmText: "Confirm",
    action: null,
  });

  const isBusy =
    sources.website.status === "importing" ||
    sources.decks.some((d) => d.status === "importing");

  // =========================================================
  // 1. HYDRATION & FETCHING
  // =========================================================
  useEffect(() => {
    if (loading || !companyData || !token) return;

    // A. Hydrate Website
    const currentUrl = companyData.website || "";
    setWebsiteUrl((prev) => (prev ? prev : currentUrl));

    // B. Hydrate Basic State (mantenemos lo previo mientras cargamos lo async)
    setSources((prev) => ({
      ...prev,
      website: {
        ...prev.website,
        status: currentUrl ? "ready" : "none",
        url: currentUrl,
        lastUpdatedAt: companyData.updatedAt || new Date().toISOString(),
      },
    }));

    // C. Fetch PDF History
    const fetchPdfHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand/sources`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const json = await res.json();
          const sourcesList = json.data || json;
          const pdfs = Array.isArray(sourcesList)
            ? sourcesList.filter((s) => s.sourceType === "pdf")
            : [];

          if (pdfs.length > 0) {
            setSources((prev) => ({
              ...prev,
              decks: pdfs.map((pdf) => ({
                id: pdf._id || uid(),
                status: "ready",
                fileName: pdf.sourceName || "Documento PDF",
                lastUpdatedAt: pdf.createdAt,
                error: null,
                cloudinaryUrl: pdf.url || "",
              })),
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching PDF history:", err);
      }
    };

    // D. Fetch Chat Status
    const fetchChatStatus = async () => {
      try {
        // 👇 CAMBIO AQUÍ: Apuntar a /status en lugar de /history
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const data = await res.json();
          // Ahora data.count SÍ existirá
          const hasHistory = data.count > 0;

          setSources((prev) => ({
            ...prev,
            ai: {
              status: hasHistory ? "ready" : "none",
              lastUpdatedAt: data.lastMessageAt,
              hasChatHistory: hasHistory,
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching chat status:", err);
      }
    };

    fetchPdfHistory();
    fetchChatStatus();
  }, [companyData, loading, token]);

  // =========================================================
  // 2. SIGNAL HANDLER (Cuando termina la entrevista IA)
  // =========================================================
  useEffect(() => {
    if (!aiCompletedSignal) return;

    // 🧠 UPDATE 3: Si la IA terminó, marcamos que hay historial
    setSources((prev) => {
      const nextState = {
        ...prev,
        ai: {
          status: "ready",
          lastUpdatedAt: new Date().toISOString(),
          hasChatHistory: true, // ✅ Ahora sí hay historial
        },
      };
      // Notificar al padre
      onDraftReady?.(buildDraftFromSources(nextState));
      return nextState;
    });

    onAICompletedHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiCompletedSignal]);

  // =========================================================
  // 3. HELPERS
  // =========================================================
  function openConfirm(opts) {
    setConfirm({ open: true, ...opts });
  }
  function closeConfirm() {
    setConfirm((p) => ({ ...p, open: false }));
  }

  function resetAllSources() {
    clearWebsiteSource();
    clearAllDecks();
    setSources((prev) => ({
      ...prev,
      ai: { status: "none", lastUpdatedAt: null, hasChatHistory: false },
    }));
    setError("");
  }

  // =========================================================
  // 4. WEBSITE LOGIC
  // =========================================================
  async function clearWebsiteSource() {
    setSources((prev) => ({
      ...prev,
      website: {
        status: "none",
        url: "",
        lastUpdatedAt: null,
        error: null,
        data: null,
      },
    }));
    setWebsiteUrl("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand/sources/website`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to clear website on server");
      const data = await res.json();
      if (data.companyData) updateCompanyState(data.companyData);
    } catch (err) {
      console.error("Error clearing website:", err);
      setError("Could not delete website source from server.");
    }
  }

  async function handleImportFromWebsite() {
    setError("");
    const url = websiteUrl.trim();
    if (!url) {
      setError("Please enter a valid website URL.");
      return;
    }

    setSources((prev) => ({
      ...prev,
      website: { ...prev.website, status: "importing", url, error: null },
    }));
    onStartImport?.("website");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand/import/url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url: url }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze website.");

      updateCompanyState(data.companyData);

      const nextState = {
        ...sources,
        website: {
          status: "ready",
          url,
          lastUpdatedAt: new Date().toISOString(),
          error: null,
          data: data.companyData,
          sourceId: data.sourceId,
        },
      };

      setSources((prev) => ({ ...prev, website: nextState.website }));

      setTimeout(() => {
        onDraftReady?.(buildDraftFromSources(nextState));
      }, 0);
    } catch (e) {
      console.error("Web import error:", e);
      setSources((prev) => ({
        ...prev,
        website: {
          ...prev.website,
          status: "failed",
          error: e.message || "Failed to analyze website.",
        },
      }));
      setError(e.message || "Failed to analyze website. Please check the URL.");
      onImportFailed?.();
    }
  }

  async function handleReimportWebsite() {
    if (!websiteUrl) return;
    await handleImportFromWebsite();
  }

  // =========================================================
  // 5. FILE LOGIC
  // =========================================================
  function clearAllDecks() {
    setSources((prev) => ({ ...prev, decks: [] }));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function removeDeck(deckId) {
    const previousDecks = sources.decks;
    setSources((prev) => ({
      ...prev,
      decks: prev.decks.filter((d) => d.id !== deckId),
    }));

    try {
      if (deckId.length === 24) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand/sources/${deckId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to delete source");
      }
    } catch (err) {
      console.error("Error removing deck:", err);
      setError("Could not delete file from server.");
      setSources((prev) => ({ ...prev, decks: previousDecks }));
    }
  }

  function triggerDeckPicker() {
    fileRef.current?.click();
  }

  async function handleUploadPdfs(e) {
    setError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const pdfs = files.filter(
      (f) =>
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (!pdfs.length) {
      setError("Please upload PDF files.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const tempIds = pdfs.map(() => uid());
    const newItems = pdfs.map((f, i) => ({
      id: tempIds[i],
      status: "importing",
      fileName: f.name,
      cloudinaryUrl: "",
      lastUpdatedAt: null,
      error: null,
    }));

    setSources((prev) => ({ ...prev, decks: [...prev.decks, ...newItems] }));
    onStartImport?.("deck");

    try {
      const uploadPromises = pdfs.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand/import/files`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || `Failed to upload ${file.name}`);
        return { fileName: file.name, result: data };
      });

      const results = await Promise.all(uploadPromises);

      if (results.length > 0) {
        const lastResult = results[results.length - 1];
        if (lastResult.result.companyData) {
          updateCompanyState(lastResult.result.companyData);
        }
      }

      setSources((prev) => {
        const updatedDecks = prev.decks.map((d) => {
          const match = results.find((r) => r.fileName === d.fileName);
          if (tempIds.includes(d.id) && match) {
            return {
              ...d,
              status: "ready",
              cloudinaryUrl:
                match.result.sourceId || match.result.url || "uploaded",
              lastUpdatedAt: new Date().toISOString(),
              error: null,
            };
          }
          return d;
        });

        const nextState = { ...prev, decks: updatedDecks };

        setTimeout(() => {
          onDraftReady?.(buildDraftFromSources(nextState));
        }, 0);

        return nextState;
      });
    } catch (e2) {
      console.error("Upload error:", e2);
      setError("Some files failed to upload.");
      setSources((prev) => ({
        ...prev,
        decks: prev.decks.map((d) =>
          tempIds.includes(d.id) && d.status === "importing"
            ? { ...d, status: "failed", error: "Upload failed" }
            : d
        ),
      }));
      onImportFailed?.();
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // =========================================================
  // 6. AI LOGIC (CHAT)
  // =========================================================
  async function clearAISource() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/history`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to clear history on server");
      }

      // 🧠 UPDATE 4: Resetear hasChatHistory a false
      setSources((prev) => ({
        ...prev,
        ai: {
          status: "none",
          lastUpdatedAt: null,
          hasChatHistory: false,
        },
      }));

      toast?.success("Conversation history cleared!");
    } catch (err) {
      console.error("Error clearing AI history:", err);
      toast?.error("Could not clear conversation history.");
    }
  }

  return {
    sources,
    websiteUrl,
    setWebsiteUrl,
    error,
    isBusy,
    fileRef,
    confirm,
    handleImportFromWebsite,
    handleReimportWebsite,
    clearWebsiteSource,
    handleUploadPdfs,
    triggerDeckPicker,
    clearAllDecks,
    removeDeck,
    clearAISource,
    resetAllSources,
    openConfirm,
    closeConfirm,
  };
}

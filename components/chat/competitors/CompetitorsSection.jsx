import React from "react";
import { useCompetitorAnalysis } from "@/hooks/useCompetitorAnalysis";
import CompetitorHeader from "../competitors/CompetitorHeader";
import SearchForm from "../competitors/SearchForm";
import MarketOverview from "../competitors/MarketOverview";
import BulkActionsBar from "../competitors/BulkActionsBar";
import CompetitorCard from "./CompetitorGrid";

// Componente Spinner Simple
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
    <h3 className="text-lg font-bold text-slate-700">Analyzing Market...</h3>
    <p className="text-sm text-slate-400">
      Scraping websites & extracting strategy strategies
    </p>
  </div>
);

const CompetitorTester = () => {
  const logic = useCompetitorAnalysis();

  const currentList =
    logic.activeTab === "search"
      ? logic.searchResult?.data?.competitors
      : logic.savedCompetitors;

  const marketData = logic.searchResult?.data?.market_overview;

  const checkIsSaved = (url) => {
    if (logic.activeTab === "library") return false;

    return logic.savedCompetitors.some((saved) => saved.url === url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans bg-slate-50 min-h-screen">
      <CompetitorHeader
        activeTab={logic.activeTab}
        setActiveTab={logic.setActiveTab}
      />

      {/* Formulario solo en Search */}
      {logic.activeTab === "search" && (
        <SearchForm
          searchMode={logic.searchMode}
          setSearchMode={logic.setSearchMode}
          companyProfile={logic.companyProfile}
          formData={logic.formData}
          handleChange={logic.handleChange}
          handleAnalyze={logic.handleAnalyze}
          loading={logic.loading}
          isDisabled={logic.isSearchDisabled()}
        />
      )}

      {/* Mensajes */}
      {logic.error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span> {logic.error}
        </div>
      )}
      {logic.successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
          <span>✅</span> {logic.successMsg}
        </div>
      )}

      {/* CORRECCIÓN 4: Spinner Grande Central */}
      {logic.loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Resultados */}
          {logic.activeTab === "search" && (
            <MarketOverview marketData={marketData} />
          )}

          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentList?.map((comp, idx) => {
              const isSaved = checkIsSaved(comp.url);
              return (
                <CompetitorCard // Usamos el componente importado, no el inline
                  key={idx}
                  comp={comp}
                  activeTab={logic.activeTab}
                  // Props de selección
                  isSelected={logic.selectedItems.includes(comp.url)}
                  toggleSelection={logic.toggleSelection}
                  // Props de menú
                  isMenuOpen={logic.openMenuId === comp.url}
                  toggleMenu={logic.toggleMenu}
                  closeMenu={() => logic.toggleMenu(null)}
                  // Acciones
                  onSave={logic.handleSave}
                  onDelete={logic.handleDelete}
                  // Nueva Prop Visual
                  isAlreadySaved={isSaved}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {logic.activeTab === "library" &&
            logic.savedCompetitors.length === 0 &&
            !logic.loadingSaved && (
              <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                <p>
                  Your library is empty. Go to Live Search to find competitors.
                </p>
              </div>
            )}
        </>
      )}

      {/* Barra Flotante */}
      <BulkActionsBar
        selectedCount={logic.selectedItems.length}
        onSave={() => {
          const selectedObjs = currentList.filter((c) =>
            logic.selectedItems.includes(c.url)
          );
          logic.handleSave(selectedObjs);
        }}
      />
    </div>
  );
};

export default CompetitorTester;

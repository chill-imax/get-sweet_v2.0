import React from "react";

const CompetitorHeader = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Competitor <span className="text-indigo-600">Intelligence</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          AI-Powered Market Analysis & Strategy Extraction
        </p>
      </div>

      <div className="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm">
        {["search", "library"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all capitalize ${
              activeTab === tab
                ? "bg-indigo-100 text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "search" ? "Live Search" : "Saved Library"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompetitorHeader;

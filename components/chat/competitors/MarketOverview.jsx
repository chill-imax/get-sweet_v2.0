import React from "react";

const MarketOverview = ({ marketData }) => {
  if (!marketData) return null;

  return (
    <div className="mb-10 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
      <h2 className="text-xl font-bold mb-2 text-indigo-200">
        Market Executive Summary
      </h2>
      <p className="text-slate-300 mb-6">{marketData.summary}</p>
      <div className="grid md:grid-cols-2 gap-4">
        {marketData.market_gaps?.map((gap, i) => (
          <div
            key={i}
            className="flex gap-2 text-sm text-slate-300 bg-white/5 p-3 rounded-lg"
          >
            <span className="text-green-400">✓</span> {gap}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;

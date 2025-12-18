"use client";

export default function ResultsPanel() {
  const metrics = [
    { label: "Spend", value: "—" },
    { label: "Clicks", value: "—" },
    { label: "Conversions", value: "—" },
    { label: "CPA", value: "—" },
  ];

  return (
    <div className="px-6 py-4 space-y-4">
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-5">
        <div className="text-sm font-semibold text-gray-900">
          Results / Performance
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Coming soon. This tab will show spend, clicks, conversions, CPA, ROAS,
          and an AI summary.
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4"
            >
              <div className="text-[11px] font-bold text-gray-500 uppercase">
                {m.label}
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Tip: you can ship this tab first with “manual entry” or mock data
          while Google Ads is not connected.
        </div>
      </div>
    </div>
  );
}

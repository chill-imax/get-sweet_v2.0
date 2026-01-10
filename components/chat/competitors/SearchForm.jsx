import React from "react";

const SearchForm = ({
  searchMode,
  setSearchMode,
  companyProfile,
  formData,
  handleChange,
  handleAnalyze,
  loading,
  isDisabled,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
      {/* TOGGLE */}
      <div className="flex gap-6 mb-6 border-b border-slate-100 pb-4">
        {[
          {
            id: "auto",
            label: "Use My Brand Data (Auto)",
            sub: "Uses profile industry",
          },
          {
            id: "manual",
            label: "Manual Search",
            sub: "Enter custom niche/url",
          },
        ].map((mode) => (
          <label
            key={mode.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                searchMode === mode.id
                  ? "border-indigo-600"
                  : "border-slate-300"
              }`}
            >
              {searchMode === mode.id && (
                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
              )}
            </div>
            <input
              type="radio"
              className="hidden"
              name="mode"
              value={mode.id}
              checked={searchMode === mode.id}
              onChange={() => setSearchMode(mode.id)}
            />
            <div>
              <span
                className={`block text-sm font-bold ${
                  searchMode === mode.id ? "text-indigo-700" : "text-slate-600"
                }`}
              >
                {mode.label}
              </span>
              <span className="text-xs text-slate-400">{mode.sub}</span>
            </div>
          </label>
        ))}
      </div>

      <form onSubmit={handleAnalyze} className="flex flex-col gap-6">
        {searchMode === "auto" ? (
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm text-2xl">🏢</div>
            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Analyzing on behalf of:
              </h4>
              {companyProfile ? (
                <div className="text-slate-800 font-medium">
                  {companyProfile.businessName}{" "}
                  <span className="text-slate-400 mx-2">|</span>{" "}
                  {companyProfile.industry}
                </div>
              ) : (
                <div className="text-amber-600 text-sm flex items-center gap-2">
                  ⚠️ No company profile found.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            <InputField
              label="Niche / Industry"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              placeholder="e.g. CRM for Dentists"
            />
            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Global, USA"
            />
            <InputField
              label="Competitor URL (Optional)"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://competitor.com"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isDisabled}
            className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? "Analyzing..." : "🚀 Start Analysis"}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
    />
  </div>
);

export default SearchForm;

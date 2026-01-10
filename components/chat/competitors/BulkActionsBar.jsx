import React from "react";

const BulkActionsBar = ({ selectedCount, onSave }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6 animate-fade-in-up">
      <span className="font-bold text-sm">{selectedCount} Selected</span>
      <div className="h-4 w-px bg-slate-600"></div>
      <button
        onClick={onSave}
        className="text-sm hover:text-indigo-300 flex items-center gap-1 font-medium"
      >
        Save Selected
      </button>
    </div>
  );
};

export default BulkActionsBar;

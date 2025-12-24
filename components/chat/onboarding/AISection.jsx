import { Sparkles, Trash2, MessageSquare } from "lucide-react";
import SourceStatusPill from "./SourceStatusPill";
import { formatTime } from "./utils";

export default function AISection({
  source,
  isLocked,
  onGoToSetup,
  onClear,
  openConfirm,
}) {
  // Lógica de estado (se mantiene igual)
  const hasHistory =
    source?.hasChatHistory === true || (source?.count && source.count > 0);

  const displayStatus = hasHistory ? "ready" : "empty";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
              hasHistory
                ? "bg-blue-50 border-blue-100 text-blue-600" // Estado Activo (Elegante)
                : "bg-gray-50 border-gray-200 text-gray-400" // Estado Vacío (Discreto)
            }`}
          >
            {hasHistory ? (
              <MessageSquare className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">
                AI Interview
              </p>
              <SourceStatusPill status={displayStatus} />
            </div>
            <p className="text-xs text-gray-500">
              {hasHistory
                ? "Conversation in progress."
                : "Optional — fill gaps via chat."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToSetup}
            disabled={isLocked}
            className="h-9 px-4 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {hasHistory ? "Continue" : "Start"}
          </button>

          {hasHistory && (
            <button
              onClick={() =>
                openConfirm({
                  title: "Delete Interview History?",
                  body: "This will permanently delete the chat conversation. This cannot be undone.",
                  confirmText: "Yes, Delete Chat",
                  action: onClear,
                  isDanger: true,
                })
              }
              disabled={isLocked}
              className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 transition-all"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          )}
        </div>
      </div>

      {hasHistory && source.lastUpdatedAt && (
        <div className="mt-3 text-xs text-gray-400 pl-1">
          Last active {formatTime(source.lastUpdatedAt)}
        </div>
      )}
    </div>
  );
}

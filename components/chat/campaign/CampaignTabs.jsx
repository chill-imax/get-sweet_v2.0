"use client";
import { MessageSquare, BarChart3, FileText } from "lucide-react";

export default function CampaignTabs({ active, onChange }) {
  const tabs = [
    { id: "chatbot", label: "Campaign AI", icon: MessageSquare },
    { id: "results", label: "Campaign Performance", icon: BarChart3 },
    { id: "settings", label: "Campaign Details", icon: FileText },
  ];

  return (
    <div className="px-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-1 flex">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold transition inline-flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

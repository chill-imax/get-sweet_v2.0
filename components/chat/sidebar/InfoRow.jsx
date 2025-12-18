"use client";

export default function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-gray-700" />
        </div>
      ) : (
        <div className="w-9 h-9 shrink-0" />
      )}

      <div className="min-w-0">
        <div className="text-[11px] font-bold text-gray-500 uppercase">
          {label}
        </div>
        <div className="text-sm text-gray-800 wrap-break-word">{value}</div>
      </div>
    </div>
  );
}

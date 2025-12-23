export const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => (
  <div>
    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wide flex items-center gap-1">
      {label}
      {required && <span className="text-red-500 text-xs">*</span>}
    </div>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full h-11 px-3 rounded-xl border bg-white text-sm text-gray-900 outline-none focus:ring-2 transition-all appearance-none cursor-pointer
          ${
            required && !value
              ? "border-amber-200 focus:ring-amber-100 bg-amber-50/30"
              : "border-gray-200 focus:ring-gray-200"
          }
        `}
      >
        <option value="" disabled>
          {placeholder || "Select an option"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.emoji} {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

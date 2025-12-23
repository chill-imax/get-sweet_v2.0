export const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div>
    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wide flex items-center gap-1">
      {label}
      {required && <span className="text-red-500 text-xs">*</span>}
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full h-11 px-3 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 transition-all 
        ${
          required && !value
            ? "border-amber-200 focus:border-amber-400 focus:ring-amber-100 bg-amber-50/30"
            : "border-gray-200 focus:ring-gray-200"
        }`}
    />
  </div>
);

export default function ToneSelector({ currentTone, onSelect }) {
  const tones = ["Professional", "Friendly", "Bold", "Playful", "Luxury"];

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tones.map((tone) => (
        <button
          key={tone}
          onClick={() => onSelect(tone)}
          className={`
            px-3 py-1 rounded-full text-xs border transition
            ${
              tone === currentTone
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
            }
          `}
        >
          {tone}
        </button>
      ))}
    </div>
  );
}

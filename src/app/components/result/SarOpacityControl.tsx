export function SarOpacityControl({ opacity, setOpacity }) {
  return (
    <div className="absolute top-20 right-6 z-[100000] w-[220px] rounded-xl bg-[#1F1F23] p-3 text-white shadow-lg">
      <div className="mb-2 text-xs">SAR Transparency</div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={opacity}
        onChange={(e) => setOpacity(Number(e.target.value))}
        className="w-full"
      />

      <div className="mt-1 text-[10px] text-gray-400">{(opacity * 100).toFixed(0)}%</div>
    </div>
  );
}

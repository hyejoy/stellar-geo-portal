const SAR_LEGEND = [
  { color: '#111111', label: '어두움 — 수면 / 매끄러운 지표' },
  { color: '#555555', label: '중간   — 식생 / 토지' },
  { color: '#aaaaaa', label: '밝음   — 건물 / 도로 / 구조물' },
  { color: '#ffffff', label: '매우 밝음 — 금속 구조물 / 모서리' },
];

export default function SarLegend() {
  return (
    <>
      <h3 className="text-sm font-semibold text-gray-300">Radar Intensity</h3>

      {/* Gradient Bar */}
      <div className="h-3 w-full rounded-md bg-gradient-to-r from-black via-gray-600 to-white" />

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low (수면 / 평탄)</span>
        <span>High (건물 / 구조물)</span>
      </div>
      <ul className="mt-1 flex flex-col gap-[6px]">
        {SAR_LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-gray-400">{item.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

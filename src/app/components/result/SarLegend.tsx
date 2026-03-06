'use client';

export default function SarLegend() {
  return (
    <div className="absolute bottom-8 left-6 w-[220px] rounded-xl bg-[#1F1F23] p-3 text-white shadow-lg">
      <h4 className="mb-2 text-xs">Radar Intensity</h4>

      <div className="h-3 w-full rounded bg-gradient-to-r from-black via-gray-500 to-white" />

      <div className="mt-1 flex justify-between text-[10px] text-gray-300">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}

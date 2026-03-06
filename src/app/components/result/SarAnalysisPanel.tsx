'use client';

export default function SarAnalysisPanel() {
  return (
    <div className="bg-panel absolute top-6 left-6 w-[260px] rounded-xl p-4 text-white shadow-xl">
      <h3 className="text-sm font-semibold">SAR Radar Analysis</h3>

      <div className="mt-3 space-y-1 text-xs text-gray-300">
        <div>Data Source : Sentinel-1</div>

        <div>Analysis Type : Backscatter</div>

        <div>ROI Area : 7.91 km²</div>
      </div>
    </div>
  );
}

export default function AnalysisPanel() {
  return (
    <div className="absolute top-4 right-4 z-[1000] w-72 rounded-xl border border-neutral-700 bg-neutral-900 p-5 shadow-2xl">
      <h2 className="mb-4 text-lg font-semibold text-white">AnalysisPanel</h2>

      <div className="mb-4 border-b border-gray-500 pb-1.5">
        <p className="mb-2 text-xs text-neutral-400">Optical (EO)</p>
        {/* Radio Items */}
      </div>
      <div className="mb-4 border-b border-gray-500 pb-1.5">
        <p className="mb-2 text-xs text-neutral-400">Object:</p>
      </div>

      <div>
        <p className="mb-2 text-xs text-neutral-400">NDVI Trend Chart</p>
      </div>
    </div>
  );
}

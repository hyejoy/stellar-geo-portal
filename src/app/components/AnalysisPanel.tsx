/**
 * 
Optical (EO) (위성 종류)
○ Sentinel-2
○ Landsat-8

Radar (SAR) (센서 타입)
○ Sentinel-1

AI Analysis
□ NDVI
□ Change Detection
□ Heatmap

핵심은:

위성 종류

센서 타입

분석 종류
 */

export default function AnalysisPanel() {
  return (
    <div className="absolute top-4 right-4 w-72 rounded-xl bg-neutral-900 p-5 shadow-2xl border border-neutral-700 z-[1000]">
      <h2 className="text-lg font-semibold text-white mb-4">AnalysisPanel</h2>

      <div className="mb-4 border-b border-gray-500 pb-1.5">
        <p className="text-xs text-neutral-400 mb-2">Optical (EO)</p>
        {/* Radio Items */}
      </div>
      <div className="mb-4 border-b border-gray-500 pb-1.5">
        <p className="text-xs text-neutral-400 mb-2">Object:</p>
      </div>

      <div>
        <p className="text-xs text-neutral-400 mb-2">NDVI Trend Chart</p>
      </div>
    </div>
  );
}

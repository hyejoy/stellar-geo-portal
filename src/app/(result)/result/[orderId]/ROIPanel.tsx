'use client';
import { useAnalysisStore } from '@/src/app/store/analysisStore';

export default function ROIPanel() {
  const { landArea, analysisType, satellite } = useAnalysisStore();
  const type = analysisType.toUpperCase();

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-[#111827] to-[#0b0f1a] text-white">
      {/* Title */}
      <div className="border-b border-white/10 px-6 py-4 text-lg font-semibold">
        {type} Analysis
      </div>

      {/* ROI Area */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="text-sm text-gray-400">ROI Area</div>
        <div className="mt-1 text-3xl font-semibold text-cyan-300">{landArea.toFixed(2)} km²</div>
      </div>

      {/* Details */}
      <div className="border-b border-white/10 px-6 py-4 text-sm font-medium text-gray-300">
        {type} Details
      </div>

      <div className="flex flex-col gap-4 px-6 py-4 text-sm">
        <div>
          <div className="text-gray-400">Satellite</div>
          <div className="text-cyan-300">{satellite}</div>
        </div>

        <div>
          <div className="text-gray-400">Polarization</div>
          <div>VV</div>
        </div>

        <div>
          <div className="text-gray-400">Resolution</div>
          <div>10m</div>
        </div>
      </div>

      {/* Layers */}
      <div className="border-t border-white/10 px-6 py-4 text-sm font-medium text-gray-300">
        Layers
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            disabled={type !== 'SAR'}
            checked={type === 'SAR'}
            className="accent-cyan-400"
          />
          Radar SAR
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            disabled={type !== 'NDVI'}
            checked={type === 'NDVI'}
            className="accent-green-400"
          />
          Vegetation NDVI
        </label>
      </div>
    </div>
  );
}

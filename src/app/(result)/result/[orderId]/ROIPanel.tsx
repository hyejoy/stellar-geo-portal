'use client';
import { useAnalysisStore, useSelectedYears } from '@/src/app/store/analysisStore';

// ─── 분석 타입별 메타 정보 ────────────────────────────────────────────────────

const SAR_DETAILS = [
  { label: 'Satellite', value: 'Sentinel-1 GRD' },
  { label: 'Band', value: 'C-Band (5.4 GHz)' },
  { label: 'Polarization', value: 'VV + VH' },
  { label: 'Resolution', value: '10m (IW mode)' },
  { label: 'Pass', value: 'Ascending / Descending' },
];

const NDVI_DETAILS = [
  { label: 'Satellite', value: 'Sentinel-2 L2A' },
  { label: 'Bands', value: 'B04 (Red) + B08 (NIR)' },
  { label: 'Cloud Filter', value: 'SCL 기반 수면·구름 보정' },
  { label: 'Resolution', value: '10m' },
  { label: 'Season', value: '여름 (Jun – Sep)' },
];

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function ROIPanel() {
  const { landArea, analysisType } = useAnalysisStore();
  const { selectedStartYear, selectedEndYear } = useSelectedYears();

  const isSar = analysisType === 'sar';
  const type = analysisType.toUpperCase();
  const details = isSar ? SAR_DETAILS : NDVI_DETAILS;

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-[#111827] to-[#0b0f1a] text-white">
      {/* Title */}
      <div className="border-b border-white/10 px-6 py-4 text-lg font-semibold">
        {type} Analysis
      </div>

      {/* ROI Area */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="text-[10px] tracking-[0.12em] text-white/35 uppercase">ROI Area</div>
        <div className="mt-1 text-3xl font-semibold text-cyan-300">{landArea.toFixed(2)} km²</div>
      </div>

      {/* 분석 기간 */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="mb-2 text-[10px] tracking-[0.12em] text-white/35 uppercase">분석 기간</div>

        {isSar ? (
          /* SAR: 기준 연도만 */
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400/70" />
            <span className="font-mono text-sm text-white/70">
              기준 연도 <span className="font-semibold text-blue-300">{selectedEndYear}</span>
            </span>
          </div>
        ) : (
          /* NDVI: 시작 ~ 종료 */
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-white/50">{selectedStartYear}</span>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-white/20">
              <path
                d="M1 4h12M9 1l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-mono text-sm font-semibold text-amber-300">
              {selectedEndYear}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="border-b border-white/10 px-6 py-3 text-[10px] tracking-[0.12em] text-white/35 uppercase">
        {type} Details
      </div>

      <div className="flex flex-col gap-3 px-6 py-4 text-sm">
        {details.map(({ label, value }) => (
          <div key={label}>
            <div className="text-[10px] tracking-[0.1em] text-white/30 uppercase">{label}</div>
            <div className="mt-0.5 text-white/70">{value}</div>
          </div>
        ))}
      </div>

      {/* Layers */}
      <div className="mt-auto border-t border-white/10 px-6 py-3 text-[10px] tracking-[0.12em] text-white/35 uppercase">
        Layers
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            disabled={!isSar}
            checked={isSar}
            className="accent-cyan-400"
            readOnly
          />
          <span className={isSar ? 'text-cyan-300' : 'text-white/30'}>Radar SAR</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            disabled={isSar}
            checked={!isSar}
            className="accent-green-400"
            readOnly
          />
          <span className={!isSar ? 'text-green-300' : 'text-white/30'}>Vegetation NDVI</span>
        </label>
      </div>
    </div>
  );
}

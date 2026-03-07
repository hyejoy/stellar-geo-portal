'use client';

import {
  useAnalysisActions,
  useAnalysisType,
  useSelectedArea,
  useSelectedYears,
} from '@/src/app/store/analysisStore';
import type { AnalysisType } from '@/src/app/store/analysisStore';
import { AREAS } from '@/src/constants/areas';
import { AreaKey } from '@/src/types/area';
import { useState } from 'react';

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

// ─── 공통 select 스타일 ───────────────────────────────────────────────────────
const SELECT_BASE =
  'rounded-lg border border-white/[0.08] bg-[#0d1117] px-3 py-1.5 text-[13px] text-white/80 ' +
  'transition hover:border-white/20 focus:border-yellow-500/50 focus:ring-1 ' +
  'focus:ring-yellow-500/30 focus:outline-none appearance-none cursor-pointer';

export default function MapHeaderPanel() {
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const { selectedStartYear, selectedEndYear } = useSelectedYears();
  const { analysisType } = useAnalysisType();
  const { changeSelectedStartYear, changeSelectedEndYear, changeArea, changeAnalysisType } =
    useAnalysisActions();
  const selectedArea = useSelectedArea();

  const isNDVI = analysisType === 'ndvi';

  // ── endYear 변경 시 startYear > endYear면 startYear = endYear - 1 ──────────
  const handleEndYearChange = (endYear: number) => {
    changeSelectedEndYear(endYear);
    if (selectedStartYear >= endYear) {
      changeSelectedStartYear(Math.max(YEARS[0], endYear - 1));
    }
  };

  // ── startYear 변경 시 startYear >= endYear면 endYear = startYear + 1 ───────
  const handleStartYearChange = (startYear: number) => {
    changeSelectedStartYear(startYear);
    if (startYear >= selectedEndYear) {
      changeSelectedEndYear(Math.min(YEARS[YEARS.length - 1], startYear + 1));
    }
  };

  return (
    <div className="relative flex h-[80px] flex-shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0d1117] px-5">
      {/* 하단 accent 라인 */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-500/15 to-transparent" />

      {/* ── 왼쪽: 선택 지역 ─────────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-2">
        <span className="text-[10px] font-medium tracking-widest text-white/30 uppercase">
          지역
        </span>

        <button
          onClick={() => setIsAreaOpen((v) => !v)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-semibold text-yellow-400 transition hover:bg-white/[0.05] hover:text-yellow-300 focus:outline-none"
        >
          {AREAS[selectedArea].name}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="currentColor"
            className={`transition-transform ${isAreaOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {isAreaOpen && (
          <div className="absolute top-9 left-0 z-50 w-44 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d1117] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {Object.entries(AREAS).map(([areaKey, value]) => (
              <div
                key={areaKey}
                onClick={() => {
                  changeArea(areaKey as AreaKey);
                  setIsAreaOpen(false);
                }}
                className={`cursor-pointer px-3 py-2 text-[12px] transition hover:bg-white/[0.06] ${
                  selectedArea === areaKey ? 'text-yellow-400' : 'text-white/60'
                }`}
              >
                {value.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 가운데: 분석 타입 ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-1">
        {(['sar', 'ndvi'] as AnalysisType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => changeAnalysisType(type)}
            className={`rounded-md px-3 py-1 text-[12px] font-semibold tracking-wide transition-all ${
              analysisType === type
                ? 'bg-yellow-500 text-black shadow-sm'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {type === 'ndvi' ? 'NDVI' : 'SAR'}
          </button>
        ))}
      </div>

      {/* ── 오른쪽: 연도 선택 ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* startYear — NDVI 전용 (SAR일 때 invisible로 자리 유지) */}
        <div className={`flex flex-col items-center gap-0.5 ${isNDVI ? 'visible' : 'invisible'}`}>
          <span className="text-[9px] font-medium tracking-widest text-white/25 uppercase">
            시작
          </span>
          <select
            value={selectedStartYear}
            onChange={(e) => handleStartYearChange(Number(e.target.value))}
            className={SELECT_BASE}
            tabIndex={isNDVI ? 0 : -1}
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* 구분 화살표 (SAR일 때 invisible) */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`mt-3 text-white/20 ${isNDVI ? 'visible' : 'invisible'}`}
        >
          <path
            d="M3 7h8M8 4l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* endYear — 항상 표시 */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] font-medium tracking-widest text-white/25 uppercase">
            {isNDVI ? '종료' : '기준 연도'}
          </span>
          <select
            value={selectedEndYear}
            onChange={(e) => handleEndYearChange(Number(e.target.value))}
            className={`${SELECT_BASE} border-yellow-500/30 font-semibold text-yellow-400`}
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

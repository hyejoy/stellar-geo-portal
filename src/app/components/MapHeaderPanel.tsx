'use client';

import { useSelectedArea } from '@/src/app/store/analysisStore';
import { useState } from 'react';

type Props = {
  startYear: number;
  endYear: number;
  onChangeStartYear?: (year: number) => void;
  onChangeEndYear?: (year: number) => void;
};

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

export default function MapHeaderPanel({
  startYear,
  endYear,
  onChangeStartYear,
  onChangeEndYear,
}: Props) {
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  const selectedArea = useSelectedArea();

  return (
    <div className="flex h-[50px] items-center justify-between bg-gradient-to-r from-[#111827] to-[#1f2937] px-6 text-white">
      {/* 왼쪽 - 선택 지역 */}
      <div className="relative flex items-center gap-2">
        <span className="text-sm text-white/70">선택한 지역:</span>

        <button
          onClick={() => setIsAreaOpen(!isAreaOpen)}
          className="flex items-center gap-1 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
        >
          {selectedArea}
          <span className="text-xs">▼</span>
        </button>

        {/* 드롭다운 예시 (선택사항) */}
        {isAreaOpen && (
          <div className="absolute top-8 left-0 z-50 w-40 rounded-lg border border-white/10 bg-[#1b1f2a] p-2 shadow-xl">
            {['평택 산업단지', '울산 산업단지', '여수 산업단지'].map((area) => (
              <div
                key={area}
                className="cursor-pointer rounded px-3 py-2 text-sm hover:bg-white/10"
                onClick={() => setIsAreaOpen(false)}
              >
                {area}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 오른쪽 - 연도 선택 */}
      <div className="flex items-center gap-3">
        <select
          value={startYear}
          onChange={(e) => onChangeStartYear?.(Number(e.target.value))}
          className="rounded-md border border-white/10 bg-[#1b1f2a] px-3 py-1 text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
        >
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={endYear}
          onChange={(e) => onChangeEndYear?.(Number(e.target.value))}
          className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-semibold text-black focus:outline-none"
        >
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

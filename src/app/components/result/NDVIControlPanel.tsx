'use client';

import NDVILegend from '@/src/app/components/result/NDVILengend';
import NDVITrendChart from '@/src/app/components/result/NDVITrendChart';
import { useState } from 'react';

interface Props {
  opacity: number;
  onChangeOpacity: (number) => void;
}
export default function NDVIControlPanel({ opacity, onChangeOpacity }: Props) {
  return (
    <div className="bg-panel flex w-full flex-col overflow-hidden shadow-lg">
      {/* SAR Transparency */}
      <div className="flex w-full flex-col gap-4 p-4">
        <h3 className="text-sm font-semibold text-gray-300">NDVI Transparency</h3>

        {/* Slider */}
        <div className="flex w-full items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            className="w-full"
            value={opacity * 100}
            onChange={(e) => onChangeOpacity(Number(e.target.value) / 100)}
          />

          <span className="w-10 text-sm font-semibold text-gray-300">
            {Math.round(opacity * 100)}%
          </span>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>More Opaque</span>
          <span>Less Opaque</span>
        </div>
      </div>

      <hr className="border-gray-600" />

      {/* trend chart */}
      <div className="flex h-[350px] w-full flex-col gap-4 p-4">
        <h3 className="text-sm font-semibold text-gray-300"> NDVI Trend Chart </h3>
        <NDVITrendChart />
      </div>

      <hr className="border-gray-600" />
      <NDVILegend />
    </div>
  );
}

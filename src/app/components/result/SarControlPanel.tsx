'use client';

import { useState } from 'react';

interface Props {
  opacity: number;
  onChangeOpacity: (number) => void;
}
export default function SarControlPanel({ opacity, onChangeOpacity }: Props) {
  return (
    <div className="bg-panel flex w-full overflow-hidden border border-gray-700 shadow-lg">
      {/* Radar Intensity */}
      <div className="flex w-1/2 flex-col gap-3 border-r border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-300">Radar Intensity</h3>

        {/* Gradient Bar */}
        <div className="relative h-6 w-full rounded-md bg-gradient-to-r from-black via-gray-700 to-white" />

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Low</span>
          <span>High</span>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>More Opaque</span>
          <span>Less Opaque</span>
        </div>
      </div>

      {/* SAR Transparency */}
      <div className="flex w-1/2 flex-col gap-4 p-4">
        <h3 className="text-sm font-semibold text-gray-300">SAR Transparency</h3>

        {/* Slider */}
        <div className="flex w-full items-center gap-3">
          <input
            className="w-full"
            type="range"
            min={0}
            max={100}
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
    </div>
  );
}

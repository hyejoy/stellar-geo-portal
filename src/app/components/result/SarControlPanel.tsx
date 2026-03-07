'use client';

import SarLegend from '@/src/app/components/result/SarLegend';
import SarYearNotice from '@/src/app/components/result/SarYearNotice';
import Transparency from '@/src/app/components/ui/Transparency';
import { useSelectedYears } from '@/src/app/store/analysisStore';

interface Props {
  opacity: number;
  onChangeOpacity: (value: number) => void;
}

export default function SarControlPanel({ opacity, onChangeOpacity }: Props) {
  const { selectedEndYear: endYear } = useSelectedYears();
  return (
    <div className="bg-panel flex w-full flex-col overflow-hidden shadow-lg">
      {/* SAR Transparency */}
      <div className="flex w-full flex-col gap-4 p-4">
        <Transparency
          title="SAR Transparency"
          opacity={opacity}
          onChangeOpacity={onChangeOpacity}
        />
      </div>

      <hr className="border-gray-600" />

      {/* 기준 연도 안내 배너 */}
      <SarYearNotice endYear={endYear} />

      <hr className="border-gray-600" />

      {/* Radar Intensity Legend */}
      <div className="flex w-full flex-col gap-3 p-4">
        {/* 범례 항목 */}
        <SarLegend />
      </div>
    </div>
  );
}

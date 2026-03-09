'use client';

import { ImageYearNotice } from '@/src/app/components/result/ImageYearNotice';
import NDVILegend from '@/src/app/components/result/NDVILengend';
import NDVITrendChart from '@/src/app/components/result/NDVITrendChart';
import Transparency from '@/src/app/components/ui/Transparency';
import { useSelectedYears } from '@/src/app/store/analysisStore';

interface Props {
  opacity: number;
  onChangeOpacity: (value: number) => void;
}

export default function NDVIControlPanel({ opacity, onChangeOpacity }: Props) {
  const { selectedStartYear: startYear, selectedEndYear: endYear } = useSelectedYears();
  return (
    <div className="bg-panel flex w-full flex-col">
      {/* SAR Transparency */}

      <div className="flex w-full flex-col gap-3 p-4">
        <Transparency
          title="NDVI Transparency"
          opacity={opacity}
          onChangeOpacity={onChangeOpacity}
        />
      </div>

      {/* 이미지 기준 연도 안내 */}
      <ImageYearNotice endYear={endYear} />

      {/* 기간 짧을 때 노란색 경고 */}
      <ShortRangeWarning startYear={startYear} endYear={endYear} />

      <hr className="border-gray-600" />

      {/* trend chart */}
      <div className="flex h-[200px] w-full flex-col gap-4 p-4">
        <h3 className="text-sm font-semibold text-gray-300"> NDVI Trend Chart </h3>
        <NDVITrendChart />
      </div>

      <hr className="border-gray-600" />
      <NDVILegend />
    </div>
  );
}

/**
 * 조회 기간이 짧을 때 (1~2년) 노란색만 뜰 수 있음을 안내하는 배너
 * - 기간이 짧으면 여름 시즌 데이터가 충분히 모이지 않아
 *   구름/대기 보정 이슈로 NDVI 0~0.15 구간(노란색)에 수렴할 수 있음
 */
function ShortRangeWarning({ startYear, endYear }: { startYear: number; endYear: number }) {
  const range = endYear - startYear;

  // 3년 이상이면 안내 불필요
  if (range >= 3) return null;

  return (
    <div className="relative mx-4 mb-4 rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-3">
      {/* 왼쪽 강조 바 */}
      <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-lg bg-gradient-to-b from-orange-400 to-orange-600" />

      <div className="flex items-start gap-3">
        <span className="mt-[1px] text-base leading-none">⚠️</span>

        <div className="flex flex-col gap-[5px]">
          <p className="text-xs font-semibold tracking-wide text-orange-300">
            {startYear} – {endYear} 단기 조회 · 이미지가 노란색으로만 표시될 수 있습니다
          </p>
          <p className="text-[11px] leading-relaxed text-gray-400">
            조회 기간이 <span className="text-gray-300">{range}년</span>으로 짧으면, 여름 시즌
            데이터가 부족하거나 구름·대기 보정 영향으로 NDVI가 낮게 계산되어{' '}
            <span className="text-orange-400/80">노란색(건조/나지) 구간에 수렴</span>할 수 있습니다.
            <br />
            <span className="text-gray-500">
              2018 – {endYear}처럼 기간을 넓히면 더 정확한 식생 분포를 확인할 수 있습니다.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

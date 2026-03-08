'use client';

import {
  useAnalysisActions,
  useAnalysisType,
  useSelectedBbox,
  useSelectedYears,
} from '@/src/app/store/analysisStore';
import { useCallback, useEffect, useState } from 'react';
// 스피너 아이콘 추가 (설치 안되어 있다면 npm i lucide-react)
import ResultMapContainer from '@/src/app/components/result/ResultMapContainer';
import { Loader2 } from 'lucide-react';

export default function ResultPage() {
  const bbox = useSelectedBbox();
  const { selectedStartYear, selectedEndYear } = useSelectedYears();
  const { analysisType } = useAnalysisType();
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const { setResultTrendChart } = useAnalysisActions();

  const fetchAnalysis = useCallback(
    async (bboxPayload: unknown) => {
      setIsLoading(true); // 로딩 시작
      setImage(null); // 이전 이미지 초기화 (새 분석 시)
      try {
        const res = await fetch('/api/analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bbox: bboxPayload,
            analysisType: analysisType,
            startYear: selectedStartYear ?? new Date().getFullYear() - 1,
            endYear: selectedEndYear ?? new Date().getFullYear(),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setImage(data.image ?? null);
          if (data.yearlyTrend) {
            setResultTrendChart(data.yearlyTrend);
          }
        }
      } catch (err) {
        console.error('Analysis fetch error:', err);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    },
    [analysisType, selectedStartYear, selectedEndYear, setResultTrendChart]
  );

  useEffect(() => {
    if (!bbox) return;
    fetchAnalysis(bbox);
  }, [analysisType, bbox, fetchAnalysis]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {/* 1. 이미지가 있고 로딩 중이 아닐 때 결과 표시 */}
      {!isLoading && <ResultMapContainer image={image} />}

      {/* 2. 로딩 중일 때 표시할 스피너 섹션 */}
      {isLoading && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="animate-pulse text-white/70">분석 이미지를 불러오는 중입니다...</p>
        </div>
      )}

      {/* 3. 데이터가 없고 로딩도 아닐 때 (초기 상태) */}
      {!isLoading && !image && (
        <div className="text-center">
          {!bbox ? (
            <p className="text-white/70">지도에서 영역을 그린 뒤 분석 페이지로 이동해 주세요.</p>
          ) : (
            <p className="text-white/70">분석 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

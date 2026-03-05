'use client';

import NdviResult from '@/src/app/components/NdviResult';
import SarResult from '@/src/app/components/SarResult';
import { useSelectedBbox, useSelectedYears, useAnalysisType } from '@/src/app/store/analysisStore';
import { useEffect, useState } from 'react';
import type { AnalysisType } from '@/src/app/store/analysisStore';
import { ArrowBigLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResultPage() {
  const bbox = useSelectedBbox();
  const { selectedStartYear, selectedEndYear } = useSelectedYears();
  const { analysisType } = useAnalysisType();
  const [image, setImage] = useState<string | null>(null);
  const [fetchedType, setFetchedType] = useState<AnalysisType | null>(null);

  useEffect(() => {
    async function loadAnalysis() {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bbox,
          analysisType,
          startYear: selectedStartYear,
          endYear: selectedEndYear,
        }),
      });

      const data = await res.json();
      setImage(data.image ?? null);
      setFetchedType(data.analysisType ?? analysisType);
    }

    if (bbox) loadAnalysis();
  }, [bbox, analysisType, selectedStartYear, selectedEndYear]);

  const type = fetchedType ?? analysisType;

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="mb-6 text-xl font-bold text-white">분석 결과</h1>
        <Link href={'/analysis'}>
          <div className="mb-6 flex items-center gap-1 text-xl font-bold text-white">
            <ArrowBigLeft /> <span>돌아가기</span>
          </div>
        </Link>
      </div>

      {image && type === 'sar' && <SarResult image={image} />}
      {image && type === 'ndvi' && <NdviResult image={image} />}
      {!image && bbox && <p className="text-white/70">분석 이미지를 불러오는 중입니다...</p>}
      {!bbox && (
        <p className="text-white/70">지도에서 영역을 그린 뒤 분석 페이지로 이동해 주세요.</p>
      )}
    </div>
  );
}

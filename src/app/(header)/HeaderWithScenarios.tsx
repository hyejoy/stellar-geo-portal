'use client';

import Header from '@/src/app/components/ui/Header';
import { useAnalysisActions, useAnalysisType } from '@/src/app/store/analysisStore';
import type { AnalysisType } from '@/src/app/store/analysisStore';
import Link from 'next/link';

type ScenarioCardProps = {
  title: string;
  purpose: string;
  choice: string;
  reasons: string[];
  analysisType: AnalysisType;
  isActive: boolean;
  onSelect: () => void;
};

function ScenarioCard({ title, purpose, choice, reasons, isActive, onSelect }: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border px-4 py-3 text-left transition focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#111827] focus:outline-none ${
        isActive
          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
          : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-white/70">
        <span className="text-white/50">목적:</span> {purpose}
      </div>
      <div className="mt-1 text-xs">
        <span className="text-white/50">선택:</span>{' '}
        <span className={isActive ? 'text-yellow-400' : 'text-white/90'}>{choice}</span>
      </div>
      <div className="mt-1 text-xs text-white/60">
        <span className="text-white/50">이유:</span> {reasons.join(' · ')}
      </div>
    </button>
  );
}

const SCENARIOS = [
  {
    id: 'sar' as const,
    title: '전략기획팀 매니저',
    purpose: '경쟁사 공장 증설 여부 확인',
    choice: 'SAR (Sentinel-1)',
    reasons: ['구름 영향 없음', '야간 촬영 가능', '건물 구조 파악'],
  },
  {
    id: 'ndvi' as const,
    title: '부지/환경 분석',
    purpose: '입지 부지 식생·황폐화·녹지 변화 모니터링',
    choice: 'NDVI (Sentinel-2)',
    reasons: ['식생/황무지 구분', '시계열 변화', 'ESG·규제 대응'],
  },
];

export default function HeaderWithScenarios() {
  const { analysisType } = useAnalysisType();
  const { changeAnalysisType } = useAnalysisActions();

  return (
    <header className="border-b border-white/10 bg-[#111827]">
      <div className="px-4 pb-3">
        <p className="mb-2 text-xs font-medium text-white/50">시나리오 연결</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <ScenarioCard
              key={s.id}
              title={s.title}
              purpose={s.purpose}
              choice={s.choice}
              reasons={s.reasons}
              analysisType={s.id}
              isActive={analysisType === s.id}
              onSelect={() => changeAnalysisType(s.id)}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

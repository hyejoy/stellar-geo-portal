'use client';

import { useAnalysisActions, useAnalysisType } from '@/src/app/store/analysisStore';
import type { AnalysisType } from '@/src/app/store/analysisStore';

// ─── 타입 ────────────────────────────────────────────────────────────────────

type ScenarioCardProps = {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  analysisType: AnalysisType;
  isActive: boolean;
  onSelect: () => void;
};

// ─── 아이콘 ──────────────────────────────────────────────────────────────────

function SARIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function NDVIIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22V12" />
      <path d="M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z" />
      <path d="M12 12C12 12 17 9 17 5" />
      <path d="M5 22h14" />
    </svg>
  );
}

// ─── 카드 ────────────────────────────────────────────────────────────────────

function ScenarioCard({
  icon,
  badge,
  title,
  description,
  tags,
  isActive,
  onSelect,
}: ScenarioCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] ${
        isActive
          ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent shadow-[0_0_0_1px_rgba(234,179,8,0.15),0_4px_24px_rgba(234,179,8,0.08)]'
          : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.06]'
      } `}
    >
      {/* active 시 왼쪽 강조선 */}
      {isActive && (
        <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-yellow-400 via-yellow-500 to-transparent" />
      )}

      <div className="px-4 py-3.5">
        {/* 상단 행: 아이콘 + 배지 + 제목 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {/* 아이콘 원 */}
            <span
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-white/[0.06] text-white/40 group-hover:text-white/60'
              }`}
            >
              {icon}
            </span>

            <div>
              {/* 배지 */}
              <span
                className={`inline-block rounded px-1.5 py-[2px] font-mono text-[10px] font-semibold tracking-wider ${
                  isActive ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/[0.06] text-white/40'
                }`}
              >
                {badge}
              </span>
              {/* 제목 */}
              <p
                className={`mt-0.5 text-[13px] leading-tight font-semibold transition-colors ${
                  isActive ? 'text-yellow-100' : 'text-white/70 group-hover:text-white/90'
                }`}
              >
                {title}
              </p>
            </div>
          </div>

          {/* 선택 인디케이터 */}
          <span
            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
              isActive
                ? 'border-yellow-400 bg-yellow-400'
                : 'border-white/20 group-hover:border-white/30'
            }`}
          >
            {isActive && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M1.5 4L3.2 5.7L6.5 2.3"
                  stroke="#0d1117"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </div>

        {/* 설명 */}
        <p className="mt-2.5 text-[11.5px] leading-relaxed text-white/45">{description}</p>

        {/* 태그 */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-md px-2 py-[3px] text-[10px] font-medium transition-colors ${
                isActive
                  ? 'bg-yellow-500/10 text-yellow-400/80'
                  : 'bg-white/[0.05] text-white/35 group-hover:text-white/50'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

// ─── 데이터 ──────────────────────────────────────────────────────────────────

const SCENARIOS: {
  id: AnalysisType;
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  tags: string[];
}[] = [
  {
    id: 'sar',
    icon: <SARIcon />,
    badge: 'Sentinel-1 · SAR',
    title: '시설 / 구조물 모니터링',
    description:
      '구름·야간 제약 없이 지표 구조물 변화를 탐지합니다. 공장 증설, 부지 개발, 인프라 변동 파악에 적합합니다.',
    tags: ['구름 무관', '야간 촬영', '구조물 탐지', '레이더파'],
  },
  {
    id: 'ndvi',
    icon: <NDVIIcon />,
    badge: 'Sentinel-2 · NDVI',
    title: '식생 / 환경 변화 분석',
    description:
      '식생 밀도·황폐화·녹지 변화를 시계열로 추적합니다. 입지 환경 평가, ESG 리포트, 규제 대응에 활용됩니다.',
    tags: ['식생 지수', '시계열 추이', 'ESG 대응', '농경지'],
  },
];

// ─── 메인 ────────────────────────────────────────────────────────────────────

export default function HeaderWithScenarios() {
  const { analysisType } = useAnalysisType();
  const { changeAnalysisType } = useAnalysisActions();

  return (
    <header className="border-b border-white/[0.07] bg-[#0d1117]">
      <div className="px-4 pt-3 pb-4">
        {/* 섹션 레이블 */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-[1px] w-3 bg-white/20" />
          <span className="text-[10px] font-semibold tracking-[0.12em] text-white/35 uppercase">
            분석 모드 선택
          </span>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <ScenarioCard
              key={s.id}
              icon={s.icon}
              badge={s.badge}
              title={s.title}
              description={s.description}
              tags={s.tags}
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

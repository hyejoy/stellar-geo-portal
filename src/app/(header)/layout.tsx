'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import HeaderWithScenarios from '@/src/app/(header)/HeaderWithScenarios';
import BottomPanel from '@/src/app/(header)/analysis/BottomPanel';

export default function HeaderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isResultPage = pathname.includes('/analysis/result');

  return (
    // Header.tsx 높이 58px 기준
    <main className="flex h-[calc(100dvh-58px)] flex-col overflow-hidden bg-[#0d1117]">
      {/* 시나리오 선택 헤더 — full width, 패딩 없음 */}
      <HeaderWithScenarios />

      {/* 콘텐츠 영역 — 남은 공간 전부 차지 */}
      <section
        className={`relative min-h-0 flex-1 ${
          isResultPage ? 'no-scrollbar overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        {children}

        {/* BottomPanel은 section 안에서 absolute로 지도 위에 float */}
        <BottomPanel />
      </section>
    </main>
  );
}

'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSelectedBbox } from '@/src/app/store/analysisStore';
import HeaderWithScenarios from '@/src/app/(header)/HeaderWithScenarios';
import BottomPanel from '@/src/app/(header)/analysis/BottomPanel';

export default function HeaderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isResultPage = pathname.includes('/analysis/result');
  const bbox = useSelectedBbox();

  return (
    <main className="relative flex h-[calc(100dvh-64px)] flex-col overflow-hidden bg-[#111827] p-4">
      <HeaderWithScenarios />

      <section
        className={`relative min-h-0 flex-1 ${
          isResultPage ? 'no-scrollbar overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        {children}
      </section>

      <BottomPanel />
    </main>
  );
}

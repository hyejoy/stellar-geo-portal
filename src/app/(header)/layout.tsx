'use client';

import HeaderWithScenarios from '@/src/app/(header)/HeaderWithScenarios';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function HeaderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isResultPage = pathname.includes('/analysis/result');

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#111827]">
      <HeaderWithScenarios />

      <main
        className={`relative flex-1 ${
          isResultPage ? 'no-scrollbar overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

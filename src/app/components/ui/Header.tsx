'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isDetailPage = pathname !== '/analysis';

  return (
    <header className="relative flex h-[58px] items-center justify-between border-b border-white/[0.07] bg-[#0d1117] px-5">
      {/* 하단 미세 그라디언트 줄 — 깊이감 */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

      {/* 왼쪽: 로고 + 제품명 */}
      <Link
        href="/analysis"
        className="group flex items-center gap-2.5 rounded-md px-1 py-1 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]"
      >
        <Image src="/logo/stellar.png" alt="Stellar Geo Portal logo" width={70} height={50} />

        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-bold tracking-[0.06em] text-white">STELLAR</span>
          <span className="text-[9px] font-medium tracking-[0.18em] text-white/35 uppercase">
            Geo Portal
          </span>
        </div>
      </Link>

      {/* 가운데: 상태 배지 (위성 데이터 제품임을 상시 표시) */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
        <span className="text-[10px] font-medium tracking-widest text-white/30 uppercase">
          Live Satellite Feed
        </span>
      </div>

      {/* 오른쪽: 액션 */}
      <div className="flex items-center gap-2">
        {isDetailPage ? (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/60 transition-all hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <ArrowLeft size={13} />
            <span>뒤로</span>
          </button>
        ) : (
          /* 분석 메인 페이지일 때: 빌드 버전 등 작은 메타 정보 */
          <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white/20">
            v2.0
          </span>
        )}
      </div>
    </header>
  );
}

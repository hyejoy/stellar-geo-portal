'use client';

import { useRouter } from 'next/navigation';
import { useAreaPrice, useLandArea, useSelectedBbox } from '@/src/app/store/analysisStore';
import { useIsModalOpen, useOpenDialog } from '@/src/app/store/modalStore';

export default function BottomBar() {
  const router = useRouter();
  const openModal = useOpenDialog();
  const bbox = useSelectedBbox();
  const landArea = useLandArea();
  const price = useAreaPrice();

  return (
    <div className="absolute bottom-50 left-1/2 z-[1100] w-[90%] max-w-2xl -translate-x-1/2 rounded-xl border border-white/10 bg-[#1b1f2a] p-4 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/90">
          <span>선택 지역</span>
          <span className="font-semibold text-amber-400">{landArea} km²</span>
          <span className="text-white/40">|</span>
          <span>예상 가격</span>
          <span className="font-semibold text-amber-400">₩ {price}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <button
            type="button"
            onClick={() => router.push('/analysis/result')}
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            분석 결과 보기
          </button> */}
          <button
            type="button"
            onClick={openModal}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400"
          >
            분석 요청
          </button>
        </div>
      </div>
    </div>
  );
}

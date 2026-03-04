'use client';

import { useAreaPrice, useLandArea, useSelectedArea } from '@/src/app/store/analysisStore';
import { useCloseDialog, useIsModalOpen } from '@/src/app/store/modalStore';

export default function OrderModal() {
  /** analysis zustand */
  const selectedArea = useSelectedArea();
  const ladnArea = useLandArea();
  const price = useAreaPrice();
  /** modal zustand */
  const isOpen = useIsModalOpen();
  const onClose = useCloseDialog();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* 배경 블러 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* 모달 */}
      <div className="relative z-10 w-[520px] rounded-xl border border-white/10 bg-[#1B1F2A] text-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">🛒 주문 확인</div>
          <button onClick={onClose} className="cursor-pointer text-white/60 hover:text-white">
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-white/70">
            선택한 영역에 대한 분석 데이터를 주문하시겠습니까?
          </p>

          <div className="space-y-2 rounded-lg bg-white/5 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">선택 지역</span>
              <span>{selectedArea}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">면적</span>
              <span>{ladnArea} km²</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white/60">예상 가격</span>
              <span className="font-semibold text-yellow-400">₩ {price}</span>
            </div>

            <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold">
              <span>총 결제 금액</span>
              <span className="text-yellow-400">₩ {price}</span>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button onClick={onClose} className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20">
            취소
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-600"
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}

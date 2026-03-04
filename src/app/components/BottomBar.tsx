'use client';

import { useIsModalOpen, useOpenDialog } from '@/src/app/store/modalStore';
import { useAreaPrice, useLandArea, useSelectedBbox } from '../store/analysisStore';

export default function BottomBar() {
  const isModalOpen = useIsModalOpen();
  const openModal = useOpenDialog();
  const bbox = useSelectedBbox();
  const landArea = useLandArea();
  const price = useAreaPrice();

  return (
    <div className="absolute bottom-23 left-1/2 z-[1000] w-1/2 -translate-x-1/2 rounded-xl border border-neutral-700 bg-neutral-900 p-5 shadow-2xl">
      {/* 내용물도 가운데 정렬하고 싶다면 text-center 추가 */}
      <div className="flex justify-between">
        <div className="flex items-center">
          <p>선택한 지역: </p> <span className="font-bold text-amber-300">{landArea}km²</span>
          <span className="px-3">|</span>
          <p>예상 가격: </p> <span className="font-bold text-amber-300">{price}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={openModal}
            className="cursor-pointer rounded-b-sm bg-amber-400 px-4 py-2 font-bold text-gray-700"
          >
            분석 요청
          </button>
        </div>
      </div>
    </div>
  );
}

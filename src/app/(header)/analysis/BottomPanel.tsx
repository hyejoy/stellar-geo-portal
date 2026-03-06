import { useAreaPrice, useLandArea, useSelectedBbox } from '@/src/app/store/analysisStore';
import { useOpenDialog } from '@/src/app/store/modalStore';

export default function BottomPanel() {
  const openModal = useOpenDialog();
  const landArea = useLandArea();
  const price = useAreaPrice();
  const bbox = useSelectedBbox();
  return (
    <div className="absolute right-1 bottom-4 left-[445px] z-[1000] mr-2.5 flex h-20 items-center justify-between border-white/10 bg-[#1b1f2a] p-5 px-6 shadow-2xl">
      <div className="flex gap-2.5">
        <div className="flex gap-1.5">
          <span>선택 지역</span>
          <span className="font-semibold text-amber-400">{landArea} km²</span>
          <span className="text-white/40">|</span>
          <span>예상 가격</span>
          <span className="font-semibold text-amber-400">{!price ? '0원' : price}</span>
        </div>
      </div>
      {bbox && (
        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400"
        >
          분석 요청
        </button>
      )}
    </div>
  );
}

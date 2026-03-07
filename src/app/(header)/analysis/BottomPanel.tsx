import { useAreaPrice, useLandArea, useSelectedBbox } from '@/src/app/store/analysisStore';
import { useOpenDialog } from '@/src/app/store/modalStore';

export default function BottomPanel() {
  const openModal = useOpenDialog();
  const landArea = useLandArea();
  const price = useAreaPrice();
  const bbox = useSelectedBbox();

  return (
    <div
      className="absolute right-4 bottom-4 z-[1000] flex items-center justify-between gap-6 rounded-xl border border-white/[0.08] bg-[#0d1117]/90 px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
      style={{ left: 'calc(430px + 1rem)' }}
    >
      {/* 선택 면적 + 예상 가격 — bbox 없어도 항상 표시 */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium tracking-widest text-white/30 uppercase">
            선택 면적
          </span>
          <span className="text-sm font-semibold text-amber-400">{landArea ?? '—'} km²</span>
        </div>

        <div className="h-8 w-[1px] bg-white/[0.08]" />

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium tracking-widest text-white/30 uppercase">
            예상 가격
          </span>
          <span className="text-sm font-semibold text-amber-400">{!price ? '0원' : price}</span>
        </div>
      </div>

      {/* 분석 요청 버튼 — bbox 지정 후에만 표시 */}
      {bbox && (
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-bold text-black transition-all hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] active:scale-95"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          분석 요청
        </button>
      )}
    </div>
  );
}

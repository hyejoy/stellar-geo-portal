export default function SarYearNotice({ endYear }: { endYear: number }) {
  const now = new Date();
  const curYear = now.getFullYear();
  const isCurrentYear = endYear >= curYear;

  return (
    <div className="relative mx-4 my-1 overflow-hidden rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
      {/* 왼쪽 강조 바 */}
      <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-lg bg-gradient-to-b from-blue-400 to-blue-600" />

      <div className="flex items-start gap-3">
        <span className="mt-[1px] text-base leading-none text-blue-400">📡</span>

        <div className="flex flex-col gap-[5px]">
          <p className="text-xs font-semibold tracking-wide text-blue-300">
            {endYear}년 기준 레이더 데이터
          </p>
          <p className="text-[11px] leading-relaxed text-gray-400">
            SAR 이미지는 구름·야간에 관계없이 촬영됩니다.{' '}
            <span className="text-gray-300">{endYear}년 전체</span> 데이터를 사용합니다.
            {isCurrentYear && (
              <span className="text-blue-400/80">
                올해 데이터는 현재까지의 최신 촬영본을 반영합니다.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

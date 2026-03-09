/** -------------------------------------------------------
 * 이미지 기준 연도 안내 배너
 * - endYear가 현재 연도이고 아직 여름(6월) 전이면
 *   "작년 여름 기준" 임을 명시해 사용자 혼란 방지
 * ------------------------------------------------------- */
/** endYear가 현재 연도이고 아직 여름(6월) 전이면 직전 연도를 반환 */
function resolveImageYear(endYear: number): number {
  const now = new Date();
  const curYear = now.getFullYear();
  const summerStarted = now.getMonth() + 1 >= 6;
  return endYear >= curYear && !summerStarted ? curYear - 1 : endYear;
}

export function ImageYearNotice({ endYear }: { endYear: number }) {
  const imageYear = resolveImageYear(endYear);
  const isFallback = imageYear !== endYear;

  return (
    <div className="relative mx-4 mb-2.5 overflow-hidden rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-4">
      {/* 왼쪽 강조 바 */}
      <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-lg bg-gradient-to-b from-yellow-400 to-yellow-600" />

      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <span className="mt-[1px] text-base leading-none text-yellow-400">🛰</span>

        <div className="flex flex-col gap-[5px]">
          <p className="text-xs font-semibold tracking-wide text-yellow-300">
            {imageYear}년 여름 기준 식생 정보
          </p>
          <p className="text-[11px] leading-relaxed text-gray-400">
            위성 이미지는 식생이 가장 활발한 <span className="text-gray-300">6 – 9월</span> 데이터를
            사용합니다.
            {isFallback && (
              <>
                {' '}
                <span className="text-yellow-400/80">
                  {endYear}년은 아직 여름 데이터가 없어 {imageYear}년 여름을 표시합니다.
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

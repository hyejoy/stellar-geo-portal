export default function BottomBar() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 rounded-xl bg-neutral-900 p-5 shadow-2xl border border-neutral-700 z-[1000]">
      {/* 내용물도 가운데 정렬하고 싶다면 text-center 추가 */}
      <div className="flex justify-between">
        <div className="flex  items-center">
          <p>Select Area: </p>{" "}
          <span className="text-amber-300 font-bold">42.5km2</span>
          <span className="px-3">|</span>
          <p>Estimated Price: </p>{" "}
          <span className="text-amber-300 font-bold">$450</span>
        </div>
        <div className="flex items-center">
          <button className="bg-amber-400 text-gray-700 font-bold rounded-b-sm px-4 py-2">
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}

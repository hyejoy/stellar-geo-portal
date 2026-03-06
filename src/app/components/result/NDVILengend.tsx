export default function NDVILegend() {
  return (
    <div className="bg-panel rounded-xl p-4 text-white shadow-lg backdrop-blur-md">
      <div className="mb-3 text-sm font-semibold text-gray-200">NDVI 지수 변화</div>

      {/* gradient bar */}
      <div className="h-4 w-full rounded-md bg-gradient-to-r from-red-500 via-yellow-300 to-green-500" />

      {/* labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-300">
        <span>-0.2 (불량)</span>
        <span>+0.2</span>
        <span>+0.6 (밀생)</span>
      </div>
    </div>
  );
}

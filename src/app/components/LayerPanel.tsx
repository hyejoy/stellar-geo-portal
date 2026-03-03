export default function LayerPanel() {
  return (
    <div className="absolute top-4 left-4 w-72 rounded-xl bg-neutral-900 p-5 shadow-2xl border border-neutral-700 z-[1000]">
      <h2 className="text-lg font-semibold text-white mb-4">
        Layer Controller
      </h2>

      <div className="mb-6">
        <p className="text-xs text-neutral-400 mb-2">Optical (EO)</p>
        {/* Radio Items */}
      </div>

      <div className="mb-6">
        <p className="text-xs text-neutral-400 mb-2">Radar (SAR)</p>
      </div>

      <div>
        <p className="text-xs text-neutral-400 mb-2">AI Analysis</p>
      </div>
    </div>
  );
}

export default function RadioItem({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="radio" name="layer" className="hidden peer" />
      <div className="w-4 h-4 rounded-full border border-neutral-500 peer-checked:border-amber-400 peer-checked:bg-amber-400 transition" />
      <span className="text-sm text-neutral-300 group-hover:text-white">
        {label}
      </span>
    </label>
  );
}

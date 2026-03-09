export default function CheckboxItem({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" className="hidden peer" />
      <div className="w-4 h-4 rounded border border-neutral-500 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition" />
      <span className="text-sm text-neutral-300 group-hover:text-white">
        {label}
      </span>
    </label>
  );
}

export default function Section({ title, children }) {
  return (
    <div className="mb-6">
      <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wide">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

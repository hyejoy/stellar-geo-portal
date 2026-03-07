interface Props {
  title: string;
  opacity: number;
  onChangeOpacity: (number: number) => void;
}

export default function Transparency({ title, opacity, onChangeOpacity }: Props) {
  return (
    <>
      <h3 className="text-sm font-semibold text-gray-300">{title}</h3>

      {/* Slider */}
      <div className="flex w-full items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          className="w-full"
          value={opacity * 100}
          onChange={(e) => onChangeOpacity(Number(e.target.value) / 100)}
        />
        <span className="w-10 text-sm font-semibold text-gray-300">
          {Math.round(opacity * 100)}%
        </span>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>More Opaque</span>
        <span>Less Opaque</span>
      </div>
    </>
  );
}

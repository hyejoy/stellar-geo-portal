const LEGEND_ITEMS = [
  {
    color: 'rgb(26, 51, 179)', // [0.1, 0.2, 0.7]
    range: '< 0',
    label: '물 / 바다',
  },
  {
    color: 'rgb(179, 153, 51)', // [0.7, 0.6, 0.2]
    range: '0 – 0.15',
    label: '건물 / 도로 / 나지',
  },
  {
    color: 'rgb(153, 204, 77)', // [0.6, 0.8, 0.3]
    range: '0.15 – 0.3',
    label: '희박한 식생',
  },
  {
    color: 'rgb(51, 179, 51)', // [0.2, 0.7, 0.2]
    range: '0.3 – 0.5',
    label: '중간 식생',
  },
  {
    color: 'rgb(0, 115, 26)', // [0.0, 0.45, 0.1]
    range: '> 0.5',
    label: '울창한 식생 / 숲',
  },
];

export default function NDVILegend() {
  return (
    <div className="bg-panel p-4 text-white">
      <p className="mb-3 text-sm font-semibold text-gray-200">NDVI 범례</p>

      {/* 그라디언트 바 — evalscript 색상 5구간 그대로 */}
      <div
        className="h-3 w-full rounded-md"
        style={{
          background:
            'linear-gradient(to right, rgb(26,51,179), rgb(179,153,51), rgb(153,204,77), rgb(51,179,51), rgb(0,115,26))',
        }}
      />

      {/* 구간 레이블 */}
      <div className="mt-1 flex justify-between text-[10px] text-gray-500">
        <span>{'< 0'}</span>
        <span>0.15</span>
        <span>0.3</span>
        <span>0.5</span>
        <span>{'> 0.5'}</span>
      </div>

      {/* 항목 목록 */}
      <ul className="mt-3 flex flex-col gap-[6px]">
        {LEGEND_ITEMS.map((item) => (
          <li key={item.range} className="flex items-center gap-2">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[11px] text-gray-400">
              <span className="font-mono text-gray-300">{item.range}</span>
              {'  '}
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

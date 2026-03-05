'use client';

interface SarResultProps {
  image: string;
}

export default function SarResult({ image }: SarResultProps) {
  return (
    <div className="flex h-full flex-col space-y-4 bg-green-500">
      <h2 className="text-lg font-semibold text-white">SAR (레이더 영상)</h2>
      <p className="text-sm text-white/70">
        SAR(Synthetic Aperture Radar) VV 밴드입니다. 밝은 영역은 금속·건물 등 반사가 큰 지물, 어두운
        영역은 물·평지 등입니다. 건물 변화·침수 분석에 활용할 수 있습니다.
      </p>

      <div className="flex-1 overflow-auto rounded-lg border border-white/10">
        <img
          src={`data:image/png;base64,${image}`}
          alt="SAR"
          className="h-[480px] w-full object-contain"
        />
      </div>
    </div>
  );
}

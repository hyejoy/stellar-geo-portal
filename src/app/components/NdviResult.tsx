'use client';

interface NdviResultProps {
  image: string;
}

export default function NdviResult({ image }: NdviResultProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">NDVI (식생 분석)</h2>
      <p className="text-sm text-white/70">
        식생지수(Normalized Difference Vegetation Index)로 초록색이 진할수록 식생이 활발하고,
        갈색·노란색일수록 건조하거나 식생이 적은 영역입니다.
      </p>
      <div className="overflow-hidden rounded-lg border border-white/10">
        <img
          src={`data:image/png;base64,${image}`}
          alt="NDVI"
          className="max-h-[480px] w-full object-contain"
        />
      </div>
    </div>
  );
}

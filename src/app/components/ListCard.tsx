'use client';
import {
  useAnalysisActions,
  useAnalysisType,
  useSelectedYears,
} from '@/src/app/store/analysisStore';
import { AreaKey } from '@/src/types/area';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function ListCard({
  keyName,
  title,
  description,
  lastUpdate,
  checked,
}: {
  keyName: AreaKey;
  title: string;
  description: string;
  lastUpdate: Date;
  checked: boolean;
}) {
  const { changeArea, changeBbox } = useAnalysisActions();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { selectedStartYear, selectedEndYear } = useSelectedYears();
  const analysisInfo = useAnalysisType();

  const handleCardClick = () => {
    changeArea(keyName);
    changeBbox(null);
  };

  useEffect(() => {
    if (checked && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [checked]);

  return (
    <div
      ref={cardRef}
      className={clsx(
        'flex cursor-pointer rounded-2xl p-4',
        checked
          ? 'border border-amber-400/60 bg-amber-500/[0.07]'
          : 'border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
      )}
      onClick={handleCardClick}
    >
      <div className="grid grid-cols-1">
        <div className="relative h-22.5 w-15 overflow-hidden rounded-2xl">
          <Image
            alt={keyName}
            src={`/industrialComplex/${keyName}.png`}
            fill
            className="object-center"
          />
        </div>
      </div>

      <div className="ml-2 flex-1 rounded-md bg-white/[0.04] p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <p className={clsx('text-xl font-bold', checked ? 'text-amber-300' : 'text-white/80')}>
              {title}
            </p>
            {checked && <Check className="text-amber-400" />}
          </div>

          {/* 기간 배지 */}
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] leading-relaxed text-white/40">{description}</p>
            {analysisInfo.analysisType !== 'sar' && (
              <>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/20">
                  <path
                    d="M1 4h10M8 1l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-mono text-[11px] text-white/40">{selectedStartYear}</span>
              </>
            )}
            <span className="font-mono text-[11px] font-semibold text-amber-400/80">
              {selectedEndYear}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

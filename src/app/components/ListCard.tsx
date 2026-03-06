'use client';
import { useAnalysisActions } from '@/src/app/store/analysisStore';
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
        checked && 'border border-amber-400 bg-gray-700'
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

      <div className="ml-2 flex-1 rounded-md bg-gray-500 p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <p className="text-xl font-bold">{title}</p>
            {checked && <Check className="text-amber-400" />}
          </div>

          <div className="flex gap-1.5">
            {description}
            <p>{'2025-10-20'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useState } from 'react';
import clsx from 'clsx';
import { useSelectedBbox } from '@/src/app/store/analysisStore';

interface Props {
  featureGroupRef: React.RefObject<L.FeatureGroup>;
  onChangeBbox: () => void;
}
type DrawMode = 'rectangle' | 'polygon' | null;

export default function CustomDrawToolbar({ featureGroupRef, onChangeBbox }: Props) {
  const [mode, setMode] = useState<DrawMode>(null);
  const bbox = useSelectedBbox();

  const map = useMap();

  const enableRectangle = () => {
    clearLayers();
    setMode('rectangle');
    const draw = new (L as any).Draw.Rectangle(map);
    draw.enable();
  };

  const enablePolygon = () => {
    clearLayers();
    setMode('polygon');
    const draw = new (L as any).Draw.Polygon(map);
    draw.enable();
  };

  const clearLayers = () => {
    setMode(null);
    onChangeBbox();
    featureGroupRef.current?.clearLayers();
  };

  const baseBtn = 'w-10 h-10 flex items-center justify-center rounded-lg transition';

  return (
    <div className="absolute top-15 left-1/2 z-[1000] flex w-auto -translate-x-1/2 gap-2 rounded-xl border border-neutral-700 bg-neutral-900/90 p-2 shadow-lg backdrop-blur-md">
      {/* Rectangle */}

      {/* Rectangle */}
      <button
        onClick={enableRectangle}
        className={clsx(
          baseBtn,
          mode === 'rectangle' && bbox
            ? 'bg-amber-500 text-black'
            : 'bg-neutral-800 hover:bg-amber-500 hover:text-black'
        )}
        title="Rectangle"
      >
        □
      </button>

      {/* Polygon */}
      <button
        onClick={enablePolygon}
        className={clsx(
          baseBtn,
          mode === 'polygon' && bbox
            ? 'bg-amber-500 text-black'
            : 'bg-neutral-800 hover:bg-amber-500 hover:text-black'
        )}
        title="Polygon"
      >
        ⬟
      </button>

      {/* Clear */}
      <button
        onClick={clearLayers}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 transition hover:bg-red-500 hover:text-white"
        title="Clear"
      >
        ✕
      </button>
    </div>
  );
}

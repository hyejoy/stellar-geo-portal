'use client';

import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { useState } from 'react';
import clsx from 'clsx';
import { useAnalysisActions, useSelectedBbox } from '@/src/app/store/analysisStore';

interface Props {
  featureGroupRef: React.RefObject<L.FeatureGroup>;
  onChangeBbox: () => void;
}
type DrawMode = 'rectangle' | 'polygon' | null;

export default function CustomDrawToolbar({ featureGroupRef, onChangeBbox }: Props) {
  const [mode, setMode] = useState<DrawMode>(null);
  const { resetLandAreaAndPrice } = useAnalysisActions();
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
    resetLandAreaAndPrice();
    onChangeBbox();
    featureGroupRef.current?.clearLayers();
  };

  return (
    <div className="absolute top-25 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0d1117]/90 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
      {/* Rectangle */}
      <ToolButton
        onClick={enableRectangle}
        isActive={mode === 'rectangle' && !!bbox}
        title="사각형 선택"
      >
        <RectIcon />
      </ToolButton>

      {/* Polygon */}
      <ToolButton
        onClick={enablePolygon}
        isActive={mode === 'polygon' && !!bbox}
        title="다각형 선택"
      >
        <PolyIcon />
      </ToolButton>

      {/* 구분선 */}
      <div className="mx-0.5 h-5 w-[1px] bg-white/[0.08]" />

      {/* Clear */}
      <button
        onClick={clearLayers}
        title="초기화"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-red-500/15 hover:text-red-400 focus:outline-none"
      >
        <ClearIcon />
      </button>
    </div>
  );
}

// ─── 공통 툴 버튼 ─────────────────────────────────────────────────────────────

function ToolButton({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded-lg transition focus:outline-none',
        isActive
          ? 'bg-yellow-500 text-black shadow-sm'
          : 'text-white/40 hover:bg-white/[0.06] hover:text-yellow-400'
      )}
    >
      {children}
    </button>
  );
}

// ─── 아이콘 SVG ───────────────────────────────────────────────────────────────

function RectIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="11" height="11" rx="1.5" />
    </svg>
  );
}

function PolyIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="7.5,1.5 13.5,5.5 11.5,13 3.5,13 1.5,5.5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M2 2l9 9M11 2l-9 9" />
    </svg>
  );
}

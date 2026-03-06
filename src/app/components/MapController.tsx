'use client';

import { useSelectedPosition } from '@/src/app/store/analysisStore';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapController() {
  const map = useMap();
  const position = useSelectedPosition(); // 스토어의 포지션 구독

  useEffect(() => {
    if (position) {
      // 지도를 해당 좌표로 부드럽게 이동시킵니다.
      map.flyTo(position, 14, {
        duration: 1.5, // 이동 속도 조절
      });
    }
  }, [position, map]);

  return null;
}

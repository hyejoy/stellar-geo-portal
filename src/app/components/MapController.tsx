'use client';

import { useSelectedPosition } from '@/src/app/store/analysisStore';
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export default React.memo(function MapController() {
  const map = useMap();
  const position = useSelectedPosition();
  // 최초 position값만 저장, 이후 null로 교체 → 이후엔 항상 flyTo 실행
  const initialPosition = useRef<[number, number] | null>(position);

  useEffect(() => {
    if (
      initialPosition.current &&
      position[0] === initialPosition.current[0] &&
      position[1] === initialPosition.current[1]
    ) {
      initialPosition.current = null; // 초기값 소진 → 다음부터 무조건 flyTo
      return;
    }

    map.flyTo(position, 14, { duration: 1.5 });
  }, [position, map]);

  return null;
});

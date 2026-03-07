'use client';

import { polygonToBounds } from '@/src/utils/polygonToBounds';
import { ImageOverlay } from 'react-leaflet';

export default function ResultOverlay({ image, bbox, opacity }) {
  let bounds;

  if (Array.isArray(bbox)) {
    bounds = polygonToBounds(bbox);
  } else {
    bounds = [
      [bbox.south, bbox.west],
      [bbox.north, bbox.east],
    ];
  }

  return (
    <ImageOverlay
      url={`data:image/png;base64,${image}`}
      bounds={bounds}
      opacity={opacity}
      className="z-10000"
    />
  );
}

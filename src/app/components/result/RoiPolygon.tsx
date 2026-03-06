'use client';

import { Polygon } from 'react-leaflet';

export default function RoiPolygon() {
  const coordinates: [number, number][] = [
    [37.55, 126.95],
    [37.56, 126.99],
    [37.53, 127.02],
    [37.52, 126.97],
  ];

  return (
    <Polygon
      positions={coordinates}
      pathOptions={{
        color: '#00E5FF',
        weight: 2,
        fillOpacity: 0,
      }}
    />
  );
}

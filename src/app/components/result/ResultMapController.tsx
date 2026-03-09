'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSelectedBbox } from '@/src/app/store/analysisStore';
import { Bbox, PolygonBbox } from '@/src/types/leafletDraw';

export default function ResultMapController() {
  const map = useMap();
  const bbox = useSelectedBbox();
  const hasMoved = useRef(false);

  useEffect(() => {
    if (!bbox || hasMoved.current) return;

    let bounds;

    if (Array.isArray(bbox)) {
      bounds = L.latLngBounds(bbox.map((p) => [p.lat, p.lng]));
    } else {
      bounds = L.latLngBounds([bbox.south, bbox.west], [bbox.north, bbox.east]);
    }

    map.fitBounds(bounds, { maxZoom: 14 });

    hasMoved.current = true;
  }, [bbox, map]);

  return null;
}

'use client';

import NDVIControlPanel from '@/src/app/components/result/NDVIControlPanel';
import ResultMapController from '@/src/app/components/result/ResultMapController';
import ResultOverlay from '@/src/app/components/result/ResultOverlay';
import TopLayer from '@/src/app/components/TopLayer';
import osm from '@/src/app/leaftlet/osmProvider';
import { useSelectedBbox, useSelectedPosition } from '@/src/app/store/analysisStore';
import L from 'leaflet';
import { useRef, useState } from 'react';
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet';

export default function NDVIResult({ image }) {
  const [opacity, setOpacity] = useState(0.7);
  const bbox = useSelectedBbox();
  const position = useSelectedPosition();

  const handleOpacity = (value: number) => {
    setOpacity(value);
  };

  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const ZOOM_LEVEL = 14;

  return (
    <div className="relative flex h-full w-full">
      <div className="h-full flex-1">
        <MapContainer
          className="h-full w-full"
          center={position}
          zoom={ZOOM_LEVEL}
          zoomControl={false}
          scrollWheelZoom={true}
        >
          <ResultMapController />

          <TileLayer url={osm.loadtier.url} />

          <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} opacity={0.6} />

          {image && bbox && <ResultOverlay image={image} bbox={bbox} opacity={opacity} />}

          <FeatureGroup ref={featureGroupRef}>
            <TopLayer />
          </FeatureGroup>
        </MapContainer>
      </div>

      <div className="bg-panel w-[380px]">
        <NDVIControlPanel opacity={opacity} onChangeOpacity={handleOpacity} />
      </div>

      {/* bottom panel */}
      {/* <div className="pointer-events-none absolute bottom-0 z-[1000] w-full">
        <div className="pointer-events-auto mx-auto">
          <NDVIControlPanel opacity={opacity} onChangeOpacity={handleOpacity} />
        </div>
      </div> */}
    </div>
  );
}

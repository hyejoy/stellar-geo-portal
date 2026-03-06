'use client';

import ResultMapController from '@/src/app/components/result/ResultMapController';
import ResultOverlay from '@/src/app/components/result/ResultOverlay';
import SarControlPanel from '@/src/app/components/result/SarControlPanel';
import TopLayer from '@/src/app/components/TopLayer';
import osm from '@/src/app/leaftlet/osmProvider';
import { useSelectedBbox, useSelectedPosition } from '@/src/app/store/analysisStore';
import L from 'leaflet';
import { useRef, useState } from 'react';
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet';

export default function SarResult({ image }) {
  const [opacity, setOpacity] = useState(0.7);
  const bbox = useSelectedBbox();
  const position = useSelectedPosition();

  const handleOpacity = (number: number) => {
    setOpacity(number);
  };

  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const ZOOM_LEVEL = 12;

  return (
    <div className="relative h-full w-full">
      <div className="h-full">
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
          {/* <SarOpacityControl opacity={opacity} setOpacity={setOpacity} /> */}
          <FeatureGroup ref={featureGroupRef}>
            <TopLayer />
          </FeatureGroup>
        </MapContainer>
        {/* <AnalysisPanel /> */}
      </div>
      <div className="pointer-events-none absolute bottom-0 z-[1000] w-full">
        <div className="pointer-events-auto mx-auto">
          <SarControlPanel opacity={opacity} onChangeOpacity={handleOpacity} />
        </div>
      </div>
    </div>
  );
}

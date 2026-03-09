'use client';

import NDVIControlPanel from '@/src/app/components/result/NDVIControlPanel';
import ResultMapController from '@/src/app/components/result/ResultMapController';
import ResultOverlay from '@/src/app/components/result/ResultOverlay';
import SarControlPanel from '@/src/app/components/result/SarControlPanel';
import osm from '@/src/app/leaftlet/osmProvider';
import {
  useAnalysisType,
  useSelectedBbox,
  useSelectedPosition,
} from '@/src/app/store/analysisStore';
import L from 'leaflet';
import { useRef, useState } from 'react';
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet';

export default function ResultMapContainer({ image }) {
  const [opacity, setOpacity] = useState(0.7);
  const bbox = useSelectedBbox();
  const position = useSelectedPosition();
  const { analysisType } = useAnalysisType();

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

          <FeatureGroup ref={featureGroupRef}></FeatureGroup>
        </MapContainer>
      </div>

      <div className="bg-panel scrollbar-thin w-[380px] overflow-y-auto">
        <div className="bg-panel flex w-full flex-col">
          {/* SAR Transparency */}
          <div className="flex w-full flex-col gap-4 p-4">
            <h3 className="text-sm font-semibold text-gray-300">
              {analysisType === 'sar' && (
                <SarControlPanel opacity={opacity} onChangeOpacity={handleOpacity} />
              )}
              {analysisType === 'ndvi' && (
                <NDVIControlPanel opacity={opacity} onChangeOpacity={handleOpacity} />
              )}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

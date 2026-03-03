"use client";
import osm from "@/src/app/leaftlet/osmProvider";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useState } from "react";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
// leaflet-draw css
import AnalysisPanel from "@/src/app/components/AnalysisPanel";
import BottomBar from "@/src/app/components/BottomBar";
import CustomDrawToolbar from "@/src/app/components/CustomDrawToolbar";
import LayerPanel from "@/src/app/components/LayerPanel";
import { Bbox, DrawOptions } from "@/src/types/leafletDraw";
import { DrawEvents } from "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";

const drawOptions: DrawOptions = {
  rectangle: false,
  circle: false,
  circlemarker: false,
  marker: false,
  polyline: false,
  polygon: false,
};

export default function BasicMap() {
  const position: [number, number] = [37.554648, 126.972559];
  const [bbox, setBbox] = useState<Bbox>(null);

  const handleRefreshBbox = () => {
    setBbox(null);
  };
  const ZOOM_LEVEL = 16;
  const mapRef = useRef(null);
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const _create = (e: DrawEvents.Created) => {
    const layer = e.layer;

    const featureGroup = featureGroupRef.current;
    if (!featureGroup) return;

    // 기존 레이어 모두 제거
    featureGroup.clearLayers();

    // 새 레이어 추가
    featureGroup.addLayer(layer);

    if (e.layerType === "rectangle") {
      const bounds = layer.getBounds();

      // 그려져있던 레이어 있는지 확인

      const bbox = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      };

      setBbox(bbox);
      console.log("BBOX:", bbox);
    }

    if (e.layerType === "polygon") {
      const latlngs = layer.getLatLngs();
      console.log("Polygon coordinates:", latlngs);
      setBbox(latlngs);
    }
  };

  return (
    <div className=" relative h-screen w-full">
      <MapContainer
        center={position}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          className="z-0"
          url={osm.maptiler.url}
          attribution={osm.maptiler.attribution}
        />

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={_create}
            draw={drawOptions}
            edit={{
              edit: false,
              remove: false,
            }}
          />

          <CustomDrawToolbar
            onChangeBbox={handleRefreshBbox}
            featureGroupRef={featureGroupRef}
          />
        </FeatureGroup>
      </MapContainer>

      <LayerPanel />
      <AnalysisPanel />
      {bbox && <BottomBar />}
    </div>
  );
}

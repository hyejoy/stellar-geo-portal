"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Ref, useRef } from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const markerIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const position: [number, number] = [37.554648, 126.972559];
  /** map Ref */
  const mapRef = useRef<any>(null);

  /** 클릭 이벤트 (좌표) */
  function ClickLocation() {
    const map = useMapEvents({
      click: () => {
        map.locate();
      },
      locationfound: (location) => {
        console.log("location found:", location);
      },
    });
    return null;
  }

  const _onCreate = (e: any) => {
    console.log(e);
  };
  const _onEdited = (e: any) => {
    console.log(e);
  };
  const _onDeleted = (e: any) => {
    console.log(e);
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        className="min-h-dvh w-full"
        center={position}
        zoom={13}
        ref={mapRef}
      >
        <ClickLocation />

        <FeatureGroup>
          <EditControl
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
            position="topright"
            onCreated={_onCreate}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
          />
        </FeatureGroup>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

'use client';
import AnalysisPanel from '@/src/app/components/AnalysisPanel';
import BottomBar from '@/src/app/components/BottomBar';
import CustomDrawToolbar from '@/src/app/components/CustomDrawToolbar';
import osm from '@/src/app/leaftlet/osmProvider';
import { DrawOptions, PolygonBbox } from '@/src/types/leafletDraw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FeatureGroup, MapContainer, TileLayer, useMap } from 'react-leaflet';
// leaflet-draw css
import {
  useAnalysisActions,
  useAreaPrice,
  useLandArea,
  useSelectedBbox,
  useSelectedPosition,
} from '@/src/app/store/analysisStore';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import MapController from '@/src/app/components/MapController';
import {
  calculateAnalysisPrice,
  calculatePolygonAreaKm2,
  calculateRaectangleAreaKm2,
} from '@/src/utils/geo';
import { formatCurrency } from '@/src/utils/format';
import TopLayer from '@/src/app/components/TopLayer';
import MapHeaderPanel from '@/src/app/components/MapHeaderPanel';

const drawOptions: DrawOptions = {
  rectangle: false,
  circle: false,
  circlemarker: false,
  marker: false,
  polyline: false,
  polygon: false,
};

const ZOOM_LEVEL = 14;

export default function BasicMap() {
  const position = useSelectedPosition();
  const bbox = useSelectedBbox();
  const landArea = useLandArea();
  const areaPrice = useAreaPrice();
  const { changeBbox, changeLandArea, changeAreaPrice } = useAnalysisActions();
  const handleRefreshBbox = () => {
    changeBbox(null);
  };

  const fetchNdvi = async (bbox: any) => {
    try {
      const res = await fetch('/api/ndvi', {
        // 앞에 '/'가 있는지, 오타는 없는지 확인
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bbox }),
      });

      if (res.status === 404) {
        console.error('API 경로를 찾을 수 없습니다.');
        return;
      }

      const data = await res.json();
      console.log('NDVI API Response:', data);
    } catch (err) {
      console.error('NDVI fetch error:', err);
    }
  };

  const mapRef = useRef(null);
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const _create = useCallback(
    (e: any) => {
      // 여기서 e는 L.DrawEvents.Created 역할입니다.
      const { layerType, layer } = e;

      const featureGroup = featureGroupRef.current;
      if (!featureGroup) return;

      // 1. 기존 레이어 제거 및 새 레이어 추가
      featureGroup.clearLayers();
      featureGroup.addLayer(layer);

      // 2. 사각형(Rectangle) 처리
      if (layerType === 'rectangle') {
        // 중요: layer를 L.Rectangle로 캐스팅해야 getBounds()를 인식합니다.
        const rectangle = layer as L.Rectangle;
        const bounds = rectangle.getBounds();

        const bboxData = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        };

        changeBbox(bboxData);
        fetchNdvi(bboxData);
        const area = calculateRaectangleAreaKm2(bboxData);
        changeLandArea(area);
        console.log('BBOX:', bboxData);
      }

      // 3. 폴리곤(Polygon) 처리
      if (layerType === 'polygon') {
        const polygon = layer as L.Polygon;
        // Leaflet의 getLatLngs는 다중 폴리곤 대응을 위해 중첩 배열을 반환할 수 있습니다.
        const latlngs = polygon.getLatLngs();

        // 단일 폴리곤일 경우 첫 번째 배열이 실제 좌표들입니다.
        const flatLatLngs = (Array.isArray(latlngs[0]) ? latlngs[0] : latlngs) as L.LatLng[];

        // 1. 상태 업데이트 (Zustand)
        // flatLatLngs는 [{lat, lng}, ...] 형태이므로 타입에 맞게 저장됩니다.
        changeBbox(flatLatLngs as any);

        // 2. 면적 계산 및 로컬 상태 저장
        // 앞에서 만든 함수가 닫기 처리를 내부에서 하므로 flatLatLngs를 그대로 넘깁니다.
        const area = calculatePolygonAreaKm2(flatLatLngs);
        changeLandArea(area);

        // 3. 분석 API 호출 (필요 시)
        fetchNdvi(flatLatLngs);

        console.log('Polygon Area (km²):', area);
        console.log('Polygon Coordinates:', flatLatLngs);
      }
    },
    [changeBbox]
  );

  useEffect(() => {
    const price = calculateAnalysisPrice(landArea);
    const formatedPrice = formatCurrency(price);
    changeAreaPrice(formatedPrice);
  }, [landArea]);

  // 선택한 지역(센터 위치)이 바뀔 때마다 이전에 그렸던 bbox와 도형 제거
  useEffect(() => {
    // bbox 초기화
    changeBbox(null);
    changeLandArea(0);

    // 지도 상에 그려진 레이어 제거
    const featureGroup = featureGroupRef.current;
    if (featureGroup) {
      featureGroup.clearLayers();
    }
  }, [position, changeBbox, changeLandArea]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={position}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="h-full w-full"
        zoomControl={false}
        minZoom={ZOOM_LEVEL}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <MapController />
        <TileLayer className="z-0" url={osm.loadtier.url} />
        <TileLayer
          className="z-0"
          url={osm.maptiler.url}
          attribution={osm.maptiler.attribution}
          opacity={0.6}
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

          <TopLayer />
          <CustomDrawToolbar onChangeBbox={handleRefreshBbox} featureGroupRef={featureGroupRef} />
        </FeatureGroup>
      </MapContainer>

      {/* 선택한 지역 년도 표시 */}
      <div className="absolute top-0 right-0 left-0 z-[1000]">
        <MapHeaderPanel startYear={2025} endYear={2026} />
      </div>

      {/* <LayerPanel /> */}
      {/* <AnalysisPanel /> */}
      {bbox && <BottomBar />}
    </div>
  );
}

'use client';
import BottomBar from '@/src/app/components/BottomBar';
import CustomDrawToolbar from '@/src/app/components/CustomDrawToolbar';
import MapController from '@/src/app/components/MapController';
import MapHeaderPanel from '@/src/app/components/MapHeaderPanel';
import osm from '@/src/app/leaftlet/osmProvider';
import {
  useAnalysisActions,
  useAnalysisType,
  useAreaPrice,
  useLandArea,
  useSelectedBbox,
  useSelectedPosition,
  useSelectedYears,
} from '@/src/app/store/analysisStore';
import { DrawOptions, PolygonBbox } from '@/src/types/leafletDraw';
import { formatCurrency } from '@/src/utils/format';
import {
  calculateAnalysisPrice,
  calculatePolygonAreaKm2,
  calculateRaectangleAreaKm2,
} from '@/src/utils/geo';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

const drawOptions: DrawOptions = {
  rectangle: false,
  circle: false,
  circlemarker: false,
  marker: false,
  polyline: false,
  polygon: false,
};

export const ZOOM_LEVEL = 14;

export default function BasicMap() {
  /** analysis zustand */
  const position = useSelectedPosition();
  const bbox = useSelectedBbox();
  const landArea = useLandArea();
  const analysisType = useAnalysisType();
  const { selectedStartYear, selectedEndYear } = useSelectedYears();
  const { changeBbox, changeLandArea, changeAreaPrice } = useAnalysisActions();

  // const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  const handleRefreshBbox = () => {
    changeBbox(null);
  };

  const mapRef = useRef<L.Map | null>(null);
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
        // fetchAnalysis(bboxData);
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

        const flatLatLngs = Array.isArray(latlngs[0])
          ? (latlngs[0] as L.LatLng[])
          : (latlngs as L.LatLng[]);

        // 1. 상태 업데이트 (Zustand)
        // flatLatLngs는 [{lat, lng}, ...] 형태이므로 타입에 맞게 저장됩니다.
        changeBbox(flatLatLngs as PolygonBbox);

        // 2. 면적 계산 및 로컬 상태 저장
        // 앞에서 만든 함수가 닫기 처리를 내부에서 하므로 flatLatLngs를 그대로 넘깁니다.
        const area = calculatePolygonAreaKm2(flatLatLngs);
        changeLandArea(area);

        // 3. 분석 API 호출
        // fetchAnalysis(flatLatLngs);

        console.log('Polygon Area (km²):', area);
        console.log('Polygon Coordinates:', flatLatLngs);
      }
    },
    // [changeBbox, fetchAnalysis]
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

  useEffect(() => {
    if (!bbox) return;

    console.log('re-analyze', analysisType);

    // fetchAnalysis(bbox);
  }, [analysisType, bbox]);

  // useEffect(() => {
  //   if (!analysisImage || !bbox || !mapRef.current) return;
  //   if (Array.isArray(bbox)) return;

  //   const map = mapRef.current;
  //   const bounds: L.LatLngBoundsLiteral = [
  //     [bbox.south, bbox.west],
  //     [bbox.north, bbox.east],
  //   ];

  //   if (analysisOverlayRef.current) {
  //     map.removeLayer(analysisOverlayRef.current);
  //     analysisOverlayRef.current = null;
  //   }
  //   const overlay = L.imageOverlay(`data:image/png;base64,${analysisImage}`, bounds).addTo(map);
  //   analysisOverlayRef.current = overlay;

  //   return () => {
  //     if (analysisOverlayRef.current && map.hasLayer(analysisOverlayRef.current)) {
  //       map.removeLayer(analysisOverlayRef.current);
  //       analysisOverlayRef.current = null;
  //     }
  //   };
  // }, [analysisImage, bbox]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={position}
        zoom={ZOOM_LEVEL}
        className="h-full w-full"
        zoomControl={false}
        dragging={true}
        scrollWheelZoom={true}
        doubleClickZoom={false}
        ref={(map) => {
          if (map) mapRef.current = map;
        }}
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

          <CustomDrawToolbar onChangeBbox={handleRefreshBbox} featureGroupRef={featureGroupRef} />
        </FeatureGroup>
      </MapContainer>

      {/* 선택한 지역 년도 표시 */}
      <div className="absolute top-0 right-0 left-0 z-[1000]">
        <MapHeaderPanel />
      </div>

      <div className="absolute right-0 bottom-2.5 z-[1000] w-full bg-amber-600 leading-0">zzzz</div>
      {/* <LayerPanel /> */}
      {/* <AnalysisPanel /> */}
      {/* <div className="absolute right-0 bottom-10 left-0">{bbox && <BottomBar />}</div> */}
    </div>
  );
}

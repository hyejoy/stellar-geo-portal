import { RectangleBbox } from '@/src/types/leafletDraw';
import { area, polygon } from '@turf/turf';

export const calculateRaectangleAreaKm2 = (bbox: RectangleBbox) => {
  const { north, south, east, west } = bbox;

  const latDiff = north - south;
  const lngDiff = east - west;

  const latKm = latDiff * 111;

  const midLat = (north + south) / 2;
  const lngKm = lngDiff * 111 * Math.cos((midLat * Math.PI) / 180);

  return Number((latKm * lngKm).toFixed(2));
};

export const calculatePolygonAreaKm2 = (latlngs: { lat: number; lng: number }[]) => {
  if (!latlngs || latlngs.length < 3) return 0; // 최소 삼각형 형태는 필요

  // 1. [lng, lat] 배열로 변환
  let coords = latlngs.map((p) => [p.lng, p.lat]);

  // 2. 폴리곤 닫기: 첫 번째 점과 마지막 점이 다르면 첫 번째 점을 추가
  const firstPoint = coords[0];
  const lastPoint = coords[coords.length - 1];

  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    coords.push([firstPoint[0], firstPoint[1]]);
  }

  // 3. Turf는 중첩 배열 형식을 요구함: [ [ [lng, lat], [lng, lat], ... ] ]
  try {
    const poly = polygon([coords]);
    const areaInM2 = area(poly);
    return Number((areaInM2 / 1_000_000).toFixed(2)); // km² 변환
  } catch (error) {
    console.error('Area calculation error:', error);
    return 0;
  }
};

/**
 * 면적(km²)에 따른 분석 가격을 계산하는 함수
 * @param areaKm2 계산된 면적
 * @returns 원화(KRW) 기준 가격
 */
export const calculateAnalysisPrice = (areaKm2: number): number => {
  if (areaKm2 <= 0) return 0;

  const BASE_PRICE = 50000; // 기본 분석 시작가 (5만원)
  const PRICE_PER_KM2 = 15000; // 1km²당 추가 요금 (1.5만원)

  // 1. 기본 계산: 기본료 + (면적 * 단가)
  let totalPrice = BASE_PRICE + areaKm2 * PRICE_PER_KM2;

  // 2. 대면적 할인 (전략적 마케팅 요소)
  // 10km² 초과 시 10% 할인, 50km² 초과 시 20% 할인 등
  if (areaKm2 > 50) {
    totalPrice *= 0.8; // 20% 할인
  } else if (areaKm2 > 10) {
    totalPrice *= 0.9; // 10% 할인
  }

  // 3. 100원 단위 절사 (깔끔한 가격 처리)
  return Math.floor(totalPrice / 100) * 100;
};

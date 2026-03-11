import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 60;
const BASE_URL = process.env.SENTINEL_BASE_URL!;
const CLIENT_ID = process.env.SENTINEL_CLIENT_ID!;
const CLIENT_SECRET = process.env.SENTINEL_CLIENT_SECRET!;

type AnalysisType = 'ndvi' | 'sar';
//
// bbox 결과 타입
type BboxResult = [number, number, number, number];

// bounds 결과: bbox 또는 polygon geometry
type BoundsResult =
  | { type: 'bbox'; bbox: BboxResult }
  | { type: 'polygon'; geometry: GeoJSON.Polygon; bbox: BboxResult };

/**
 * bbox 또는 polygon 좌표 배열을 Sentinel API용 bounds 객체로 변환
 *
 * 입력 형태:
 *  1) { west, south, east, north }  → bbox
 *  2) [{ lat, lng }, ...]            → polygon (GeoJSON, 자동 닫힘 처리)
 */
function normalizeBounds(input: unknown): BoundsResult | null {
  if (!input) return null;

  // --- 형태 1: { west, south, east, north } ---
  if (
    typeof input === 'object' &&
    !Array.isArray(input) &&
    'west' in input &&
    'south' in input &&
    'east' in input &&
    'north' in input
  ) {
    const r = input as { west: number; south: number; east: number; north: number };
    return { type: 'bbox', bbox: [r.west, r.south, r.east, r.north] };
  }

  // --- 형태 2: [{ lat, lng }, ...] → Polygon ---
  if (Array.isArray(input) && input.length >= 3) {
    const points = input as { lat: number; lng: number }[];

    // GeoJSON 좌표는 [lng, lat] 순서
    const coords: [number, number][] = points.map((p) => [p.lng, p.lat]);

    // ✅ 폴리곤 닫기: 첫 번째 좌표를 마지막에 추가 (이미 닫혀있지 않은 경우)
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coords.push([first[0], first[1]]);
    }

    // bbox도 함께 계산 (Process API 이미지 크기 산정용)
    const lngs = points.map((p) => p.lng);
    const lats = points.map((p) => p.lat);
    const bbox: BboxResult = [
      Math.min(...lngs),
      Math.min(...lats),
      Math.max(...lngs),
      Math.max(...lats),
    ];

    const geometry: GeoJSON.Polygon = {
      type: 'Polygon',
      coordinates: [coords],
    };

    return { type: 'polygon', geometry, bbox };
  }

  return null;
}

/** Sentinel API의 bounds 필드 생성 */
function buildBounds(bounds: BoundsResult): object {
  if (bounds.type === 'bbox') {
    return { bbox: bounds.bbox };
  }
  // polygon → geometry 사용 (bbox는 제외 — API가 geometry 우선)
  return { geometry: bounds.geometry };
}

function getEvalscript(type: AnalysisType) {
  if (type === 'ndvi') {
    return `
//VERSION=3
function setup() {
  return {
    input: ["B04","B08","B03","SCL","dataMask"],
    output: { bands: 3 }
  }
}

function evaluatePixel(sample) {

  if (sample.dataMask === 0) return [0, 0, 0]

  // SCL 기반 수면 우선 판별
  const scl = sample.SCL
  if (scl === 6 || scl === 1) return [0.1, 0.2, 0.7]

  let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)
  if (!isFinite(ndvi)) return [0, 0, 0]

  // 항만/탁수 수면 판별:
  // - B03(Green)이 높고 B08(NIR)이 낮으면 수면 (물은 NIR을 강하게 흡수)
  // - NDVI < 0.05 이면서 NIR < 0.15 → 탁한 항만수로 간주
  const nir  = sample.B08
  const green = sample.B03
  const isWaterLike = nir < 0.15 && green < 0.12 && ndvi < 0.05

  if (ndvi < 0 || isWaterLike) return [0.1, 0.2, 0.7]  // 파랑 - 물/수면

  if (ndvi < 0.15) return [0.7, 0.6, 0.2]   // 노랑   - 건물/도로/나지
  if (ndvi < 0.3)  return [0.6, 0.8, 0.3]   // 연두   - 희박한 식생
  if (ndvi < 0.5)  return [0.2, 0.7, 0.2]   // 초록   - 중간 식생
  return [0.0, 0.45, 0.1]                    // 진초록 - 울창한 식생
}
`;
  }

  return `
//VERSION=3
function setup() {
  return {
    input:["VV"],
    output:{ bands:1 }
  }
}

function evaluatePixel(sample){
  return [sample.VV]
}
`;
}

async function getAccessToken() {
  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await res.json();
  console.log('🔑 auth response:', JSON.stringify(data));
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { bbox, analysisType, startYear, endYear } = body;

    // ✅ bbox → BoundsResult (bbox 또는 polygon 모두 처리)
    const bounds = normalizeBounds(bbox);

    if (!bounds) {
      return NextResponse.json({ error: 'bbox required' }, { status: 400 });
    }

    const type: AnalysisType = analysisType === 'sar' ? 'sar' : 'ndvi';

    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json({ error: 'Sentinel auth failed' }, { status: 502 });
    }

    const evalscript = getEvalscript(type);

    // bounds 객체 (geometry 또는 bbox)
    const apiBounds = buildBounds(bounds);

    // ---------------------------
    // NDVI Trend (Statistics API)
    // ---------------------------

    let yearlyTrend: { year: string; mean: number }[] = [];

    if (type === 'ndvi') {
      const statsRes = await fetch(`${BASE_URL}/api/v1/statistics`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            // ✅ polygon이면 geometry, bbox면 bbox 사용
            bounds: apiBounds,
            data: [{ type: 'sentinel-2-l2a' }],
          },
          aggregation: {
            timeRange: {
              from: `${startYear}-01-01T00:00:00Z`,
              to: `${endYear}-12-31T23:59:59Z`,
            },
            aggregationInterval: { of: 'P1M' },
            evalscript: `
//VERSION=3
function setup() {
  return {
    input:["B04","B08","dataMask"],
    output:[
      { id:"ndvi", bands:1 },
      { id:"dataMask", bands:1 }
    ]
  }
}

function evaluatePixel(sample){
  let ndvi = (sample.B08 - sample.B04) /
             (sample.B08 + sample.B04)

  return {
    ndvi:[ndvi],
    dataMask:[sample.dataMask]
  }
}
`,
          },
        }),
      });

      const statsData = await statsRes.json();

      const trend =
        statsData?.data?.map((d: any) => ({
          year: d.interval.from.slice(0, 4),
          mean: d.outputs.ndvi.bands.B0.stats.mean,
        })) ?? [];

      const yearlyMap: Record<string, number[]> = {};

      trend.forEach((item) => {
        if (!yearlyMap[item.year]) yearlyMap[item.year] = [];
        yearlyMap[item.year].push(item.mean);
      });

      yearlyTrend = Object.entries(yearlyMap).map(([year, values]) => ({
        year,
        mean: Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)),
      }));
    }

    // ---------------------------
    // Process API (이미지)
    // ---------------------------

    const processRes = await fetch(`${BASE_URL}/api/v1/process`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          bounds: {
            // ✅ polygon이면 geometry, bbox면 bbox 사용
            ...apiBounds,
          },
          data: [
            {
              type: type === 'ndvi' ? 'sentinel-2-l2a' : 'sentinel-1-grd',
              dataFilter: {
                timeRange: (() => {
                  // endYear가 현재 연도이고 아직 6월 전이면 → 직전 연도 여름 사용
                  // ex) 2026년 3월 요청 → 2025-06-01 ~ 2025-09-30
                  const now = new Date();
                  const curYear = now.getFullYear();
                  const summerStarted = now.getMonth() + 1 >= 6;
                  const yr =
                    type === 'ndvi' && Number(endYear) >= curYear && !summerStarted
                      ? curYear - 1
                      : Number(endYear);
                  return type === 'ndvi'
                    ? { from: `${yr}-06-01T00:00:00Z`, to: `${yr}-09-30T23:59:59Z` }
                    : { from: `${yr}-01-01T00:00:00Z`, to: `${yr}-12-31T23:59:59Z` };
                })(),
              },
              // Process API는 SIMPLE (ORBIT은 Statistics API 전용 → 검은 이미지 원인)
              mosaicking: 'SIMPLE',
            },
          ],
        },

        output: {
          width: 512,
          height: 512,
          responses: [
            {
              identifier: 'default',
              format: {
                type: 'image/png',
              },
            },
          ],
        },

        evalscript,
      }),
    });

    if (!processRes.ok) {
      const txt = await processRes.text();
      console.error(txt);
      return NextResponse.json({ error: 'Process API failed' }, { status: 500 });
    }

    const imageBuffer = await processRes.arrayBuffer();

    const base64 = Buffer.from(imageBuffer).toString('base64');

    return NextResponse.json({
      image: base64,
      analysisType: type,
      yearlyTrend, // NDVI일 때만 값 존재
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'analysis failed' }, { status: 500 });
  }
}

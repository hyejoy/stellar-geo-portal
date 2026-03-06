import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.SENTINEL_BASE_URL!;
const CLIENT_ID = process.env.SENTINEL_CLIENT_ID!;
const CLIENT_SECRET = process.env.SENTINEL_CLIENT_SECRET!;

type AnalysisType = 'ndvi' | 'sar';

function normalizeBbox(bbox: unknown): [number, number, number, number] | null {
  if (!bbox) return null;

  if (
    typeof bbox === 'object' &&
    'west' in bbox &&
    'south' in bbox &&
    'east' in bbox &&
    'north' in bbox
  ) {
    const r = bbox as { west: number; south: number; east: number; north: number };
    return [r.west, r.south, r.east, r.north];
  }

  if (Array.isArray(bbox) && bbox.length > 0) {
    const points = bbox as { lat: number; lng: number }[];

    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);

    return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
  }

  return null;
}

function getEvalscript(type: AnalysisType) {
  if (type === 'ndvi') {
    return `
//VERSION=3
function setup() {
  return {
    input: ["B04","B08","dataMask"],
    output: { bands: 3 }
  }
}

function evaluatePixel(sample) {

  if(sample.dataMask === 0){
    return [0,0,0]
  }

  let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)

  if(!isFinite(ndvi)){
    return [0,0,0]
  }

  if (ndvi < 0) return [0,0,0.4]
  if (ndvi < 0.2) return [0.7,0.6,0.3]
  if (ndvi < 0.4) return [0.5,0.8,0.3]
  if (ndvi < 0.6) return [0.2,0.7,0.2]
  return [0,0.5,0]
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
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { bbox, analysisType } = body;

    const bboxArr = normalizeBbox(bbox);

    if (!bboxArr) {
      return NextResponse.json({ error: 'bbox required' }, { status: 400 });
    }

    const type: AnalysisType = analysisType === 'sar' ? 'sar' : 'ndvi';

    const [west, south, east, north] = bboxArr;

    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json({ error: 'Sentinel auth failed' }, { status: 502 });
    }

    const evalscript = getEvalscript(type);

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
            bounds: { bbox: [west, south, east, north] },
            data: [{ type: 'sentinel-2-l2a' }],
          },
          aggregation: {
            timeRange: {
              from: '2018-01-01T00:00:00Z',
              to: '2026-12-31T23:59:59Z',
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
    // 기존 Process API (이미지)
    // ⚠️ 여기 부분은 기존 코드 그대로
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
            bbox: [west, south, east, north],
          },
          data: [
            {
              type: type === 'ndvi' ? 'sentinel-2-l2a' : 'sentinel-1-grd',
              dataFilter: {
                timeRange: {
                  from: '2024-06-01T00:00:00Z',
                  to: '2024-09-30T23:59:59Z',
                },
              },
              mosaicking: 'ORBIT',
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

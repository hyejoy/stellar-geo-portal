import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.SENTINEL_BASE_URL;
const CLIENT_ID = process.env.SENTINEL_CLIENT_ID;
const CLIENT_SECRET = process.env.SENTINEL_CLIENT_SECRET;

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

function getSatelliteAndEvalscript(analysisType: AnalysisType): {
  satellite: string;
  evalscript: string;
} {
  if (analysisType === 'ndvi') {
    return {
      satellite: 'sentinel-2-l2a',
      evalscript: `
          //VERSION=3
          function setup() {
            return {
              input: ["B04", "B08"],
              output: { bands: 3 }
            };
          }

          function evaluatePixel(sample) {
            let ndvi = (sample.B08 - sample.B04) /
                      (sample.B08 + sample.B04);

            if (ndvi < 0) return [0.5, 0.5, 0.5];
            if (ndvi < 0.2) return [0.9, 0.7, 0.1];
            if (ndvi < 0.4) return [0.6, 0.8, 0.2];
            if (ndvi < 0.6) return [0.3, 0.7, 0.2];
            return [0, 0.5, 0];
          }
          `,
    };
  }
  // sar
  return {
    satellite: 'sentinel-1-grd',
    evalscript: `
      //VERSION=3
      function setup() {
        return {
          input: ["VV"],
          output: { bands: 1 }
        };
      }

      function evaluatePixel(sample) {
        return [sample.VV];
      }
      `,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { bbox, analysisType = 'sar', startYear, endYear } = await req.json();

    const bboxArr = normalizeBbox(bbox);
    if (!bboxArr) {
      return NextResponse.json({ error: 'bbox required (rectangle or polygon)' }, { status: 400 });
    }

    const type: AnalysisType = analysisType === 'sar' ? 'sar' : 'ndvi';
    const { satellite, evalscript } = getSatelliteAndEvalscript(type);

    const currentYear = new Date().getFullYear();
    const fromYear = startYear ?? currentYear - 1;
    const toYear = endYear ?? currentYear;

    const [west, south, east, north] = bboxArr;

    const tokenRes = await fetch(`${BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('Sentinel OAuth failed:', tokenData);
      return NextResponse.json({ error: 'Analysis auth failed' }, { status: 502 });
    }

    const processRes = await fetch(`${BASE_URL}/api/v1/process`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          bounds: {
            bbox: [west, south, east, north],
          },
          data: [
            {
              type: satellite,
              dataFilter: {
                timeRange: {
                  from: `${fromYear}-01-01T00:00:00Z`,
                  to: `${toYear}-12-31T23:59:59Z`,
                },
              },
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
      const errText = await processRes.text();
      console.error('Sentinel Process API error:', processRes.status, errText);
      return NextResponse.json(
        { error: 'Analysis process failed', detail: errText },
        { status: 502 }
      );
    }

    const imageBuffer = await processRes.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');

    return NextResponse.json({
      image: base64,
      analysisType: type,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Analysis fetch failed' }, { status: 500 });
  }
}

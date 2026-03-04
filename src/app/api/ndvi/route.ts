import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.SENTINEL_BASE_URL;
const CLIENT_ID = process.env.SENTINEL_CLIENT_ID;
const CLIENT_SECRET = process.env.SENTINEL_CLIENT_SECRET;

export async function POST(req: NextRequest) {
  console.log('try!');
  try {
    const { bbox } = await req.json();

    if (!bbox) {
      return NextResponse.json({ error: 'bbox required' }, { status: 400 });
    }

    // 🔥 1. OAuth 토큰 요청
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

    // 🔥 2. NDVI 요청
    const ndviRes = await fetch(`${BASE_URL}/api/v1/process`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          bounds: {
            bbox: [bbox.west, bbox.south, bbox.east, bbox.north],
          },
          data: [
            {
              type: 'sentinel-2-l2a',
            },
          ],
        },
        evalscript: `
            //VERSION=3
            function setup() {
              return {
                input: ["B04", "B08"],
                output: { bands: 1 }
              };
            }

            function evaluatePixel(sample) {
              let ndvi = (sample.B08 - sample.B04) /
                         (sample.B08 + sample.B04);
              return [ndvi];
            }
          `,
      }),
    });

    const ndviData = await ndviRes.arrayBuffer();

    return NextResponse.json({
      message: 'NDVI request sent',
      size: ndviData.byteLength,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'NDVI fetch failed' }, { status: 500 });
  }
}

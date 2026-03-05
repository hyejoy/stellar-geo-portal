import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { bbox, landArea, startYear, endYear } = await req.json();

    if (!bbox) {
      return NextResponse.json(
        {
          error: 'bbox required',
        },
        {
          status: 400,
        }
      );
    }

    const orderId = crypto.randomUUID();
    return NextResponse.json({
      orderId,
      status: 'created',
    });
  } catch (err) {
    return NextResponse.json({ error: 'order create failed' }, { status: 500 });
  }
}

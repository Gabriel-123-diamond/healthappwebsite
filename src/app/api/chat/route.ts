import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "Chat functionality is currently under maintenance." }, { status: 503 });
}
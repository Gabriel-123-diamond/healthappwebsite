import { NextRequest, NextResponse } from "next/server";
import { checkSafetyServer } from "@/lib/safetyServer";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const result = await checkSafetyServer(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Safety Check Error:", error);
    return NextResponse.json({ isSafe: true, hasRedFlag: false }, { status: 500 });
  }
}
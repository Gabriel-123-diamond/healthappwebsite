// Seed route disabled by user request to prevent database flooding vulnerabilities
import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ error: "Disabled" }, { status: 404 }); }
export async function POST() { return NextResponse.json({ error: "Disabled" }, { status: 404 }); }

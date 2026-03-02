import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

const API_KEY = process.env.NEXT_PUBLIC_CSC_API_KEY;
const BASE_URL = 'https://api.countrystatecity.in/v1';

export async function GET(req: NextRequest) {
  // Authentication Check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    await adminAuth.verifyIdToken(token);
  } catch (e) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const countryIso = searchParams.get('countryIso');
  const stateIso = searchParams.get('stateIso');

  if (!API_KEY) {
    return NextResponse.json({ error: 'CSC API Key missing' }, { status: 500 });
  }

  let url = `${BASE_URL}/countries`;
  if (type === 'states' && countryIso) {
    url = `${BASE_URL}/countries/${countryIso}/states`;
  } else if (type === 'cities' && countryIso && stateIso) {
    url = `${BASE_URL}/countries/${countryIso}/states/${stateIso}/cities`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-CSCAPI-KEY': API_KEY,
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json({ error: `External API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Location Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

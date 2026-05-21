import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (userDoc.data()?.tier === 'basic') {
      return NextResponse.json({ error: "Premium feature restricted" }, { status: 403 });
    }

    // Aggregate last 7 days of search activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const historySnap = await adminDb.collection("users").doc(uid).collection("searchHistory")
      .where("timestamp", ">=", sevenDaysAgo.toISOString())
      .orderBy("timestamp", "asc")
      .get();

    // Group by day for the "Intelligence Wave"
    const dailyCounts: { [key: string]: number } = {};
    const categories: { [key: string]: number } = {};

    historySnap.docs.forEach(doc => {
      const data = doc.data();
      const date = new Date(data.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      
      const cat = data.category || 'General';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const searchFrequency = last7Days.map(day => dailyCounts[day] || 0);

    return NextResponse.json({ 
      success: true, 
      trends: {
        searchFrequency,
        labels: last7Days,
        categories: Object.keys(categories),
        categoryValues: Object.values(categories)
      } 
    });

  } catch (error: any) {
    console.error("Trends API Error:", error);
    return NextResponse.json({ error: "Failed to generate trend nodes" }, { status: 500 });
  }
}

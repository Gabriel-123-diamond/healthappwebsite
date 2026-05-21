import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { adminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { isValid } = adminAuth.verifySession(req);

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // 1. Fetch counts
    const [usersCount, expertsCount, appointmentsCount, insightsCount] = await Promise.all([
      adminDb.collection('users').count().get(),
      adminDb.collection('users').where('role', 'in', ['doctor', 'hospital', 'wellness_practitioner']).count().get(),
      adminDb.collection('appointments').count().get(),
      adminDb.collection('search_logs').count().get(), // Assuming search_logs exists
    ]);

    // 2. Fetch recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSignups = await adminDb.collection('users')
      .where('createdAt', '>=', sevenDaysAgo.toISOString())
      .count()
      .get();

    // 3. Subscription distribution
    const tierCounts = await Promise.all([
      adminDb.collection('users').where('tier', '==', 'plus').count().get(),
      adminDb.collection('users').where('tier', '==', 'elite').count().get(),
      adminDb.collection('users').where('tier', '==', 'vip1').count().get(),
      adminDb.collection('users').where('tier', '==', 'vip2').count().get(),
    ]);

    return NextResponse.json({
      totalUsers: usersCount.data().count,
      totalExperts: expertsCount.data().count,
      totalAppointments: appointmentsCount.data().count,
      totalInsights: insightsCount.data().count,
      recentSignups: recentSignups.data().count,
      tiers: {
        plus: tierCounts[0].data().count,
        elite: tierCounts[1].data().count,
        vip1: tierCounts[2].data().count,
        vip2: tierCounts[3].data().count,
      }
    });
  } catch (error) {
    console.error("[Admin Analytics Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

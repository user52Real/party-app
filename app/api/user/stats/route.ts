import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Party from "@/models/Party";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const parties = await Party.find({ userId: session.user.id });

    const stats = {
      totalParties: parties.length,
      totalGuests: parties.reduce((sum, party) => sum + party.guests, 0),
      totalBudget: parties.reduce((sum, party) => sum + party.budget, 0),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Failed to fetch user stats." }, { status: 500 });
  }
}
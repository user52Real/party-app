import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Party from "@/models/Party";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access. Please log in." }, { status: 401 });
    }

    await connectDB();

    const partyId = request.nextUrl.searchParams.get("id");
    const userId = session.user.id;

    if (!partyId) {
      return NextResponse.json({ error: "Party ID is missing in the request." }, { status: 400 });
    }

    const party = await Party.findOne({
      _id: new mongoose.Types.ObjectId(partyId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!party) {
      return NextResponse.json({ error: "Party not found or you are not the owner." }, { status: 404 });
    }

    const formattedParty = {
      id: party._id.toString(),
      name: party.name,
      date: party.date.toISOString(),
      guests: party.guests,
      budget: party.budget,
      location: party.location || ""
    };

    return NextResponse.json(formattedParty);
  } catch (error: unknown) {
    console.error("Error fetching party:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "An unexpected error occurred while fetching the party." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Party from "@/models/Party";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const partyId = params.id;
    const userId = session.user.id;

    const party = await Party.findOne({
      _id: new mongoose.Types.ObjectId(partyId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
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
  } catch (error) {
    console.error("Error fetching party:", error);
    return NextResponse.json({ error: "Failed to fetch party." }, { status: 500 });
  }
}
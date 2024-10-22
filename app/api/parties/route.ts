import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Party, { PartyDocument } from "@/models/Party";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Guest } from '@/types/types';
import { validatePartyInput } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access. Please log in." }, { status: 401 });
    }

    const partyData = await req.json();
    const userId = session.user.id;

    const validationError = validatePartyInput(partyData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Create a new party instance
    const newParty = new Party({
      ...partyData,
      userId: new mongoose.Types.ObjectId(userId),
    });

    // Save the party to the database
    const savedParty = await newParty.save();

    // Update user statistics
    await updateUserStatistics(userId, savedParty as PartyDocument);

    return NextResponse.json({ 
      message: "Party created successfully!", 
      partyId: savedParty._id.toString() 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating party:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "An unexpected error occurred while creating the party. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access. Please log in." }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id;

    const parties = await Party.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ date: -1 })
      .limit(6);

    const formattedParties = parties.map(party => ({
        id: party._id.toString(),
        name: party.name,
        date: party.date.toISOString(),
        guestCount: party.guests, 
        guestList: party.guestList ? party.guestList.map((guest: Guest) => ({
          id: guest._id.toString(),
          name: guest.name,
          email: guest.email,
          status: guest.status
        })) : [],
        budget: party.budget,
        location: party.location
    }));

    return NextResponse.json(formattedParties);
  } catch (error: unknown) {
    console.error("Error fetching parties:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "An unexpected error occurred while fetching the parties." }, { status: 500 });
  }
}
async function updateUserStatistics(userId: string, newParty: PartyDocument) {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalParties: 1,
          totalGuests: newParty.guests,
        },
        $set: {
          lastParty: newParty._id,
        },
      },
      { new: true }
    );
  } catch (error: unknown) {
    console.error("Error updating user statistics:", error instanceof Error ? error.message : String(error));
  }
}

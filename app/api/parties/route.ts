import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Party, { PartyDocument } from "@/models/Party";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, date, guests, budget, location, userId } = await req.json();

    // Enhanced input validation
    if (!name || !date || typeof guests !== 'number' || typeof budget !== 'number' || !userId) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    // Date validation
    const partyDate = new Date(date);
    if (isNaN(partyDate.getTime()) || partyDate < new Date()) {
      return NextResponse.json({ error: "Invalid or past date" }, { status: 400 });
    }

    // Create a new party instance
    const newParty = new Party({
      name,
      date: partyDate,
      guests,
      budget,
      location,
      userId: new mongoose.Types.ObjectId(userId),
    });

    // Save the party to the database
    const savedParty = await newParty.save();

    // Update user statistics
    try {
      await updateUserStatistics(userId, savedParty as PartyDocument);
    } catch (error) {
      console.error("Error updating user statistics:", error);
      // Consider whether to return an error or continue
    }

    return NextResponse.json({ 
      message: "Party created successfully!", 
      partyId: newParty._id.toString() 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating party:", error);
    return NextResponse.json({ error: "Failed to create party. Please try again later." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    const parties = await Party.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ date: -1 })
      .limit(5);

    const formattedParties = parties.map(party => ({
      id: party._id.toString(),
      name: party.name,
      date: party.date.toISOString(),
      guests: party.guests,
      budget: party.budget,
      location: party.location || ""
    }));

    return NextResponse.json(formattedParties);
  } catch (error) {
    console.error("Error fetching parties:", error);
    return NextResponse.json({ error: "Failed to fetch parties." }, { status: 500 });
  }
}

async function updateUserStatistics(userId: string, newParty: PartyDocument) {
  const user = await User.findByIdAndUpdate(
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
}
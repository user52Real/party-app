import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Party, { PartyDocument } from "@/models/Party";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Guest } from '@/types/types';


export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, date, guests, budget, location } = await req.json();
    const userId = session.user.id;

    // Enhanced input validation
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    if (typeof guests !== 'number' || guests <= 0) {
      return NextResponse.json({ error: "Guests must be a positive number" }, { status: 400 });
    }
    if (typeof budget !== 'number' || budget <= 0) {
      return NextResponse.json({ error: "Budget must be a positive number" }, { status: 400 });
    }

    // Date validation
    const partyDate = new Date(date);
    if (isNaN(partyDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    if (partyDate < new Date()) {
      return NextResponse.json({ error: "Date cannot be in the past" }, { status: 400 });
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
    await updateUserStatistics(userId, savedParty as PartyDocument);

    return NextResponse.json({ 
      message: "Party created successfully!", 
      partyId: savedParty._id.toString() 
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
      guests: party.guests.map((guest: Guest) => ({
        id: guest._id.toString(),
        name: guest.name,
        email: guest.email,
        status: guest.status
      })),
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
}
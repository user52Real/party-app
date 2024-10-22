import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Party from "@/models/Party";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Guest } from "@/types/types";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { partyId, guestEmail, guestName } = await req.json();
    const userId = session.user.id;

    // Input validation
    if (!partyId || !guestEmail || !guestName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Find the party and check if the user is the owner
    const party = await Party.findOne({
      _id: new mongoose.Types.ObjectId(partyId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!party) {
      return NextResponse.json({ error: "Party not found or you're not the owner" }, { status: 404 });
    }

    // Check if the guest is already invited
    const existingGuest = party.guests.find((guest: Guest) => guest.email === guestEmail);
    if (existingGuest) {
      return NextResponse.json({ error: "Guest already invited" }, { status: 400 });
    }

    // Add the new guest to the party
    party.guests.push({
      name: guestName,
      email: guestEmail,
      status: 'pending'
    });

    await party.save();

    // TODO: Send invitation email to the guest

    return NextResponse.json({ message: "Invitation sent successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json({ error: "Failed to create invitation. Please try again later." }, { status: 500 });
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
    const url = new URL(req.url);
    const partyId = url.searchParams.get('partyId');

    if (!partyId) {
      return NextResponse.json({ error: "Party ID is required" }, { status: 400 });
    }

    const party = await Party.findOne({
      _id: new mongoose.Types.ObjectId(partyId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!party) {
      return NextResponse.json({ error: "Party not found or you're not the owner" }, { status: 404 });
    }

    const invitations = party.guests.map((guest: { _id: { toString: () => string }, name: string, email: string, status: string }) => ({
      id: guest._id.toString(),
      name: guest.name,
      email: guest.email,
      status: guest.status
    }));

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json({ error: "Failed to fetch invitations." }, { status: 500 });
  }
}
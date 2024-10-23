import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Party from "@/models/Party";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Guest } from "@/types/types";
import { validateEmail } from "@/lib/utils";
import { sendInvitationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access. Please log in." }, { status: 401 });
    }

    const { partyId, guestEmail, guestName } = await req.json();
    const userId = session.user!.id;

    if (!partyId || !guestEmail || !guestName) {
      return NextResponse.json({ error: "Missing required fields: partyId, guestEmail, guestName." }, { status: 400 });
    }

    if (!validateEmail(guestEmail)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    const party = await Party.findOne({
      _id: new mongoose.Types.ObjectId(partyId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!party) {
      return NextResponse.json({ error: "Party not found or you're not the owner." }, { status: 404 });
    }

    const existingGuest = party!.guests!.find((guest: Guest) => guest.email === guestEmail);
    if (existingGuest) {
      return NextResponse.json({ error: "Guest has already been invited." }, { status: 400 });
    }

    party.guests.push({
      name: guestName,
      email: guestEmail,
      status: 'pending'
    });

    await party.save();
    await sendInvitationEmail(guestEmail, guestName, party.name);

    return NextResponse.json({ message: "Invitation sent successfully." }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating invitation:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "An unexpected error occurred while creating the invitation. Please try again." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access. Please log in." }, { status: 401 });
    }

    await connectDB();
    const userId = session.user!.id;
    const url = new URL(req.url);
    const partyId = url.searchParams.get('partyId');

    if (!partyId) {
      return NextResponse.json({ error: "Party ID is required in the query parameters." }, { status: 400 });
    }

    const party = await Party.findOne({
      _id: new mongoose.Types.ObjectId(partyId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!party) {
      return NextResponse.json({ error: "Party not found or you're not the owner." }, { status: 404 });
    }

    const invitations = party.guests.map((guest: Guest) => ({
      id: guest!._id.toString(),
      name: guest!.name,
      email: guest!.email,
      status: guest!.status
    }));

    return NextResponse.json(invitations);
  } catch (error: unknown) {
    console.error("Error fetching invitations:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "An unexpected error occurred while fetching the invitations." }, { status: 500 });
  }
}
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import mongoose from "mongoose";
import { PartyDocument } from "@/models/Party";
import User from "@/models/User";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePartyInput(partyData: PartyDocument): string | null {
  if (!partyData.name) {
    return "Name is required";
  }
  if (!partyData.date) {
    return "Date is required";
  }
  if (typeof partyData.guests !== 'number' || partyData.guests <= 0) {
    return "Guests must be a positive number";
  }
  if (typeof partyData.budget !== 'number' || partyData.budget <= 0) {
    return "Budget must be a positive number";
  }

  const partyDate = new Date(partyData.date);
  if (isNaN(partyDate.getTime())) {
    return "Invalid date format";
  }
  if (partyDate < new Date()) {
    return "Date cannot be in the past";
  }

  return null; // No validation errors
}

export async function updateUserStatistics(userId: string, party: PartyDocument): Promise<void> {
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      throw new Error("User not found");
    }

    user!.totalParties = (user.totalParties || 0) + 1;
    user!.totalGuests = (user.totalGuests || 0) + (Array.isArray(party.guests) ? party.guests.length : party.guests || 0);
    user!.totalBudget = (user.totalBudget || 0) + party.budget;

    if (!user!.lastPartyDate || new Date(party.date) > new Date(user.lastPartyDate)) {
      user.lastPartyDate = party.date;
    }

    await user.save();
  } catch (error) {
    console.error("Error updating user statistics:", error);
    throw error;
  }
}
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function calculateBudgetPerGuest(budget: number, guestCount: number): number {
  return guestCount > 0 ? budget / guestCount : 0;
}

export function sanitizeInput(input: string): string {
  // Basic sanitization: remove HTML tags and trim whitespace
  return input.replace(/<[^>]*>?/gm, '').trim();
}

export function generateUniqueInviteCode(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculatePartyDuration(startTime: Date, endTime: Date): number {
  return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // Duration in hours
}


import mongoose from "mongoose";
import { ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    phone?: string;
    totalParties?: number;
    totalGuests?: number;
    lastParty?: string;
}
  
export interface Party {
    id: string;
    name: string;
    date: string;
    guests: number;
    budget: number;
    location?: string;
    userId: string;
}
  
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    image: string;
}
  
export interface UserDashboardData {
    totalParties: number;
    partiesIncrease: number;
    upcomingEvents: number;
    nextEventIn: string;
    totalGuests: number;
    budgetUsed: string;
    budgetUsedPercentage: string;
    recentParties: {
      id: string;
      name: string;
      date: string;
      location: string;
      guests: number;
    }[];
}

export interface FacebookResponse {
  request?: string;
  to?: string[];
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode: number;
    error_user_title: string;
    error_user_msg: string;
  };
}

export interface AuthLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export interface Guest {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  status: string;
}

export interface RegisterValues {
  email: string;
  password: string;
  name: string;
  redirect?: boolean;
}
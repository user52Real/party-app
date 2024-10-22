// File: types/types.ts

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
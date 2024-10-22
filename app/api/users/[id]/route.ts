import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import Party from "@/models/Party"; 
import User from "@/models/User";
import Party from "@/models/Party";
import { UserProfile, UserDashboardData } from '@/types/types';


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const userId = params.id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const profileRequest = url.searchParams.get('profile') === 'true';

    if (profileRequest) {
      // Return profile data
      const userProfile: UserProfile = {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        image: user.image || '',
      };
      return NextResponse.json(userProfile, { status: 200 });
    } else {
      // Return dashboard data
      const recentParties = await Party.find({ userId })
        .sort({ date: -1 })
        .limit(5);

      const userData: UserDashboardData = {
        totalParties: user.totalParties ?? 0,
        partiesIncrease: user.partiesIncrease ?? 0,
        upcomingEvents: user.upcomingEvents ?? 0,
        nextEventIn: user.nextEventIn ?? "",
        totalGuests: user.totalGuests ?? 0,
        budgetUsed: user.budgetUsed ?? "",
        budgetUsedPercentage: user.budgetUsedPercentage ?? "",
        recentParties: recentParties.map(party => ({
          id: party._id.toString(),
          name: party.name,
          date: party.date.toISOString().split('T')[0],
          location: party.location || "", 
          guests: party.guests
        }))
      };
      return NextResponse.json(userData, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = params.id;
    const userUpdates = await req.json();

    // Only allow updating specific fields
    const allowedUpdates: (keyof UserProfile)[] = ['name', 'email', 'phone', 'image'];
    const filteredUpdates = Object.keys(userUpdates)
      .filter((key): key is keyof UserProfile => allowedUpdates.includes(key as keyof UserProfile))
      .reduce((obj, key) => {
        obj[key] = userUpdates[key];
        return obj;
      }, {} as Partial<UserProfile>);

    const user = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedProfile: UserProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      image: user.image || '',
    };

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
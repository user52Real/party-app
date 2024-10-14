"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, PartyPopper, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

interface UserData {
  totalParties: number;
  partiesIncrease: number;
  upcomingEvents: number;
  nextEventIn: string;
  totalGuests: number;
  budgetUsed: string;
  budgetUsedPercentage: string;
  recentParties: Array<{
    id: string;
    name: string;
    date: string;
    location: string;
    guests: number;
  }>;
}

const fetchUserData = async (userId: string) => {
  const response = await fetch(`/api/user/${userId}`);
  if (!response.ok) {
    throw new Error(`Error fetching user data: ${response.status}`);
  }
  return await response.json();
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    totalParties: 0,
    partiesIncrease: 0,
    upcomingEvents: 0,
    nextEventIn: "",
    totalGuests: 0,
    budgetUsed: "",
    budgetUsedPercentage: "",
    recentParties: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          setError(null);
          const userData = await fetchUserData(session.user.id);
          setUserData(userData);
        } catch (error) {
          console.error(error);
          setError("Failed to load user data. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("User ID is undefined");
      }
    };

    getUserData();
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background bg-gradient-to-br from-yellow-200 via-black to-white text-white">
      {/* <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feest Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {session?.user?.name || ""}</span>
            <Image
              src={session?.user?.image || "/placeholder.svg?height=32&width=32"}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        </div>
      </header> */}
      <hr className="border-t border-white" />
      <header className="bg-black py-8 ">
        <div className="container mx-auto px-2 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-white text-center">
            Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span>{session?.user?.name || ""} </span>
            <Image
              src={session?.user?.image || "/placeholder.svg?height=32&width=32"}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>          
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
      {userData && !isLoading && !error ? (        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Parties</CardTitle>
              <PartyPopper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {Array.isArray(userData?.recentParties) && userData.recentParties.length > 0 ? (
                <div className="space-y-4">
                  {userData.recentParties.map((party) => (
                    <div key={party.id} className="border-b py-2 last:border-none">
                      <h3 className="font-semibold">{party.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {party.date} | {party.location} ({party.guests} guests)
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent parties found.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Next event in {userData.nextEventIn} days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.totalGuests}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.budgetUsed}</div>
              <p className="text-xs text-muted-foreground">{userData.budgetUsedPercentage}% of total budget</p>
            </CardContent>
          </Card>          
        </div>       
        ) : (
          <div>Loading...</div>
        )}
        <div className="mt-12 flex justify-center">
            <Button asChild>
              <Link href="/create-event" className="flex items-center space-x-2 m-10 bg-black text-white px-7 py-6 rounded-lg text-xl transition duration-300 hover:bg-white hover:text-black">
                <FaPlus className="mr-2" />
                Create New Event
              </Link>
            </Button>
        </div>
      </main>
      <footer className="bg-black py-6 mt-6">
        <div className="container mx-auto text-center">
          <p className="text-white text-sm">
            &copy; {new Date().getFullYear()} Shareflyt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

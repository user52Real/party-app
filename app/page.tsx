'use client';
import { Button } from "@/components/ui/button";
import { LogInIcon, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { FaCalendar, FaUsers, FaPlus } from 'react-icons/fa';

interface Party {
  id: string;
  name: string;
  date: string;
  guests: number;
  budget: number;
}

const CustomButton = ({ href, icon: Icon, text }: { href: string; icon: React.ElementType; text: string }) => (
  <Button asChild>
    <Link href={href} className="flex items-center align-center justify-center justify-items-center space-x-2 m-10 bg-black text-white px-7 py-6 rounded-lg text-xl transition duration-300 hover:bg-white hover:text-black">
      <Icon className="mr-2" />
      {text}
    </Link>
  </Button>
);

export default function Home() {
  const {data: session, status } = useSession();
  const [parties, setParties] = useState<Party[]>([]);
  const [stats, setStats] = useState({ totalParties: 0, totalGuests: 0, totalBudget: 0 });

  useEffect(() => {
    if (status === "authenticated") {
      fetchParties();
      fetchStats();
    }
  }, [status]);

  const fetchParties = async () => {
    try {
      const response = await fetch('/api/parties');
      if (response.ok) {
        const data = await response.json();
        setParties(data.slice(0, 5)); 
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (    
    
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-200 via-black to-white text-black">
      <hr className="border-t border-white" />      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <header className="flex justify-center items-center mb-12 ">           
          {status === "authenticated" ? (
            <div className="flex items-center space-x-4 bg-transparent text-white px-4 py-2 ">
              
            </div>
          ) : status === "unauthenticated" ? (            
              <section className="text-center mt-20 ">
                <img src="/images/logo.png" alt="Logo" className="w-40 h-40 mx-auto mt-10" />
                <h2 className="text-3xl font-bold mb-4 text-white">Plan Your Next Event with Ease</h2>
                <p className="text-xl mb-8 text-white">Join Feest to create and manage your parties effortlessly.</p>
                <CustomButton href="/register" icon={UserPlus} text="Register" />
                <CustomButton href="/login" icon={LogInIcon} text="Login" />
              </section>          
            
          ) : (
            <span className="text-sm">Loading...</span>
          )}
          
          
        </header>

        {status === "authenticated" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <section className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-2xl m-2">
              <h1 className="font-semibold text-3xl mb-10 text-center">Hello {session?.user?.name}</h1>
              <h2 className="text-2xl font-bold mb-10 text-center">Your Statistics</h2>
              <div className="grid grid-cols-2 mt-20">
                <div className="text-center">
                  <FaCalendar className="text-3xl mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.totalParties}</p>
                  <p className="text-sm">Total Parties</p>
                </div>
                <div className="text-center">
                  <FaUsers className="text-3xl mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.totalGuests}</p>
                  <p className="text-sm">Total Guests</p>
                </div>
              </div>
            </section>

            <section className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-2xl m-2">
              <h2 className="text-2xl font-bold mb-6 text-center">Upcoming Parties</h2>
              {parties.length > 0 ? (
                <ul className="space-y-4">
                  {parties.map((party) => (
                    <li key={party.id} className="bg-white bg-opacity-50 rounded-lg p-4">
                      <h3 className="font-bold">{party.name}</h3>
                      <p className="text-sm">Date: {new Date(party.date).toLocaleDateString()}</p>
                      <p className="text-sm">Guests: {party.guests}</p>
                      <p className="text-sm">Budget: ${party.budget}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming parties. Time to plan one!</p>
              )}
            </section>         
          </div>            
        )}
        {status === "authenticated" && (
          <div className="mt-12 flex justify-center ">
            <Button asChild>
              <Link href="/create-event" className="flex items-center space-x-2 m-10 bg-black text-white px-7 py-6 rounded-lg text-xl transition duration-300 hover:bg-white hover:text-black">
                <FaPlus className="mr-2" />
                Create New Event
              </Link>
            </Button>
          </div>
        )}

        {/* {status === "unauthenticated" && (
          <section className="text-center mt-20">
            <h2 className="text-3xl font-bold mb-4 text-white">Plan Your Next Event with Ease</h2>
            <p className="text-xl mb-8 text-white">Join Feest to create and manage your parties effortlessly.</p>
            <Link href="/register" className="bg-black text-white px-8 py-3 rounded-full font-bold text-lg transition duration-300 hover:black hover:text-black hover:bg-white">
              Get Started
            </Link> 
            <Button asChild>
              <Link href="/register" className="flex items-center space-x-2 m-10 bg-black text-white px-7 py-6 rounded-lg text-xl transition duration-300 hover:bg-white hover:text-black">
                <UserPlus className="mr-2" />
                Register
              </Link>
            </Button>          
          </section>          
        )}
        {status === "unauthenticated" && (
          <section className="text-center mt-20">
            <h2 className="text-3xl font-bold mb-4 text-white">Plan Your Next Event with Ease</h2>
            <p className="text-xl mb-8 text-white">Join Feest to create and manage your parties effortlessly.</p>
            <Button asChild>
              <Link href="/login" className="flex items-center space-x-2 m-10 bg-black text-white px-7 py-6 rounded-lg text-xl transition duration-300 hover:bg-white hover:text-black">
                <LogInIcon className="mr-2" />
                Login
              </Link>
            </Button>
          </section>          
        )} */}
      </div>

      <footer className="bg-black py-6">
        <div className="container mx-auto text-center text-white">
          &copy; {new Date().getFullYear()} Shareflyt. All rights reserved.
        </div>
      </footer>
    </main>   
);
}
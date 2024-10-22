"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateEvent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Form state and loading/error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    guests: '',
    budget: '',
    location: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!session?.user?.id) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    // Client-side form validation
    const { name, date, guests, budget, location } = eventData;
    if (!name || !date || !guests || !budget || !location) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (isNaN(Number(guests)) || Number(guests) <= 0) {
      setError("Guests must be a valid positive number.");
      setLoading(false);
      return;
    }

    if (isNaN(Number(budget)) || Number(budget) <= 0) {
      setError("Budget must be a valid positive number.");
      setLoading(false);
      return;
    }

    // Submit data to the backend
    try {
      const response = await fetch("/api/parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventData,
          guests: parseInt(eventData.guests),
          budget: parseInt(eventData.budget),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event.");
      }

      const data = await response.json();
      router.push(`/invite/${data.partyId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle session status
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-200 via-black to-white text-black">
      <hr className="border-t border-white" />
      <header className="bg-black py-8">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-white text-center">
            Create Event
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-10 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          
          {error && (
            <div
              role="alert"
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            >
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Event Name"
              value={eventData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="guests"
              placeholder="Number of Guests"
              value={eventData.guests}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              name="budget"
              placeholder="Budget"
              value={eventData.budget}
              onChange={handleChange}
              required
            />
            <Textarea
              name="location"
              placeholder="Location"
              value={eventData.location}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg shadow-sm transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-white text-white hover:text-black"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Creating...</span>
                </span>
              ) : (
                "Create Event"
              )}
            </Button>
          </form>
        </div>
      </main>

      <footer className="bg-black py-6">
        <div className="container mx-auto text-center text-white">
          &copy; {new Date().getFullYear()} Feest. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

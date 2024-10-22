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
  // const [title, setTitle] = useState("");
  // const [date, setDate] = useState("");
  // const [location, setLocation] = useState("");
  // const [guests, setGuests] = useState<number | undefined>(undefined);
  // const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    guests: '',
    budget: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError({});

    if (!session?.user?.id) {
      setError({ general: "User is not authenticated." });
      setLoading(false);
      return;
    }

    // const newErrors: { [key: string]: string } = {};
    // if (!title.trim()) newErrors.title = "Title is required.";
    // if (!date.trim()) newErrors.date = "Date is required.";
    // if (!location.trim()) newErrors.location = "Location is required.";
    // if (!guests || isNaN(guests)) newErrors.guests = "Guests must be a valid number.";
    // if (!description.trim()) newErrors.description = "Description is required.";

    

    // if (Object.keys(newErrors).length > 0) {
    //   setError(newErrors);
    //   setLoading(false);
    //   return;
    // }

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
        throw new Error("Failed to create event.");
      }
      const data = await response.json();
      //const eventId = data.id; 

      router.push(`/invite/${data.partyId}`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError({ general: err.message || "Something went wrong." });
      } else {
        setError({ general: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
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
          {Object.keys(error).length > 0 && (
            <div
              role="alert"
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            >
              {Object.values(error).map((msg, index) => (
                <p key={index} className="font-semibold">
                  {msg}
                </p>
              ))}
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
          &copy; {new Date().getFullYear()} Shareflyt. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
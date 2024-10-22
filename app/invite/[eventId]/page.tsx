"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvitationForm from '@/components/InvitationForm';

interface Party {
  id: string;
  name: string;
  date: string;
  guests: number;
  budget: number;
  location: string;
}

export default function InvitePage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<Party | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventId = params.eventId as string;
        if (!eventId) {
          throw new Error('Event ID is missing');
        }

        const response = await fetch(`/api/parties/${eventId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch party details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to fetch party details');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-200 via-black to-white text-white py-10 px-6">
      <Card className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-white shadow-lg rounded-lg mx-auto max-w-xl w-full justify-items-center p-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold text-white text-center">
            {event.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4">
          <p className="text-lg">
            <span className="font-semibold text-yellow-100">Date: </span>
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-yellow-100">Location: </span>
            {event.location}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-yellow-100">Guests: </span>
            {event.guests}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-yellow-100">Budget: </span>
            ${event.budget}
          </p>
        </CardContent>
      </Card>
      <div className="max-w-3xl mx-auto">
        <InvitationForm eventId={eventId} />
      </div>
    </div>

  );
}

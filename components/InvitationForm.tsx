'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { FacebookResponse } from '@/types/types';

interface InvitationFormProps {
  eventId: string;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ eventId }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/${eventId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      if (response.ok) {
        alert('Invitation sent successfully!');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (error) {
      alert(`${error} Error sending invitation. Please try again.`);
    }
  };

  const handleFacebookInvite = () => {
    // @ts-expect-error: Facebook SDK is not properly typed, but this method is necessary for functionality
    FB.ui({
      method: 'apprequests',
      message: `Join me at event #${eventId}: Join my party!`,
    }, (response: FacebookResponse) => {
      if (response.request && !response.error) {
        alert('Invitation sent successfully!');
      } else {
        alert('Error sending invitation. Please try again.');
      }
    });
  };
  return (
    <div className="flex flex-col bg-transparent items-center justify-center p-20 mx-auto">
      <form onSubmit={handleEmailInvite} className="bg-gray-800 shadow-lg rounded-lg p-4 space-y-6 max-w-lg w-[680px]">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Send an Invitation</h2>
        <Input
          type="email"
          placeholder="Friend's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-white p-4 rounded-md focus:ring-2 focus:ring-yellow-400 border border-gray-700"
        />
        <Textarea
          placeholder="Invitation Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full text-white p-4 rounded-md focus:ring-2 focus:ring-yellow-400 border border-gray-700"
          rows={5}
        />
        <Button 
          type="submit" 
          className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-white hover:text-black transition-all duration-300"
        >
          Send Email Invitation
        </Button>
        <Button 
          onClick={handleFacebookInvite} 
          className="w-full bg-blue-400 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-all duration-300"
        >
          Invite via Facebook for Event #{eventId}
        </Button>
      </form>
    </div>
  );
}

export default InvitationForm;
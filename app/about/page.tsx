"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Assuming you're using ShadCN's Card component
import { Button } from "@/components/ui/button"; // Assuming you have a reusable Button component

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-black to-white">
      <hr className="border-t border-white" />
      <header className="bg-black py-10">
        <div className="container mx-auto px-6">
        <img src="/images/logo.png" alt="Logo" className="w-20 h-20 mx-auto mt-10 mb-10 bg-white" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-white text-center">
            About Our App
          </h1>          
        </div>
      </header>
      <main className="container mx-auto px-6 py-16 space-y-16 ">
        <section className="space-y-6">
          <h2 className="text-4xl font-semibold text-center text-white">
            Your Event, Simplified
          </h2>
          <p className="text-lg text-center text-white max-w-3xl mx-auto leading-relaxed">
            Our Private Party Creation App is designed to streamline your event planning. Whether you’re hosting a small gathering or a large celebration, this app makes it easy to create, manage, and enjoy exclusive events. We take care of the details, so you can focus on what matters most—making memories with your guests.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-black">
                Secure User Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-black">
                Easily sign in with Google or use custom credentials to manage your private events securely. We take your privacy seriously.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-black">
                Event Management Made Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-black">
                Create events in seconds. Set the event details, manage guest lists, and keep track of RSVPs—all from one intuitive dashboard.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-black">
                Invite & Track Guests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-black">
                Effortlessly send invites and track guest responses with a click. Stay organized and know exactly who’s attending.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-black">
                Insightful Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-black">
                Get a comprehensive overview of your upcoming events, guests, and budget from our customizable dashboard.
              </p>
            </CardContent>
          </Card>
        </section>
        <section className="text-center">
          <h2 className="text-4xl font-semibold text-white">Why We Built This App</h2>
          <p className="text-lg max-w-2xl mx-auto text-white leading-relaxed mt-4">
            We created this app to take the stress out of event planning. We know how overwhelming it can be to organize all the details, so we made it easy for you to focus on the fun part—creating unforgettable moments with your guests.
          </p>
        </section>
        <section className="text-center">
          <h2 className="text-4xl font-semibold text-white">Start Planning Your Next Event</h2>
          <p className="text-lg max-w-xl mx-auto text-white leading-relaxed mt-4">
            Ready to make your next gathering special? Sign up or log in and start creating your own personalized events today.
          </p>
          <div className="mt-8">
            <Button className="bg-black hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
              Get Started
            </Button>
          </div>
        </section>
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
};

export default AboutPage;

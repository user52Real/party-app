import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar  from "../components/Navbar";
import { connectDB } from "@/lib/db";
import { Provider } from  "./provider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Feest App",
  description: "Create events and invite friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  connectDB();
  return (
    
    <html lang="en">
      <Provider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar />
          {children}
          
        </body>
      </Provider>
    </html>
  );
}

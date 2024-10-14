"use client";

import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between px-10 py-3 bg-black dark:bg-gray-800 text-white">
      <Link href="/" className="flex items-center gap-2 text-white" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="text-lg font-semibold text-white">Feest Inc</span>
      </Link>
      <div className="hidden md:flex gap-4 ">
        <Link href="/" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
          Home
        </Link>        
        <Link href="/dashboard" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
          Dashboard
        </Link>   
        <Link href="/profile" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
          Profile
        </Link>    
        <Link href="/about" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
          About
        </Link> 

        {session && (
          <Link href={"/login"} className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
            <button onClick={() => signOut()}>Sign out</button>
          </Link>
        )}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden md:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid w-[200px] p-4 ">
            <Link href="/" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
              Home
            </Link>            
            <Link href="/dashboard" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
              Dashboard
            </Link>
            <Link href="/profile" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
              Profile
            </Link>
            <Link href="/about" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
              About
            </Link>

            {session && (
              <Link href={"/login"} className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
                <button onClick={() => signOut()}>Sign out</button>
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

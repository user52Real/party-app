import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const handler = NextAuth(authOptions);

export async function GET(req: Request) {
  try {
    return await handler(req);
  } catch (error) {
    console.error("NextAuth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    return await handler(req);
  } catch (error) {
    console.error("NextAuth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
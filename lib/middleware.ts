import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import rateLimiter from './rateLimiter';

export async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function withProtection(req: Request) {
  // Rate limiting check
  const rateLimitResult = await rateLimiter(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Session validation
  const session = await validateSession();
  if ('error' in session) return session;
  
  return null;
}
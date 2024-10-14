import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    // Add any other user properties you're using
  }

  interface Session extends DefaultSession {
    user: User;
    // Add any custom session properties
  }

  interface Account {
    provider: string;
    type: string;
    // Add any custom account properties
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    // Add any other properties you're including in the JWT
  }
}
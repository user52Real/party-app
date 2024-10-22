import { connectDB } from "./db";
import User from "../models/User";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { LRUCache } from 'lru-cache';
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomToken extends JWT {
  id: string; 
}

interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  image?: string;
}

type CachedUser = {
  _id: string;
  email: string;
  password: string;
  name: string;
  image?: string;
};

// Establish database connection when server starts
connectDB().catch(console.error);

// Simple in-memory cache for user data
const userCache = new LRUCache<string, CachedUser>({ max: 100, ttl: 1000 * 60 * 5 }); // 5 minutes TTL

// Simple rate limiting
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Starting authorization process");
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Rate limiting
        const now = Date.now();
        const attempt = loginAttempts.get(credentials.email) || { count: 0, lastAttempt: 0 };
        if (now - attempt.lastAttempt < 60000 && attempt.count >= 5) { // 1 minute, 5 attempts
          throw new Error("Too many login attempts. Please try again later.");
        }
        loginAttempts.set(credentials.email, { count: attempt.count + 1, lastAttempt: now });

        // Check cache first
        const cachedUser = userCache.get(credentials.email);
        let user: UserDocument | null = null;

        if (!cachedUser) {
          console.log("User not in cache, querying database");
          const foundUser = await User.findOne({ email: credentials.email }).select("+password");
          if (foundUser) {
            user = foundUser as UserDocument;
            const cachedUserData: CachedUser = {
              _id: user._id.toString(),
              email: user.email,
              password: user.password,
              name: user.name,
              image: user.image
            };
            userCache.set(credentials.email, cachedUserData);
          }
        } else {
          user = cachedUser as UserDocument;
        }

        if (!user) {
          console.log("User not found");
          throw new Error("Invalid email or password");
        }

        console.log("Comparing passwords");
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          console.log("Password mismatch");
          throw new Error("Invalid email or password");
        }

        console.log("Authorization successful");
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.image || "/placeholder.svg?height=32&width=32", 
        };
      }    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const customToken = token as CustomToken;
      if (customToken) {
        session.user.id = customToken.id; 
      }
      return session;
    },
    async jwt({ token, user }) {
      const customToken = token as CustomToken;
      if (user) {
        customToken.id = user.id; 
      }
      return customToken;
    },
  },
  session: {
    strategy: "jwt",
  },
};
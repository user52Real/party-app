import { connectDB } from "./db";
import User from "../models/User";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { LRUCache } from 'lru-cache';
import CredentialsProvider from "next-auth/providers/credentials";
import { Document, Types } from 'mongoose';
import Tokens from 'csrf';
import pino from 'pino';

const tokens = new Tokens();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

interface CustomToken extends JWT {
  id: string;
}

interface UserDocument extends Document {
  _id: Types.ObjectId;
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

// Database connection management
async function getDatabaseConnection() {
  try {
    await connectDB();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection error:', error);
    throw new Error('Database connection failed');
  }
}

getDatabaseConnection();

// In-memory cache for user data
const userCache = new LRUCache<string, CachedUser>({ max: 100, ttl: 1000 * 60 * 5 }); // 5 minutes TTL

// Rate limiting map
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        logger.info("Starting authorization process");

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Rate limiting logic
        const now = Date.now();
        const attempt = loginAttempts.get(credentials.email) || { count: 0, lastAttempt: 0 };
        if (now - attempt.lastAttempt < 60000 && attempt.count >= 5) {
          throw new Error("Too many login attempts. Please try again later.");
        }
        loginAttempts.set(credentials.email, { count: attempt.count + 1, lastAttempt: now });

        // Check cache first
        let user = userCache.get(credentials.email);

        if (!user) {
          logger.info("User not in cache, querying database");
          const foundUser = await User.findOne({ email: credentials.email }).select("+password");
          if (foundUser) {
            user = {
              _id: foundUser._id.toString(),
              email: foundUser.email,
              password: foundUser.password,
              name: foundUser.name,
              image: foundUser.image || undefined,
            };
            userCache.set(credentials.email, user);
          }
        }

        if (!user) {
          logger.warn("User not found");
          throw new Error("Invalid email or password");
        }

        logger.info("Comparing passwords");
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          logger.warn("Password mismatch");
          throw new Error("Invalid email or password");
        }

        logger.info("Authorization successful");
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
      if (customToken && session.user) {
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
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/auth/error',
  },
};
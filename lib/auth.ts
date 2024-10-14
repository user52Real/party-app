import { connectDB } from "./db";
import User from "../models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

interface CustomToken extends JWT {
  id: string; 
}

export const authOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({
            email: credentials?.email,
        }).select("+password");
        
        if (!user) throw new Error("Wrong Email");
        
        const passwordMatch = await bcrypt.compare(
            credentials!.password,
            user.password
        );
    
        if (!passwordMatch) throw new Error("Wrong Password");
        
        // Return user data including ID
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.image || "/placeholder.svg?height=32&width=32", 
        };
      }
    }),
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

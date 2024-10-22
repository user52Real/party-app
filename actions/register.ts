"use server"
import { connectDB } from "@/lib/db";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { RegisterValues } from "@/types/types";

export const register = async (values: RegisterValues) => {
    const { email, password, name } = values;
    try {
        await connectDB();
        const userFound = await User.findOne({ email });
        if (userFound) {
            return {
                error: 'Email already exists!'
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        return { success: true };
    } catch (e) {
        console.error("Registration error:", e);
        return { error: 'An error occurred during registration. Please try again.' };
    }
};
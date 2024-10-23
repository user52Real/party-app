"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            
            if (res?.error) {
                setError(res.error);
            } else if (res?.ok) {
                router.push("/dashboard");
            }
        } catch (error) {
            setError(`${error}An unexpected error occurred. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-black to-white text-black">
            <form
                className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-4 
                border border-solid border-black text-black rounded bg-gradient-to-br from-yellow-200 via-black to-white"
                onSubmit={handleSubmit}>
                {error && <div className="text-red-500 bg-red-100 p-2 rounded w-full text-center">{error}</div>}
                <img src="/images/logo.png" alt="Logo" className="w-45 h-60 mx-auto m-4 rounded-full shadow-lg shadow-white"/>
                <h1 className="mb-5 w-full text-2xl font-bold text-white text-center">Login</h1>
                <div className="w-full">
                    <label htmlFor="email" className="text-sm text-white">Email</label>
                    <Input
                        type="email"
                        id="email"
                        placeholder="email@example.com"
                        className="w-full h-10 border border-solid border-black rounded p-2 placeholder:text-black text-black bg-white"
                        name="email"
                        aria-label="Email"
                        required
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="password" className="text-sm text-white">Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            className="w-full h-10 border border-solid border-black rounded p-2 pr-10 placeholder:text-black text-black bg-white"
                            name="password"
                            aria-label="Password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <Button 
                    type="submit" 
                    className="w-50% bg-black text-white hover:bg-white hover:text-black transition-colors duration-300 mt-4 py-6 px-12"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Link
                    href="/register"
                    className="text-md text-white transition duration-150 ease hover:text-black placeholder:text-black"
                >
                    Do not have an account?
                </Link>
            </form>
        </section>
    );
}
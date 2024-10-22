"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const res = await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirect: false,
        });
        if (res?.error) {
          setError(res.error as string);
        }
        if (res?.ok) {
          return router.push("/");;
        }
    };
    return (
        <section className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-black to-white text-black">
          <form
            className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
            border border-solid border-black bg-white text-black rounded bg-gradient-to-br from-yellow-200 via-black to-white"
            onSubmit={handleSubmit}>
            {error && <div className="text-black">{error}</div>}
            <img src="/images/logo.png" alt="Logo" className="w-45 h-60 mx-auto m-4 rounded-full shadow-lg shadow-black"/>
            <h1 className="mb-5 w-full text-2xl font-bold text-white text-center">Login</h1>
            <label className="w-full text-sm text-white">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full h-8 border border-solid border-black rounded p-2 placeholder:text-black"
              name="email" />
            <label className="w-full text-sm text-white">Password</label>
            <div className="flex w-full">
              <input
                type="password"
                placeholder="Password"
                className="w-full h-8 border border-solid border-black rounded p-2 placeholder:text-black"
                name="password" />
            </div>
            <button className="w-full border border-solid border-black rounded text-white hover:bg-black placeholder:text-black mt-6 p-2">
              Login
            </button>
            <Link
              href="/register"
              className="text-md text-white transition duration-150 ease hover:text-black placeholder:text-black">
              Do not have an account?
            </Link>
          </form>
        </section>
    );
};


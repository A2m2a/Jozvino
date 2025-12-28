'use client';

import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-indigo-500 to-blue-500 overflow-hidden text-white">
      
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/5e/36/f8/5e36f863e6b51640ad6fb656f527ec22.jpg')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/50"></div>

      {/* Forgot password form */}
      <form
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md p-10 bg-blue/20 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-green-400 to-green-500">
          RESET
        </h1>

        <p className="text-center text-indigo-200 text-sm">
          Enter your email to receive a password reset link
        </p>

        <div className="relative">
          <FaUser className="absolute top-3 left-4 text-indigo-300" />
          <input
            type="email"
            placeholder="Email Address"
            className="pl-12 py-3 w-full bg-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-indigo-200"
          />
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-green-500 to-indigo-500 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-500">
          Send Reset Link
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="block mx-auto text-sm text-indigo-200 underline"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please compelet the box");
      return;
    }

    // 🔹 Backend هنوز آماده نیست
    router.push("/user_dashboard");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-indigo-500 to-blue-500 overflow-hidden text-white">
      {/* تصویر پس‌زمینه */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-background"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/5e/36/f8/5e36f863e6b51640ad6fb656f527ec22.jpg')", // لینک تصویر نمونه
        }}
      ></div>

      {/* پوشش تیره شفاف */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* فرم لاگین */}
      <form
        onSubmit={handleLogin}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md p-10 bg-blue/20 backdrop-blur-lg rounded-3xl border border-white/20 border-opacity-70 shadow-xl space-y-6`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-green-400 to-green-500">
LOGIN          </h1>
        </div>
        {error && (
          <p className="text-red-600 text-center font-larg">{error}</p>
        )}
        <div className="relative">
          <FaUser className="absolute top-3 left-4 text-indigo-300" />
          <input
            type="email"
            placeholder="Email Address"
            className="pl-12 py-3 w-full bg-white/20 backdrop-blur-md rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-indigo-200 transition duration-300 shadow-lg hover:shadow-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <FaLock className="absolute top-3 left-4 text-indigo-400" />
          <input
            type="password"
            placeholder="Password"
            className="pl-12 py-3 w-full bg-white/20 backdrop-blur-md rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-indigo-200 transition duration-300 shadow-lg hover:shadow-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-500 to-indigo-500 rounded-xl text-white font-bold hover:scale-105 transform transition-transform duration-300 shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-500"
        >
          Sign In
        </button>
        <div className="flex justify-between text-sm mt-3">
          <button
            type="button"
            onClick={() => router.push("/forgot_password")}
            className="text-indigo-300 hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-indigo-300 hover:underline"
          >
            Sign Up
          </button>
        </div>
      </form>

      <style jsx>{`
        .blur-background {
          filter: blur(0px);
        }
      `}</style>
    </div>
  );
}
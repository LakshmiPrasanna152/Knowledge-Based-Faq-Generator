import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // EMAIL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // SAVE USER EMAIL
      localStorage.setItem("userEmail", email);

      alert("Login Successful");

      navigate("/chatbot");
    } catch (error) {
      alert(error.message);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        provider
      );

      // SAVE GOOGLE USER EMAIL
      localStorage.setItem(
        "userEmail",
        result.user.email
      );

      alert("Google Login Successful");

      navigate("/chatbot");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-10">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          Login
        </h1>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-xl text-lg font-semibold"
          >
            Login
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-gray-300"></div>

          <p className="text-gray-500 font-medium">
            OR
          </p>

          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 hover:bg-gray-100 transition py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="google"
            className="w-6 h-6"
          />

          Sign In with Google
        </button>

        {/* SIGNUP */}
        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
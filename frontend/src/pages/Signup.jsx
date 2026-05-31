import React, { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "../firebase";

import { useNavigate, Link } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

export default function Signup() {

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================
  // EMAIL SIGNUP
  // =========================

  const handleSignup = async (e) => {

    e.preventDefault();

    setError("");

    setMessage("");

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // SAVE EMAIL
      localStorage.setItem(
        "userEmail",
        email
      );

      // SUCCESS MESSAGE
      setMessage(
        "Account created successfully!"
      );

      // REDIRECT
      setTimeout(() => {

        navigate("/login");

      }, 2000);

    } catch (err) {

      console.log(err);

      setError(err.message);
    }
  };

  // =========================
  // GOOGLE SIGNUP
  // =========================

  const handleGoogleSignup =
    async () => {

      try {

        const result =
          await signInWithPopup(
            auth,
            provider
          );

        localStorage.setItem(
          "userEmail",
          result.user.email
        );

        setMessage(
          " Account created successfully!"
        );

        setTimeout(() => {

          navigate("/login");

        }, 2000);

      } catch (err) {

        console.log(err);

        setError(err.message);
      }
    };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7fc] px-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10 border border-gray-200">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-3">

          Create Account

        </h1>

        <p className="text-center text-gray-500 mb-8">

          Sign up to access the AI FAQ platform

        </p>

        {/* SUCCESS MESSAGE */}
        {message && (

          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center font-semibold">

            {message}

          </div>

        )}

        {/* ERROR MESSAGE */}
        {error && (

          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-center text-sm">

            {error}

          </div>

        )}

        {/* FORM */}
        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {/* SIGNUP BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-xl font-semibold text-lg"
          >
            Sign Up
          </button>

        </form>

        {/* OR */}
        <div className="flex items-center my-6">

          <div className="flex-1 border-t border-gray-300"></div>

          <span className="px-4 text-gray-400">
            OR
          </span>

          <div className="flex-1 border-t border-gray-300"></div>

        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleSignup}
          className="w-full border border-gray-300 hover:bg-gray-50 transition py-4 rounded-xl flex items-center justify-center gap-3 font-medium"
        >

          <FcGoogle size={24} />

          Sign Up with Google

        </button>

        {/* LOGIN LINK */}
        <p className="text-center mt-8 text-gray-500">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}
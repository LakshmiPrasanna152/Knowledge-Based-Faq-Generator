import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f7fc]">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-white border-b border-gray-200 px-16 py-5 flex justify-between items-center shadow-sm">

        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            Knowledge-Based FAQ
          </h1>
        </div>

        <div className="flex gap-5">

          <Link to="/login">
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300">
              Sign Up
            </button>
          </Link>

        </div>

      </nav>

      {/* ================= HERO SECTION ================= */}

      <section className="text-center py-28 px-6">

        <h1 className="text-7xl font-extrabold leading-tight text-[#14213d]">

          AI-Powered{" "}

          <span className="text-blue-600">
            FAQ
          </span>

          <br />

          Generation Platform

        </h1>

        <p className="text-3xl text-gray-500 max-w-5xl mx-auto mt-10 leading-relaxed">

          Upload business documents, PDFs, DOCX files, reports,
          company policies, product manuals, and text content
          to automatically generate intelligent FAQ sections
          using advanced AI and Large Language Models.

        </p>

        <div className="flex justify-center gap-8 mt-16 flex-wrap">

          <Link to="/signup">

            <button className="bg-blue-600 text-white px-14 py-5 rounded-2xl text-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg">

              Get Started

            </button>

          </Link>

          <Link to="/login">

            <button className="border-2 border-blue-600 text-blue-600 px-14 py-5 rounded-2xl text-2xl font-semibold hover:bg-blue-50 transition-all duration-300">

              Login

            </button>

          </Link>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="px-16 pb-24">

        <h2 className="text-5xl font-bold text-center text-[#14213d] mb-20">

          How Knowledge-Based FAQ Works

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* CARD 1 */}

          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center hover:shadow-xl transition-all duration-300">

            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8">
              📄
            </div>

            <h3 className="text-3xl font-bold mb-6 text-[#14213d]">
              Upload Documents
            </h3>

            <p className="text-gray-500 text-xl leading-relaxed">

              Upload PDFs, DOCX, TXT, business reports,
              manuals, and company documents securely.

            </p>

          </div>

          {/* CARD 2 */}

          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center hover:shadow-xl transition-all duration-300">

            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8">
              🤖
            </div>

            <h3 className="text-3xl font-bold mb-6 text-[#14213d]">
              AI Analysis
            </h3>

            <p className="text-gray-500 text-xl leading-relaxed">

              Advanced AI analyzes uploaded business files
              and understands important information instantly.

            </p>

          </div>

          {/* CARD 3 */}

          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center hover:shadow-xl transition-all duration-300">

            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8">
              💬
            </div>

            <h3 className="text-3xl font-bold mb-6 text-[#14213d]">
              AI Chatbot
            </h3>

            <p className="text-gray-500 text-xl leading-relaxed">

              Ask questions about uploaded files using the
              intelligent AI chatbot assistant.

            </p>

          </div>

          {/* CARD 4 */}

          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center hover:shadow-xl transition-all duration-300">

            <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8">
              ⚡
            </div>

            <h3 className="text-3xl font-bold mb-6 text-[#14213d]">
              FAQ Generation
            </h3>

            <p className="text-gray-500 text-xl leading-relaxed">

              Generate professional FAQ sections automatically
              within seconds using AI technology.

            </p>

          </div>

          {/* CARD 5 */}

          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center hover:shadow-xl transition-all duration-300">

            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8">
              🔒
            </div>

            <h3 className="text-3xl font-bold mb-6 text-[#14213d]">
              Secure Storage
            </h3>

            <p className="text-gray-500 text-xl leading-relaxed">

              All uploaded business documents are securely stored
              and protected with cloud authentication.

            </p>

          </div>

          {/* CARD 6 */}

          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center hover:shadow-xl transition-all duration-300">

            <div className="w-20 h-20 bg-cyan-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8">
              📚
            </div>

            <h3 className="text-3xl font-bold mb-6 text-[#14213d]">
              Chat & FAQ History
            </h3>

            <p className="text-gray-500 text-xl leading-relaxed">

              View saved AI chats and previously generated FAQs
              anytime from your dashboard.

            </p>

          </div>

        </div>

      </section>

      {/* ================= FEATURES SECTION ================= */}

      <section className="bg-white py-24 px-16">

        <h2 className="text-5xl font-bold text-center text-[#14213d] mb-20">

          Platform Features

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-[#f4f7fc] rounded-3xl p-8 text-center">

            <div className="text-5xl mb-6">🧠</div>

            <h3 className="text-2xl font-bold text-[#14213d] mb-4">
              Smart AI
            </h3>

            <p className="text-gray-500 text-lg">
              AI-powered understanding of business content.
            </p>

          </div>

          <div className="bg-[#f4f7fc] rounded-3xl p-8 text-center">

            <div className="text-5xl mb-6">📂</div>

            <h3 className="text-2xl font-bold text-[#14213d] mb-4">
              Multi File Support
            </h3>

            <p className="text-gray-500 text-lg">
              Upload PDF, DOCX, TXT and business reports.
            </p>

          </div>

          <div className="bg-[#f4f7fc] rounded-3xl p-8 text-center">

            <div className="text-5xl mb-6">⚡</div>

            <h3 className="text-2xl font-bold text-[#14213d] mb-4">
              Fast Responses
            </h3>

            <p className="text-gray-500 text-lg">
              Real-time AI chatbot answers instantly.
            </p>

          </div>

          <div className="bg-[#f4f7fc] rounded-3xl p-8 text-center">

            <div className="text-5xl mb-6">☁️</div>

            <h3 className="text-2xl font-bold text-[#14213d] mb-4">
              Cloud Access
            </h3>

            <p className="text-gray-500 text-lg">
              Access your FAQs and chats from anywhere.
            </p>

          </div>

        </div>

      </section>

      {/* ================= CTA SECTION ================= */}

      <section className="py-28 text-center px-6">

        <h2 className="text-6xl font-bold text-[#14213d] leading-tight">

          Start Generating FAQs <br />

          With AI Today

        </h2>

        <p className="text-2xl text-gray-500 mt-8 max-w-4xl mx-auto">

          Save time and automate business FAQ creation
          using intelligent AI document understanding.

        </p>

        <div className="mt-14">

          <Link to="/signup">

            <button className="bg-blue-600 text-white px-16 py-5 rounded-2xl text-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-xl">

              Create Free Account

            </button>

          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-[#13213d] text-white py-14 text-center">

        <p className="text-2xl mb-5 font-semibold">

          © 2026 Knowledge-Based FAQ Generator

        </p>

        <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">

          AI-powered business document understanding and
          automated FAQ generation platform built using
          Large Language Models and intelligent chatbot technology.

        </p>

      </footer>

    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useTheme } from "../ThemeContext";
import { ThemeToggle } from "./Home";
import Logo from "../components/Logo";
import { FiZap, FiMail, FiLock, FiUser, FiArrowRight, FiCheck } from "react-icons/fi";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{display:"block"}}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userEmail", email);
      setMessage("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, ""));
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true); setError(""); setMessage("");
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("userEmail", result.user.email);
      setMessage("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex ${dark ? "dark bg-[#0f172a]" : "bg-[#f4f7fc]"}`}>

      {/* ── Right branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#13213d] to-[#1e3a7b] flex-col justify-between p-12 order-last relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-0 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <Logo size="sm" theme="dark" />

        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug mb-4">
            Everything you need<br />
            to automate your<br />
            <span className="text-blue-400">FAQ workflow</span>
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-sm mb-8">
            Join the platform and start transforming business documents into structured, AI-generated FAQs.
          </p>
          <div className="space-y-3">
            {[
              "Free to get started",
              "Upload unlimited documents",
              "Export in any format",
              "Quiz mode to test knowledge",
              "Tone rewriting & comparison tools",
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-blue-100 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center shrink-0">
                  <FiCheck size={10} className="text-green-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300/60 text-xs">© 2026 Knowledge-Based FAQ Generator</p>
      </div>

      {/* ── Form panel ── */}
      <div className={`flex-1 flex flex-col justify-center items-center px-6 py-12 relative ${dark ? "bg-[#0f172a]" : "bg-[#f4f7fc]"}`}>

        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>

        <div className={`w-full max-w-md rounded-2xl p-8 border shadow-sm
          ${dark ? "bg-slate-800/70 border-slate-700" : "bg-white border-gray-200"}`}>

          <div className="flex lg:hidden items-center gap-2 mb-6">
            <Logo size="sm" theme={dark ? "dark" : "light"} />
          </div>

          <h1 className={`text-2xl font-bold mb-1 ${dark ? "text-white" : "text-[#14213d]"}`}>Create your account</h1>
          <p className={`text-sm mb-7 ${dark ? "text-slate-400" : "text-gray-500"}`}>
            Start generating AI-powered FAQs for free
          </p>

          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              <FiCheck size={13} /> {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <FiUser className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-gray-400"}`} size={15} />
              <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition
                  ${dark ? "bg-slate-900/60 border-slate-600 text-white placeholder-slate-500" : "bg-gray-50 border-gray-200 text-[#14213d] placeholder-gray-400"}`} />
            </div>
            <div className="relative">
              <FiMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-gray-400"}`} size={15} />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition
                  ${dark ? "bg-slate-900/60 border-slate-600 text-white placeholder-slate-500" : "bg-gray-50 border-gray-200 text-[#14213d] placeholder-gray-400"}`} />
            </div>
            <div className="relative">
              <FiLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-gray-400"}`} size={15} />
              <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition
                  ${dark ? "bg-slate-900/60 border-slate-600 text-white placeholder-slate-500" : "bg-gray-50 border-gray-200 text-[#14213d] placeholder-gray-400"}`} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-blue-600/20">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><FiArrowRight size={14} /></>}
            </button>
          </form>

          <div className={`flex items-center gap-3 my-5`}>
            <div className={`flex-1 h-px ${dark ? "bg-slate-700" : "bg-gray-200"}`} />
            <span className={`text-xs font-medium ${dark ? "text-slate-500" : "text-gray-400"}`}>OR</span>
            <div className={`flex-1 h-px ${dark ? "bg-slate-700" : "bg-gray-200"}`} />
          </div>

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleGoogleSignup(); }} disabled={loading}
            className={`w-full border py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition
              ${dark ? "border-slate-600 text-slate-200 hover:bg-slate-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            <GoogleIcon /> Continue with Google
          </button>

          <p className={`text-center text-xs mt-6 ${dark ? "text-slate-500" : "text-gray-500"}`}>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
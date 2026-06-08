import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useTheme } from "../ThemeContext";
import { ThemeToggle } from "./Home";
import Logo from "../components/Logo";
import { FiZap, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

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

export default function Login() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true); setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("userEmail", result.user.email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex ${dark ? "dark bg-[#0f172a]" : "bg-[#f4f7fc]"}`}>

      {/* ── Left panel (branding) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#13213d] to-[#1e3a7b] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <Logo size="sm" theme="dark" />

        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug mb-4">
            Turn Documents into<br />
            <span className="text-blue-400">Smart FAQs</span> Instantly
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-sm mb-8">
            Upload any business document and let AI generate structured, professional FAQ sections in seconds.
          </p>
          <div className="space-y-3">
            {["AI-powered FAQ generation", "Document chat & analysis", "Export to HTML, JSON, TXT", "Keyword extraction & quiz mode"].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-blue-100 text-sm">
                <div className="w-4 h-4 rounded-full bg-blue-500/30 border border-blue-400/50 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300/60 text-xs">© 2026 Knowledge-Based FAQ Generator</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className={`flex-1 flex flex-col justify-center items-center px-6 py-12 relative ${dark ? "bg-[#0f172a]" : "bg-[#f4f7fc]"}`}>

        {/* Theme toggle top-right */}
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>

        <div className={`w-full max-w-md rounded-2xl p-8 border shadow-sm
          ${dark ? "bg-slate-800/70 border-slate-700" : "bg-white border-gray-200"}`}>

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <Logo size="sm" theme={dark ? "dark" : "light"} />
          </div>

          <h1 className={`text-2xl font-bold mb-1 ${dark ? "text-white" : "text-[#14213d]"}`}>Welcome back</h1>
          <p className={`text-sm mb-7 ${dark ? "text-slate-400" : "text-gray-500"}`}>
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <FiMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-gray-400"}`} size={15} />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition
                  ${dark ? "bg-slate-900/60 border-slate-600 text-white placeholder-slate-500" : "bg-gray-50 border-gray-200 text-[#14213d] placeholder-gray-400"}`} />
            </div>
            <div className="relative">
              <FiLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-gray-400"}`} size={15} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition
                  ${dark ? "bg-slate-900/60 border-slate-600 text-white placeholder-slate-500" : "bg-gray-50 border-gray-200 text-[#14213d] placeholder-gray-400"}`} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition shadow-sm shadow-blue-600/20">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><FiArrowRight size={14} /></>}
            </button>
          </form>

          <div className={`flex items-center gap-3 my-5 ${dark ? "text-slate-600" : "text-gray-300"}`}>
            <div className="flex-1 h-px bg-current" />
            <span className={`text-xs font-medium ${dark ? "text-slate-500" : "text-gray-400"}`}>OR</span>
            <div className="flex-1 h-px bg-current" />
          </div>

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleGoogleLogin(); }} disabled={loading}
            className={`w-full border py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition
              ${dark ? "border-slate-600 text-slate-200 hover:bg-slate-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            <GoogleIcon /> Continue with Google
          </button>

          <p className={`text-center text-xs mt-6 ${dark ? "text-slate-500" : "text-gray-500"}`}>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
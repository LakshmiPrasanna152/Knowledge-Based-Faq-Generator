import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX, FiArrowRight, FiCheck, FiZap, FiShield, FiGlobe, FiFileText, FiMessageSquare, FiBarChart2 } from "react-icons/fi";
import Logo from "../components/Logo";

// ── Dark-mode toggle button (reused across pages) ─────────
export function ThemeToggle({ className = "" }) {
  const { dark, setDark } = useTheme();
  return (
    <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
        ${dark ? "bg-slate-700 text-yellow-400 hover:bg-slate-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
        ${className}`}>
      {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  );
}

const FEATURES = [
  { icon: <FiFileText size={20} />, color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600", title: "Upload Documents", desc: "PDF, DOCX, TXT, and business reports processed securely in seconds." },
  { icon: <FiZap size={20} />, color: "bg-purple-100 dark:bg-purple-900/40 text-purple-600", title: "AI FAQ Generation", desc: "Auto-generate professional FAQ sections from any business document." },
  { icon: <FiMessageSquare size={20} />, color: "bg-green-100 dark:bg-green-900/40 text-green-600", title: "Smart AI Chat", desc: "Ask questions about your documents using an intelligent AI assistant." },
  { icon: <FiBarChart2 size={20} />, color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600", title: "Doc Analyzer", desc: "Get executive summaries, keyword extractions, and document insights." },
  { icon: <FiShield size={20} />, color: "bg-red-100 dark:bg-red-900/40 text-red-600", title: "Secure Storage", desc: "All files protected with cloud authentication and encrypted storage." },
  { icon: <FiGlobe size={20} />, color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600", title: "Access Anywhere", desc: "Cloud-based platform accessible from any device, anytime." },
];

const HOW_STEPS = [
  { num: "01", title: "Upload your document", desc: "Drop in any PDF, DOCX, or TXT file — company policy, product manual, report, or contract." },
  { num: "02", title: "AI processes & understands", desc: "Our LLM engine reads and comprehends the full document content in real-time." },
  { num: "03", title: "Generate FAQs instantly", desc: "Get a structured, professional FAQ section tailored to your document in seconds." },
  { num: "04", title: "Export & integrate", desc: "Download as TXT, JSON, or styled HTML, then embed directly into your website or support portal." },
];

const STATS = [
  { value: "10x", label: "Faster than manual FAQ writing" },
  { value: "95%", label: "Accuracy on business documents" },
  { value: "5+", label: "Export formats supported" },
  { value: "∞", label: "Documents you can process" },
];

export default function Home() {
  const { dark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`min-h-screen ${dark ? "dark bg-[#0f172a] text-slate-100" : "bg-[#f4f7fc] text-[#14213d]"}`}>

      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-3.5 flex justify-between items-center transition-all duration-300
        ${scrolled
          ? dark ? "bg-[#0f172a]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-slate-800" : "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
          : dark ? "bg-transparent" : "bg-transparent"}`}>

        {/* Logo */}
        <Logo size="sm" theme={dark ? "dark" : "light"} />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className={`text-sm font-medium transition hover:text-blue-600 ${dark ? "text-slate-300" : "text-gray-600"}`}>Features</a>
          <a href="#how" className={`text-sm font-medium transition hover:text-blue-600 ${dark ? "text-slate-300" : "text-gray-600"}`}>How It Works</a>
          <a href="#metrics" className={`text-sm font-medium transition hover:text-blue-600 ${dark ? "text-slate-300" : "text-gray-600"}`}>Metrics</a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="hidden md:block">
            <button className={`text-sm font-semibold px-4 py-2 rounded-lg border transition
              ${dark ? "border-slate-600 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm">
              Get Started
            </button>
          </Link>
          {/* Mobile menu btn */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg">
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className={`fixed top-14 left-0 right-0 z-40 px-6 py-4 flex flex-col gap-3 border-b shadow-lg
          ${dark ? "bg-[#0f172a] border-slate-800" : "bg-white border-gray-200"}`}>
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2">Features</a>
          <a href="#how" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2">How It Works</a>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 text-blue-600">Login</Link>
        </div>
      )}

      {/* ── HERO ────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 md:px-12 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none
          ${dark ? "bg-blue-600" : "bg-blue-400"}`} />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border text-xs font-semibold
          bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse inline-block" />
          AI-Powered Document Intelligence
        </div>

        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl mx-auto mb-5
          ${dark ? "text-white" : "text-[#14213d]"}`}>
          Generate Smart FAQs<br />
          from <span className="text-blue-600">Any Document</span>
        </h1>

        <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10
          ${dark ? "text-slate-400" : "text-gray-500"}`}>
          Upload business documents, reports, manuals, or policies — and instantly get
          structured FAQ sections, AI-powered summaries, and keyword insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link to="/signup">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-600/25">
              Start for Free <FiArrowRight size={15} />
            </button>
          </Link>
          <Link to="/login">
            <button className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border transition
              ${dark ? "border-slate-600 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              Sign In
            </button>
          </Link>
        </div>

        {/* Hero mockup strip */}
        <div className={`inline-flex items-center gap-2 flex-wrap justify-center px-5 py-3 rounded-2xl text-xs font-medium border
          ${dark ? "bg-slate-800/80 border-slate-700 text-slate-300" : "bg-white border-gray-200 text-gray-600 shadow-sm"}`}>
          {["✅ PDF & DOCX Support", "✅ AI-Powered", "✅ Export to HTML / JSON", "✅ Keyword Extractor", "✅ Quiz Mode"].map(f => (
            <span key={f} className="px-2">{f}</span>
          ))}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section id="metrics" className={`py-14 px-6 md:px-12 border-y ${dark ? "border-slate-800 bg-slate-900/50" : "border-gray-200 bg-white"}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">{s.value}</p>
              <p className={`text-xs md:text-sm font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section id="features" className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${dark ? "text-white" : "text-[#14213d]"}`}>Everything You Need</h2>
            <p className={`text-sm md:text-base max-w-xl mx-auto ${dark ? "text-slate-400" : "text-gray-500"}`}>
              A complete AI toolkit for transforming raw business documents into organized, actionable knowledge.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                  ${dark ? "bg-slate-800/60 border-slate-700/60 hover:border-blue-500/40 hover:bg-slate-800" : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-blue-50"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className={`font-bold text-sm mb-2 ${dark ? "text-white" : "text-[#14213d]"}`}>{f.title}</h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-gray-500"}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how" className={`py-20 px-6 md:px-12 ${dark ? "bg-slate-900/50" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3"></p>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${dark ? "text-white" : "text-[#14213d]"}`}>How It Works</h2>
            <p className={`text-sm md:text-base max-w-xl mx-auto ${dark ? "text-slate-400" : "text-gray-500"}`}>
              From document upload to exported FAQ in four simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className={`relative p-6 rounded-2xl border
                ${dark ? "bg-slate-800/60 border-slate-700/60" : "bg-[#f4f7fc] border-gray-100"}`}>
                {i < HOW_STEPS.length - 1 && (
                  <div className={`hidden lg:block absolute top-10 -right-3 w-6 h-0.5 ${dark ? "bg-slate-600" : "bg-gray-300"}`} />
                )}
                <span className="text-3xl font-black text-blue-600/30 mb-4 block">{s.num}</span>
                <h3 className={`font-bold text-sm mb-2 ${dark ? "text-white" : "text-[#14213d]"}`}>{s.title}</h3>
                <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-gray-500"}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`rounded-3xl p-10 md:p-14 border relative overflow-hidden
            ${dark ? "bg-gradient-to-br from-blue-950 to-slate-900 border-blue-900/50" : "bg-gradient-to-br from-[#13213d] to-[#1e3a7b] border-blue-900"}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-snug">
              Start Generating FAQs<br />with AI Today
            </h2>
            <p className="text-blue-200 text-sm md:text-base mb-8 max-w-md mx-auto">
              Save hours of manual work. Let AI handle the heavy lifting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition shadow-lg">
                  Create Free Account <FiArrowRight size={14} />
                </button>
              </Link>
              <Link to="/login">
                <button className="flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-semibold text-sm transition">
                  Sign In
                </button>
              </Link>
            </div>
            {/* trust badges */}
            <div className="flex flex-wrap justify-center gap-5 mt-8">
              {["No credit card required", "Works with any document", "Export in multiple formats"].map(b => (
                <div key={b} className="flex items-center gap-1.5 text-blue-200 text-xs">
                  <FiCheck size={12} className="text-green-400 shrink-0" /> {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className={`border-t py-10 px-6 md:px-12 ${dark ? "bg-[#0f172a] border-slate-800" : "bg-[#13213d] border-transparent"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" theme="dark" />
          </div>
          <p className="text-gray-400 text-xs text-center">
            © 2026 Knowledge-Based FAQ Generator · AI-powered document understanding platform
          </p>
          
        </div>
      </footer>
    </div>
  );
}
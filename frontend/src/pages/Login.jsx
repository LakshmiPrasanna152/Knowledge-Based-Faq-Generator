import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useTheme } from "../ThemeContext";
import { ThemeToggle } from "./Home";
import Logo from "../components/Logo";
import {
  FiMail, FiLock, FiArrowRight,
  FiAlertCircle, FiEye, FiEyeOff,
} from "react-icons/fi";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ display:"block", flexShrink:0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function Spinner() {
  return <span style={{ width:16, height:16, flexShrink:0, border:"2px solid rgba(255,255,255,0.35)", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.75s linear infinite" }} />;
}
function SpinnerBlue() {
  return <span style={{ width:16, height:16, flexShrink:0, border:"2px solid rgba(37,99,235,0.2)", borderTop:"2px solid #2563eb", borderRadius:"50%", display:"inline-block", animation:"spin 0.75s linear infinite" }} />;
}

/* ════════════════════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [formLoad, setFormLoad] = useState(false);
  const [gLoad,    setGLoad]    = useState(false);
  const [error,    setError]    = useState("");

  /* colours */
  const bg         = dark ? "#0f172a" : "#f4f7fc";
  const card       = dark ? "#1e293b" : "#ffffff";
  const cardBorder = dark ? "#334155" : "#e5e7eb";
  const text       = dark ? "#f1f5f9" : "#14213d";
  const muted      = dark ? "#94a3b8" : "#6b7280";
  const inputBg    = dark ? "#0f172a" : "#f9fafb";
  const inputBd    = dark ? "#334155" : "#e5e7eb";

  const inp = {
    width:"100%", boxSizing:"border-box",
    padding:"11px 42px 11px 40px",
    fontSize:14, borderRadius:10,
    border:`1px solid ${inputBd}`,
    background:inputBg, color:text, outline:"none",
  };

  /* ── email login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim())  { setError("Please enter your email address."); return; }
    if (!password)      { setError("Please enter your password."); return; }

    setFormLoad(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      localStorage.setItem("userEmail", cred.user.email);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      const c = err.code || "";
      if      (c === "auth/user-not-found" || c === "auth/wrong-password" || c === "auth/invalid-credential")
                                                setError("Incorrect email or password.");
      else if (c === "auth/invalid-email")      setError("Please enter a valid email address.");
      else if (c === "auth/too-many-requests")  setError("Too many attempts. Please wait and try again.");
      else if (c === "auth/operation-not-allowed") setError("Email sign-in is disabled. Enable it in Firebase Console.");
      else if (c === "auth/network-request-failed") setError("Network error. Check your connection.");
      else                                      setError("Sign in failed: " + (err.message?.split("(")[0].replace("Firebase:","").trim() || "Please try again."));
    }
    setFormLoad(false);
  };

  /* ── Google login ── */
  const handleGoogle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setGLoad(true);
    try {
      const gp     = new GoogleAuthProvider();
      gp.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, gp);
      localStorage.setItem("userEmail", result.user.email);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google error:", err.code, err.message);
      const c = err.code || "";
      if (c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request") {
        /* user closed popup — silent */
      } else if (c === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups for this site and try again.");
      } else if (c === "auth/operation-not-allowed") {
        setError("Google sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
      setGLoad(false);
    }
  };

  /* ════ RENDER ════════════════════════════════════════════ */
  return (
    <div style={{ minHeight:"100vh", display:"flex", background:bg }}>

      {/* ── Left: branding ── */}
      <div className="login-panel" style={{
        width:"45%", background:"linear-gradient(135deg,#13213d 0%,#1e3a7b 100%)",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        padding:"40px 48px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(37,99,235,0.12)", filter:"blur(60px)", pointerEvents:"none" }} />

        <Logo size="md" theme="dark" />

        <div>
          <h2 style={{ color:"#fff", fontSize:"clamp(1.4rem,2.5vw,2rem)", fontWeight:800, lineHeight:1.3, marginBottom:16 }}>
            Turn Documents into{" "}
            <span style={{ color:"#93c5fd" }}>Smart FAQs</span> Instantly
          </h2>
          <p style={{ color:"#93c5fd", fontSize:14, lineHeight:1.7, marginBottom:28, maxWidth:320 }}>
            Upload any business document and let AI generate structured FAQ sections in seconds.
          </p>
          {["AI-powered FAQ generation","Document chat & analysis","Export HTML, JSON, TXT","Keyword extraction & quiz mode"].map(f => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:18, height:18, borderRadius:"50%", border:"1px solid rgba(147,197,253,0.4)", background:"rgba(37,99,235,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#93c5fd" }} />
              </div>
              <span style={{ color:"#bfdbfe", fontSize:13 }}>{f}</span>
            </div>
          ))}
        </div>

        <p style={{ color:"rgba(147,197,253,0.5)", fontSize:12 }}>© 2026 Knowledge-Based FAQ Generator</p>
      </div>

      {/* ── Right: form ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", position:"relative" }}>
        <div style={{ position:"absolute", top:16, right:16 }}><ThemeToggle /></div>

        <div style={{ width:"100%", maxWidth:440, background:card, border:`1px solid ${cardBorder}`, borderRadius:20, padding:"36px 32px" }}>

          {/* mobile logo */}
          <div className="mobile-logo" style={{ marginBottom:24 }}>
            <Logo size="sm" theme={dark ? "dark" : "light"} />
          </div>

          <h1 style={{ fontSize:22, fontWeight:700, color:text, marginBottom:6 }}>Welcome back</h1>
          <p  style={{ fontSize:13, color:muted, marginBottom:24 }}>Sign in to your account to continue</p>

          {/* error */}
          {error && (
            <div style={{ background: dark?"rgba(239,68,68,0.1)":"#fef2f2", border:`1px solid ${dark?"#7f1d1d":"#fecaca"}`, borderRadius:10, padding:"10px 14px", marginBottom:18, display:"flex", alignItems:"flex-start", gap:8 }}>
              <FiAlertCircle color="#ef4444" size={14} style={{ flexShrink:0, marginTop:1 }} />
              <span style={{ fontSize:12, color:"#ef4444", lineHeight:1.5 }}>{error}</span>
            </div>
          )}

          {/* form */}
          <form onSubmit={handleLogin} noValidate style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* email */}
            <div style={{ position:"relative" }}>
              <FiMail style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:muted, pointerEvents:"none" }} size={14} />
              <input type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email" style={inp} />
            </div>

            {/* password */}
            <div style={{ position:"relative" }}>
              <FiLock style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:muted, pointerEvents:"none" }} size={14} />
              <input type={showPass ? "text" : "password"}
                placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ ...inp, paddingRight:42 }} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:muted, padding:2, display:"flex" }}>
                {showPass ? <FiEyeOff size={14}/> : <FiEye size={14}/>}
              </button>
            </div>

            {/* submit */}
            <button type="submit" disabled={formLoad || gLoad}
              style={{
                width:"100%", padding:"12px", borderRadius:10, border:"none",
                background: formLoad ? "#93c5fd" : "#2563eb",
                color:"#fff", fontSize:14, fontWeight:600,
                cursor: formLoad || gLoad ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                transition:"background 0.2s",
              }}>
              {formLoad
                ? <><Spinner /> Signing in…</>
                : <><span>Sign In</span><FiArrowRight size={14}/></>}
            </button>
          </form>

          {/* divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"18px 0" }}>
            <div style={{ flex:1, height:1, background:cardBorder }} />
            <span style={{ fontSize:11, color:muted, fontWeight:500 }}>OR</span>
            <div style={{ flex:1, height:1, background:cardBorder }} />
          </div>

          {/* Google */}
          <button type="button" onClick={handleGoogle} disabled={formLoad || gLoad}
            style={{
              width:"100%", padding:"11px", borderRadius:10,
              border:`1px solid ${cardBorder}`,
              background: gLoad ? (dark?"#334155":"#f1f5f9") : card,
              color:text, fontSize:13, fontWeight:600,
              cursor: formLoad || gLoad ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              transition:"background 0.2s",
            }}>
            {gLoad
              ? <><SpinnerBlue /><span style={{fontSize:13,fontWeight:600}}>Loading…</span></>
              : <><GoogleIcon /> Continue with Google</>}
          </button>

          <p style={{ textAlign:"center", fontSize:12, color:muted, marginTop:20 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color:"#2563eb", fontWeight:600, textDecoration:"none" }}>Sign up for free</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .login-panel { display: none !important; } .mobile-logo { display: flex !important; } }
        @media (min-width: 769px) { .mobile-logo { display: none !important; } }
      `}</style>
    </div>
  );
}
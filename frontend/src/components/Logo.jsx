import React from "react";

/* ─────────────────────────────────────────────────────────
   KnowledgeFAQ — Option C Pill Logo
   Props:
     size   = "sm" | "md" | "lg"  (default "md")
     theme  = "dark" | "light"    (default "dark")
          dark  → wordmark text white  (sidebar / dark bg)
          light → wordmark text navy   (navbar on light bg)
   ───────────────────────────────────────────────────────── */
export default function Logo({ size = "md", theme = "dark" }) {
  const scales = {
    sm: { pill_w: 88,  pill_h: 34, rx: 17, wordSize: 13, gap: 7  },
    md: { pill_w: 108, pill_h: 42, rx: 21, wordSize: 15, gap: 9  },
    lg: { pill_w: 136, pill_h: 52, rx: 26, wordSize: 19, gap: 11 },
  };
  const s = scales[size] || scales.md;
  const wordColor = theme === "dark" ? "#ffffff" : "#1e3a7b";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.gap, userSelect: "none" }}>

      {/* Pill badge SVG */}
      <svg width={s.pill_w} height={s.pill_h} viewBox={`0 0 ${s.pill_w} ${s.pill_h}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width={s.pill_w} height={s.pill_h} rx={s.rx} fill="#1e3a7b"/>

        {/* K — sm */}
        {size === "sm" && <>
          <line x1="14" y1="9"  x2="14" y2="25" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
          <line x1="14" y1="17" x2="22" y2="9"  stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
          <line x1="14" y1="17" x2="22" y2="25" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
          <polygon points="30,9 26,18 31,18 28,25 35,16 30,16" fill="#60a5fa"/>
          <text x="58" y="18" textAnchor="middle" fontFamily="Arial" fontSize="9"  fontWeight="700" fill="white">FAQ</text>
          <text x="58" y="27" textAnchor="middle" fontFamily="Arial" fontSize="6"  fontWeight="600" fill="#93c5fd" letterSpacing="1.5">GEN</text>
        </>}

        {/* K — md */}
        {size === "md" && <>
          <line x1="17" y1="11" x2="17" y2="31" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
          <line x1="17" y1="21" x2="27" y2="11" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
          <line x1="17" y1="21" x2="27" y2="31" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
          <polygon points="37,11 32,22 38,22 35,31 43,20 37,20" fill="#60a5fa"/>
          <text x="70" y="23" textAnchor="middle" fontFamily="Arial" fontSize="12" fontWeight="700" fill="white">FAQ</text>
          <text x="70" y="34" textAnchor="middle" fontFamily="Arial" fontSize="7"  fontWeight="600" fill="#93c5fd" letterSpacing="1.5">GEN</text>
        </>}

        {/* K — lg */}
        {size === "lg" && <>
          <line x1="21" y1="13" x2="21" y2="39" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          <line x1="21" y1="26" x2="34" y2="13" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          <line x1="21" y1="26" x2="34" y2="39" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          <polygon points="46,13 40,27 47,27 44,39 54,25 47,25" fill="#60a5fa"/>
          <text x="88" y="28" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="700" fill="white">FAQ</text>
          <text x="88" y="41" textAnchor="middle" fontFamily="Arial" fontSize="8"  fontWeight="600" fill="#93c5fd" letterSpacing="2">GEN</text>
        </>}
      </svg>

      {/* Wordmark */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span style={{ fontFamily: "Arial,sans-serif", fontSize: s.wordSize, fontWeight: 700, color: wordColor, letterSpacing: "-0.3px" }}>Knowledge-Based</span>
        <span style={{ fontFamily: "Arial,sans-serif", fontSize: s.wordSize, fontWeight: 700, color: "#2563eb", letterSpacing: "-0.3px" }}>FAQ Generator</span>
      </div>
    </div>
  );
}
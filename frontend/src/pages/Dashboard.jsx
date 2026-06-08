import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import axios from "axios";
import { useTheme } from "../ThemeContext";
import { ThemeToggle } from "./Home";
import Logo from "../components/Logo";
import {
  FiPlus, FiLogOut, FiFile, FiUpload, FiMessageSquare,
  FiDownload, FiTrash2, FiChevronDown, FiChevronUp,
  FiSend, FiCopy, FiSearch, FiHome, FiClock, FiCheck,
  FiX, FiRefreshCw, FiZap, FiBarChart2, FiEdit2, FiSave,
  FiCode, FiKey, FiHelpCircle, FiAward, FiArrowUp,
  FiArrowDown, FiShuffle, FiTag, FiMenu,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://127.0.0.1:8000";

const getNameFromEmail = (email = "") =>
  email.split("@")[0].replace(/[0-9]/g,"").split(/[._]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "User";

const formatDate = (ts) => new Date(ts).toLocaleDateString("en-IN", {
  day: "2-digit", month: "short", year: "numeric",
});

const copyText = (t) => navigator.clipboard.writeText(t);

// Safely convert any AI response value to a renderable string
const safeStr = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) return val.map(safeStr).join(", ");
  if (typeof val === "object") return Object.entries(val).map(([k, v]) => `${k}: ${safeStr(v)}`).join("\n");
  return String(val);
};

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon, label, value, color, dark }) {
  return (
    <div className={`rounded-2xl p-5 border flex items-center gap-4 transition-all hover:-translate-y-0.5
      ${dark ? "bg-slate-800/70 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl shrink-0`}>{icon}</div>
      <div>
        <p className={`text-xs font-medium mb-0.5 ${dark ? "text-slate-400" : "text-gray-500"}`}>{label}</p>
        <p className={`text-2xl font-bold ${dark ? "text-white" : "text-[#14213d]"}`}>{value}</p>
      </div>
    </div>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────
function FAQAccordion({ faqs, dark }) {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);
  const copy = (idx, t) => { copyText(t); setCopied(idx); setTimeout(() => setCopied(null), 1500); };

  if (!faqs?.length) return (
    <div className="text-center py-12">
      <p className={`text-sm ${dark ? "text-slate-500" : "text-gray-400"}`}>No FAQs generated yet.</p>
    </div>
  );
  return (
    <div className="space-y-2">
      {faqs.map((faq, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
          className={`border rounded-xl overflow-hidden ${dark ? "border-slate-700" : "border-gray-200"}`}>
          <button onClick={() => setOpen(open === idx ? null : idx)}
            className={`w-full flex justify-between items-center px-5 py-4 text-left transition
              ${dark ? "bg-slate-800 hover:bg-slate-700/80" : "bg-white hover:bg-blue-50/60"}`}>
            <span className={`font-semibold text-sm flex items-center gap-3 ${dark ? "text-slate-100" : "text-[#14213d]"}`}>
              <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
              {faq.question}
            </span>
            {open === idx
              ? <FiChevronUp className="text-blue-500 shrink-0" size={15} />
              : <FiChevronDown className={`shrink-0 ${dark ? "text-slate-500" : "text-gray-400"}`} size={15} />}
          </button>
          <AnimatePresence>
            {open === idx && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className={`px-5 pb-4 pt-3 border-t ${dark ? "bg-slate-900/50 border-slate-700" : "bg-blue-50/30 border-gray-100"}`}>
                  <p className={`text-sm leading-relaxed mb-3 ${dark ? "text-slate-300" : "text-gray-600"}`}>{faq.answer}</p>
                  <button onClick={() => copy(idx, `Q: ${faq.question}\nA: ${faq.answer}`)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition ${dark ? "text-slate-500 hover:text-blue-400" : "text-gray-400 hover:text-blue-600"}`}>
                    {copied === idx ? <FiCheck size={11} className="text-green-500" /> : <FiCopy size={11} />}
                    {copied === idx ? "Copied!" : "Copy"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userName = getNameFromEmail(userEmail);
  const HISTORY_KEY = `chatHistory_${userEmail}`;
  const FAQ_KEY = `faqHistory_${userEmail}`;

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // chat
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentDocText, setCurrentDocText] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // faq
  const [faqHistory, setFaqHistory] = useState([]);
  const [activeFaqId, setActiveFaqId] = useState(null);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqFile, setFaqFile] = useState(null);
  const [faqCount, setFaqCount] = useState(10);
  const [faqGenerated, setFaqGenerated] = useState([]);

  // upload/summarize
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const uploadFileRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // editor
  const [editingFaqs, setEditingFaqs] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [htmlExported, setHtmlExported] = useState(false);

  // compare
  const [compareFile1, setCompareFile1] = useState(null);
  const [compareFile2, setCompareFile2] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareResult, setCompareResult] = useState(null);
  const compareFile1Ref = useRef(null);
  const compareFile2Ref = useRef(null);

  // keywords
  const [kwFile, setKwFile] = useState(null);
  const [kwLoading, setKwLoading] = useState(false);
  const [kwResult, setKwResult] = useState(null);
  const kwFileRef = useRef(null);

  // quiz
  const [quizFaqs, setQuizFaqs] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // tone
  const [toneFile, setToneFile] = useState(null);
  const [toneStyle, setToneStyle] = useState("formal");
  const [toneLoading, setToneLoading] = useState(false);
  const [toneResult, setToneResult] = useState(null);
  const [toneFaqCount, setToneFaqCount] = useState(5);
  const toneFileRef = useRef(null);

  useEffect(() => {
    setChatHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"));
    setFaqHistory(JSON.parse(localStorage.getItem(FAQ_KEY) || "[]"));
  }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const totalChats = chatHistory.length;
  const totalFAQs = faqHistory.reduce((a, f) => a + (f.faqs?.length || 0), 0);
  const totalDocs = [...new Set([...chatHistory.map(c => c.fileName), ...faqHistory.map(f => f.fileName)].filter(Boolean))].length;

  // ── Chat ─────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;
    const userMsg = { sender: "user", text: input || `Uploaded: ${selectedFile?.name}`, ts: Date.now() };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(""); setChatLoading(true);
    const fd = new FormData();
    fd.append("message", input); fd.append("document_text", currentDocText || "");
    if (selectedFile) fd.append("file", selectedFile);
    try {
      const res = await axios.post(`${API_BASE}/chat`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const aiMsg = { sender: "ai", text: res.data.response, ts: Date.now() };
      const final = [...updated, aiMsg];
      setMessages(final);
      const docText = res.data.document_text || currentDocText;
      const fname = res.data.file_name || currentFileName;
      setCurrentDocText(docText); setCurrentFileName(fname);
      const title = fname ? fname.replace(/\.(pdf|docx|txt|md)$/i, "").replaceAll("_", " ") : input.slice(0, 50);
      const newChat = { id: activeChatId || Date.now(), title, messages: final, documentText: docText, fileName: fname, ts: Date.now() };
      setActiveChatId(newChat.id);
      let hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      hist = hist.filter(c => c.id !== newChat.id); hist.unshift(newChat);
      setChatHistory(hist); localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    } catch {
      setMessages(prev => [...prev, { sender: "ai", text: "⚠️ Could not reach AI server. Make sure the backend is running at port 8000.", ts: Date.now() }]);
    }
    setSelectedFile(null); setChatLoading(false);
  };

  const loadChat = (chat) => { setMessages(chat.messages || []); setCurrentDocText(chat.documentText || ""); setCurrentFileName(chat.fileName || ""); setActiveChatId(chat.id); setActiveTab("chat"); };
  const newChat = () => { setMessages([]); setCurrentDocText(""); setCurrentFileName(""); setActiveChatId(null); setInput(""); setSelectedFile(null); };
  const deleteChat = (id, e) => { e?.stopPropagation(); const h = chatHistory.filter(c => c.id !== id); setChatHistory(h); localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); if (activeChatId === id) newChat(); };
  const exportChat = (chat) => { const t = chat.messages.map(m => `${m.sender === "user" ? "You" : "AI"}: ${m.text}`).join("\n\n"); const b = new Blob([t], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${chat.title}-chat.txt`; a.click(); };

  // ── FAQ ───────────────────────────────────────────────────
  const generateFAQ = async () => {
    if (!faqFile) return alert("Please select a document.");
    setFaqLoading(true); setFaqGenerated([]);
    const fd = new FormData(); fd.append("file", faqFile); fd.append("num_faqs", faqCount);
    try {
      const res = await axios.post(`${API_BASE}/generate-faq`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const faqs = res.data.faqs || [];
      setFaqGenerated(faqs); setEditingFaqs(faqs);
      const entry = { id: Date.now(), fileName: faqFile.name, faqs, ts: Date.now(), count: faqs.length };
      const hist = [entry, ...faqHistory];
      setFaqHistory(hist); setActiveFaqId(entry.id); localStorage.setItem(FAQ_KEY, JSON.stringify(hist));
    } catch { alert("FAQ generation failed."); }
    setFaqLoading(false);
  };

  const exportFAQ = (faqs, title) => { const t = faqs.map((f,i) => `Q${i+1}: ${f.question}\nA: ${f.answer}`).join("\n\n---\n\n"); const b = new Blob([t], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${title}-faqs.txt`; a.click(); };
  const exportFAQJson = (faqs, title) => { const b = new Blob([JSON.stringify(faqs, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${title}-faqs.json`; a.click(); };
  const deleteFaq = (id) => { const h = faqHistory.filter(f => f.id !== id); setFaqHistory(h); localStorage.setItem(FAQ_KEY, JSON.stringify(h)); if (activeFaqId === id) { setActiveFaqId(null); setFaqGenerated([]); setEditingFaqs([]); } };

  const handleUploadSummarize = async () => {
    if (!uploadFile) return;
    setUploadLoading(true); setUploadResult(null);
    const fd = new FormData(); fd.append("file", uploadFile);
    try {
      const res = await axios.post(`${API_BASE}/summarize`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadResult({ summary: res.data.summary, wordCount: res.data.word_count, fileName: uploadFile.name });
    } catch { setUploadResult({ error: "Summarization failed." }); }
    setUploadLoading(false);
  };

  // ── Editor ────────────────────────────────────────────────
  const startEdit = (idx) => { setEditingIdx(idx); setEditQ(editingFaqs[idx].question); setEditA(editingFaqs[idx].answer); };
  const saveEdit = () => { const u = editingFaqs.map((f,i) => i === editingIdx ? { question: editQ, answer: editA } : f); setEditingFaqs(u); setEditingIdx(null); };
  const deleteFaqItem = (idx) => setEditingFaqs(prev => prev.filter((_,i) => i !== idx));
  const moveFaqItem = (idx, dir) => { const a = [...editingFaqs]; const to = idx + dir; if (to < 0 || to >= a.length) return; [a[idx], a[to]] = [a[to], a[idx]]; setEditingFaqs(a); };
  const saveEditedFaqSet = () => {
    if (!activeFaqId) return;
    const h = faqHistory.map(f => f.id === activeFaqId ? { ...f, faqs: editingFaqs, count: editingFaqs.length } : f);
    setFaqHistory(h); setFaqGenerated(editingFaqs); localStorage.setItem(FAQ_KEY, JSON.stringify(h)); alert("FAQ set saved!");
  };
  const exportFAQasHTML = (faqs, title) => {
    const items = faqs.map((f,i) => `<details class="faq-item"><summary>${i+1}. ${f.question}</summary><p>${f.answer}</p></details>`).join("\n");
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title} - FAQ</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;background:#f4f7fc}.faq-item{background:white;border:1px solid #e5e7eb;border-radius:12px;margin:12px 0;overflow:hidden}.faq-item summary{cursor:pointer;padding:18px 20px;font-weight:600;color:#14213d;list-style:none;display:flex;justify-content:space-between}.faq-item summary::after{content:"+";font-size:1.4em;color:#2563eb}.faq-item[open] summary::after{content:"−"}.faq-item p{padding:0 20px 18px;color:#4b5563;line-height:1.7;margin:0}</style></head><body><h1>📋 ${title}</h1>${items}</body></html>`;
    const b = new Blob([html], { type: "text/html" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${title}-faqs.html`; a.click();
    setHtmlExported(true); setTimeout(() => setHtmlExported(false), 2000);
  };

  // ── Compare ───────────────────────────────────────────────
  const handleCompare = async () => {
    if (!compareFile1 || !compareFile2) return alert("Upload both documents.");
    setCompareLoading(true); setCompareResult(null);
    const fd = new FormData(); fd.append("file1", compareFile1); fd.append("file2", compareFile2);
    try {
      const res = await axios.post(`${API_BASE}/compare-docs`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setCompareResult(res.data);
    } catch { setCompareResult({ error: "Comparison failed. Check /compare-docs endpoint." }); }
    setCompareLoading(false);
  };

  // ── Keywords ──────────────────────────────────────────────
  const handleKeywordExtract = async () => {
    if (!kwFile) return alert("Upload a document.");
    setKwLoading(true); setKwResult(null);
    const fd = new FormData(); fd.append("file", kwFile);
    try {
      const res = await axios.post(`${API_BASE}/extract-keywords`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setKwResult(res.data);
    } catch { setKwResult({ error: "Keyword extraction failed. Check /extract-keywords endpoint." }); }
    setKwLoading(false);
  };

  // ── Quiz ──────────────────────────────────────────────────
  const startQuiz = (faqs) => {
    if (!faqs?.length) return alert("No FAQs available.");
    setQuizFaqs([...faqs].sort(() => Math.random() - 0.5).slice(0, Math.min(10, faqs.length)));
    setQuizIdx(0); setQuizScore(0); setQuizRevealed(false); setQuizDone(false); setQuizAnswered(false);
    setActiveTab("quiz");
  };
  const handleQuizAnswer = (correct) => { if (quizAnswered) return; setQuizAnswered(true); setQuizRevealed(true); if (correct) setQuizScore(s => s + 1); };
  const nextQuestion = () => { if (quizIdx + 1 >= quizFaqs.length) { setQuizDone(true); return; } setQuizIdx(i => i + 1); setQuizRevealed(false); setQuizAnswered(false); };
  const restartQuiz = () => { setQuizIdx(0); setQuizScore(0); setQuizRevealed(false); setQuizDone(false); setQuizAnswered(false); setQuizFaqs(prev => [...prev].sort(() => Math.random() - 0.5)); };

  // ── Tone ──────────────────────────────────────────────────
  const handleToneRewrite = async () => {
    if (!toneFile) return alert("Upload a document.");
    setToneLoading(true); setToneResult(null);
    const fd = new FormData(); fd.append("file", toneFile); fd.append("tone", toneStyle); fd.append("num_faqs", toneFaqCount);
    try {
      const res = await axios.post(`${API_BASE}/rewrite-tone`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setToneResult(res.data);
    } catch { setToneResult({ error: "Tone rewriting failed. Check /rewrite-tone endpoint." }); }
    setToneLoading(false);
  };

  const handleLogout = async () => { await signOut(auth); localStorage.removeItem("userEmail"); navigate("/login"); };

  const filteredChats = chatHistory.filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  // ── Shared styles ─────────────────────────────────────────
  const card = `rounded-2xl border p-6 ${dark ? "bg-slate-800/70 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`;
  const inputCls = `w-full text-sm rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition ${dark ? "bg-slate-900/60 border-slate-600 text-white placeholder-slate-500" : "bg-gray-50 border-gray-200 text-[#14213d] placeholder-gray-400"}`;
  const label = `text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-gray-500"}`;
  const heading = `font-bold ${dark ? "text-white" : "text-[#14213d]"}`;
  const sub = `text-sm ${dark ? "text-slate-400" : "text-gray-500"}`;

  // ── Upload zone helper ────────────────────────────────────
  const DropZone = ({ file, onFile, accent = "blue", hint = "PDF, DOCX, TXT" }) => (
    <div onClick={() => { const i = document.createElement("input"); i.type = "file"; i.accept = ".pdf,.docx,.txt,.md"; i.onchange = e => onFile(e.target.files[0]); i.click(); }}
      onDragOver={e => { e.preventDefault(); }}
      onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
        ${file ? `border-${accent}-400 bg-${accent}-50/30 dark:bg-${accent}-900/10` : dark ? "border-slate-600 hover:border-slate-500 hover:bg-slate-700/40" : `border-gray-300 hover:border-${accent}-400 hover:bg-${accent}-50/30`}`}>
      <FiUpload className={`mx-auto mb-2 ${file ? `text-${accent}-500` : dark ? "text-slate-500" : "text-gray-400"}`} size={22} />
      {file
        ? <><p className={`font-semibold text-${accent}-600 text-sm`}>{file.name}</p><p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-gray-400"}`}>Click to change</p></>
        : <><p className={`font-medium text-sm ${dark ? "text-slate-400" : "text-gray-600"}`}>Drop file here or click</p><p className={`text-xs mt-1 ${dark ? "text-slate-600" : "text-gray-400"}`}>{hint}</p></>}
    </div>
  );

  const navItems = [
    { id: "overview", label: "Overview", icon: <FiHome size={15} /> },
    { id: "chat", label: "AI Chat", icon: <FiMessageSquare size={15} /> },
    { id: "faq", label: "FAQ Generator", icon: <FiZap size={15} /> },
    { id: "editor", label: "FAQ Editor", icon: <FiEdit2 size={15} /> },
    { id: "compare", label: "Doc Compare", icon: <FiShuffle size={15} /> },
    { id: "keywords", label: "Keywords", icon: <FiTag size={15} /> },
    { id: "tone", label: "Tone Rewriter", icon: <FiKey size={15} /> },
    { id: "quiz", label: "Quiz Mode", icon: <FiHelpCircle size={15} /> },
    { id: "history", label: "History", icon: <FiClock size={15} /> },
    { id: "upload", label: "Doc Analyzer", icon: <FiBarChart2 size={15} /> },
  ];

  const tabTitles = {
    overview: `Welcome, ${userName} `, chat: "AI Document Chat", faq: "FAQ Generator",
    editor: "FAQ Editor", compare: "Document Compare", keywords: "Keyword Extractor",
    tone: "Tone Rewriter", quiz: "Quiz Mode", history: "History", upload: "Doc Analyzer",
  };
  const tabSubs = {
    overview: "Your knowledge dashboard at a glance", chat: "Chat with AI about your documents",
    faq: "Auto-generate FAQs from business documents", editor: "Edit, reorder, and export FAQ sets",
    compare: "Compare two documents side-by-side", keywords: "Extract key terms and topics",
    tone: "Rewrite FAQs in formal, casual, or technical tone", quiz: "Test knowledge using FAQs as flashcards",
    history: "All previous chats and FAQ sets", upload: "Summarize and analyze any document",
  };

  // ── RENDER ───────────────────────────────────────────────
  return (
    <div className={`flex h-screen overflow-hidden ${dark ? "dark bg-[#0f172a]" : "bg-[#f4f7fc]"}`}>

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside className={`${sidebarOpen ? "w-[240px]" : "w-0 overflow-hidden"} flex flex-col shrink-0 transition-all duration-300
        ${dark ? "bg-[#0d1b2e] border-r border-slate-800" : "bg-[#13213d] border-r border-[#1a2d4e]"}`}>

        {/* Brand */}
        <div className="px-4 py-4 border-b border-white/10 flex items-center shrink-0">
          <Logo size="sm" theme="dark" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pt-3 pb-2">Main</p>
          {navItems.slice(0, 3).map(item => (
            <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pt-4 pb-2">AI Tools</p>
          {navItems.slice(3, 8).map(item => (
            <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pt-4 pb-2">More</p>
          {navItems.slice(8).map(item => (
            <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
        </nav>

        {/* Profile */}
        <div className="p-3 border-t border-white/10 shrink-0 relative">
          <button onClick={() => setShowProfile(!showProfile)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-white text-xs font-semibold truncate">{userName}</p>
              <p className="text-slate-400 text-[10px] truncate">{userEmail}</p>
            </div>
            <FiChevronUp className={`text-slate-500 transition-transform shrink-0 ${showProfile ? "" : "rotate-180"}`} size={12} />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className={`absolute bottom-16 left-3 right-3 rounded-xl shadow-2xl overflow-hidden border z-50
                  ${dark ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}>
                <div className={`px-4 py-3 border-b ${dark ? "border-slate-700" : "border-gray-100"}`}>
                  <p className={`font-bold text-sm ${dark ? "text-white" : "text-[#14213d]"}`}>{userName}</p>
                  <p className={`text-xs break-all ${dark ? "text-slate-400" : "text-gray-500"}`}>{userEmail}</p>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition">
                  <FiLogOut size={13} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className={`px-6 py-3.5 flex items-center justify-between shrink-0 border-b
          ${dark ? "bg-[#0f172a] border-slate-800" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition ${dark ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"}`}>
              <FiMenu size={16} />
            </button>
            <div className="overflow-hidden">
              <h2 className={`font-bold text-base truncate ${dark ? "text-white" : "text-[#14213d]"}`}>{tabTitles[activeTab]}</h2>
              <p className={`text-xs truncate ${dark ? "text-slate-500" : "text-gray-400"}`}>{tabSubs[activeTab]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button onClick={newChat}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm">
              <FiPlus size={13} /> New Chat
            </button>
          </div>
        </header>

        {/* ── TAB CONTENT ── */}
        <main className="flex-1 overflow-y-auto">

          {/* ─── OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon="💬" label="Chat Sessions" value={totalChats} color="bg-blue-100 dark:bg-blue-900/30" dark={dark} />
                <StatCard icon="⚡" label="FAQs Generated" value={totalFAQs} color="bg-purple-100 dark:bg-purple-900/30" dark={dark} />
                <StatCard icon="📄" label="Documents" value={totalDocs} color="bg-green-100 dark:bg-green-900/30" dark={dark} />
              </div>

              {/* Quick actions */}
              <div className={card}>
                <h3 className={`${heading} text-sm mb-4`}>Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "New Chat", icon: "", tab: "chat", bg: dark ? "bg-blue-900/30 border-blue-800 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700" },
                    { label: "Generate FAQs", icon: "", tab: "faq", bg: dark ? "bg-purple-900/30 border-purple-800 text-purple-300" : "bg-purple-50 border-purple-200 text-purple-700" },
                    { label: "Compare Docs", icon: "", tab: "compare", bg: dark ? "bg-pink-900/30 border-pink-800 text-pink-300" : "bg-pink-50 border-pink-200 text-pink-700" },
                    { label: "Quiz Mode", icon: "", tab: "quiz", bg: dark ? "bg-green-900/30 border-green-800 text-green-300" : "bg-green-50 border-green-200 text-green-700" },
                    { label: "FAQ Editor", icon: "", tab: "editor", bg: dark ? "bg-yellow-900/30 border-yellow-800 text-yellow-300" : "bg-yellow-50 border-yellow-200 text-yellow-700" },
                    { label: "Keywords", icon: "", tab: "keywords", bg: dark ? "bg-indigo-900/30 border-indigo-800 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-700" },
                    { label: "Tone Rewrite", icon: "", tab: "tone", bg: dark ? "bg-orange-900/30 border-orange-800 text-orange-300" : "bg-orange-50 border-orange-200 text-orange-700" },
                    { label: "Doc Analyzer", icon: "", tab: "upload", bg: dark ? "bg-cyan-900/30 border-cyan-800 text-cyan-300" : "bg-cyan-50 border-cyan-200 text-cyan-700" },
                  ].map(a => (
                    <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                      className={`${a.bg} border rounded-xl p-3.5 text-center hover:opacity-80 transition-all hover:-translate-y-0.5 text-xs font-semibold`}>
                      <div className="text-xl mb-1.5">{a.icon}</div>{a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={card}>
                  <h3 className={`${heading} text-sm mb-4 flex items-center gap-2`}><FiMessageSquare size={13} className="text-blue-500" /> Recent Chats</h3>
                  {chatHistory.length === 0
                    ? <p className={`text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}>No chats yet — start a new conversation.</p>
                    : chatHistory.slice(0, 5).map(c => (
                      <button key={c.id} onClick={() => loadChat(c)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition mb-1 ${dark ? "hover:bg-slate-700/60" : "hover:bg-gray-50"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-blue-900/40" : "bg-blue-100"}`}><FiMessageSquare className="text-blue-500" size={13} /></div>
                        <div className="flex-1 overflow-hidden">
                          <p className={`text-xs font-semibold truncate ${dark ? "text-slate-200" : "text-[#14213d]"}`}>{c.title}</p>
                          <p className={`text-[10px] ${dark ? "text-slate-500" : "text-gray-400"}`}>{c.messages?.length} messages</p>
                        </div>
                      </button>
                    ))}
                </div>
                <div className={card}>
                  <h3 className={`${heading} text-sm mb-4 flex items-center gap-2`}><FiZap size={13} className="text-purple-500" /> Recent FAQ Sets</h3>
                  {faqHistory.length === 0
                    ? <p className={`text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}>No FAQs yet — generate your first set.</p>
                    : faqHistory.slice(0, 5).map(f => (
                      <button key={f.id} onClick={() => { setActiveFaqId(f.id); setFaqGenerated(f.faqs); setEditingFaqs(f.faqs); setActiveTab("faq"); }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition mb-1 ${dark ? "hover:bg-slate-700/60" : "hover:bg-gray-50"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-purple-900/40" : "bg-purple-100"}`}><FiZap className="text-purple-500" size={13} /></div>
                        <div className="flex-1 overflow-hidden">
                          <p className={`text-xs font-semibold truncate ${dark ? "text-slate-200" : "text-[#14213d]"}`}>{f.fileName}</p>
                          <p className={`text-[10px] ${dark ? "text-slate-500" : "text-gray-400"}`}>{f.count} FAQs · {formatDate(f.ts)}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Banner */}
              <div className="rounded-2xl p-8 bg-gradient-to-br from-[#13213d] to-[#1e3a7b] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-white font-bold text-lg mb-1"> 5 Advanced Features Available</h3>
                <p className="text-blue-300 text-xs mb-5">Use the AI Tools section in the sidebar</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[{ e:"",t:"FAQ Editor"},{e:"",t:"Doc Compare"},{e:"",t:"Keywords"},{e:"",t:"Tone Rewriter"},{e:"",t:"Quiz Mode"}].map(f => (
                    <div key={f.t} className="bg-white/10 rounded-xl p-3 text-center"><div className="text-xl mb-1">{f.e}</div><p className="text-white text-[10px] font-semibold">{f.t}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── AI CHAT ─── */}
          {activeTab === "chat" && (
            <div className="flex h-full">
              {/* chat history panel */}
              <div className={`w-56 flex flex-col shrink-0 border-r ${dark ? "bg-slate-900/50 border-slate-800" : "bg-white border-gray-200"}`}>
                <div className={`p-3 border-b ${dark ? "border-slate-800" : "border-gray-100"}`}>
                  <div className="relative">
                    <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-gray-400"}`} size={12} />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..."
                      className={`w-full pl-8 pr-3 py-2 rounded-lg text-xs border outline-none ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-gray-50 border-gray-200 text-[#14213d]"}`} />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                  {filteredChats.length === 0
                    ? <p className={`text-[10px] text-center mt-4 ${dark ? "text-slate-600" : "text-gray-400"}`}>No chats found</p>
                    : filteredChats.map(c => (
                      <div key={c.id} onClick={() => loadChat(c)}
                        className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition
                          ${activeChatId === c.id ? dark ? "bg-blue-900/40 border border-blue-800" : "bg-blue-50 border border-blue-200" : dark ? "hover:bg-slate-800" : "hover:bg-gray-50"}`}>
                        <div className="flex-1 overflow-hidden">
                          <p className={`text-[11px] font-semibold truncate ${activeChatId === c.id ? "text-blue-500" : dark ? "text-slate-300" : "text-[#14213d]"}`}>{c.title}</p>
                          <p className={`text-[9px] ${dark ? "text-slate-600" : "text-gray-400"}`}>{c.messages?.length} msgs</p>
                        </div>
                        <button onClick={e => deleteChat(c.id, e)} className="opacity-0 group-hover:opacity-100 text-red-400 p-1 transition"><FiTrash2 size={10} /></button>
                      </div>
                    ))}
                </div>
              </div>

              {/* main chat */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {currentFileName && (
                  <div className={`px-5 py-2 flex items-center gap-2 border-b text-xs ${dark ? "bg-blue-900/20 border-slate-800 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-700"}`}>
                    <FiFile size={12} /><span className="font-medium">{currentFileName}</span>
                    <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">Active</span>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                      <div className="text-4xl mb-3"></div>
                      <h3 className={`font-bold text-base mb-1 ${dark ? "text-white" : "text-[#14213d]"}`}>Start a Conversation</h3>
                      <p className={`text-xs max-w-xs ${dark ? "text-slate-500" : "text-gray-400"}`}>Upload a document or just type a message to begin.</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.sender === "ai" && (
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mr-2 mt-1">AI</div>
                      )}
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : dark ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm" : "bg-white border border-gray-200 text-[#14213d] rounded-bl-sm shadow-sm"
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.text}</p>
                        {msg.sender === "ai" && (
                          <button onClick={() => copyText(msg.text)} className={`mt-1.5 flex items-center gap-1 text-[10px] transition ${dark ? "text-slate-600 hover:text-slate-400" : "text-gray-300 hover:text-gray-500"}`}>
                            <FiCopy size={9} /> Copy
                          </button>
                        )}
                      </div>
                      {msg.sender === "user" && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ml-2 mt-1 ${dark ? "bg-slate-700" : "bg-[#14213d]"}`}>{userName.charAt(0)}</div>
                      )}
                    </motion.div>
                  ))}
                  {chatLoading && (
                    <div className="flex">
                      <div className={`rounded-2xl px-4 py-3 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200 shadow-sm"}`}>
                        <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* input */}
                <div className={`p-4 border-t ${dark ? "border-slate-800 bg-[#0f172a]" : "border-gray-200 bg-white"}`}>
                  {selectedFile && (
                    <div className={`mb-2 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${dark ? "bg-blue-900/30 border border-blue-800 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`}>
                      <FiFile size={11} /><span className="flex-1 truncate">{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)}><FiX size={11} /></button>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${dark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
                    <button onClick={() => fileInputRef.current?.click()} className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition shrink-0">
                      <FiPlus size={13} />
                    </button>
                    <input type="file" hidden ref={fileInputRef} accept=".pdf,.docx,.txt,.md" onChange={e => setSelectedFile(e.target.files[0])} />
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder="Ask anything about your document..."
                      className={`flex-1 bg-transparent outline-none text-xs ${dark ? "text-white placeholder-slate-500" : "text-[#14213d] placeholder-gray-400"}`} />
                    <button onClick={sendMessage} disabled={chatLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0">
                      <FiSend size={11} /> Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── FAQ GENERATOR ─── */}
          {activeTab === "faq" && (
            <div className="p-6 max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-5">
                <div className="space-y-4">
                  <div className={card}>
                    <h3 className={`${heading} text-sm mb-4 flex items-center gap-2`}><FiZap size={13} className="text-blue-500" /> Generate FAQs</h3>
                    <DropZone file={faqFile} onFile={setFaqFile} />
                    <div className="mt-4">
                      <label className={`${label} block mb-2`}>FAQ Count: <span className="text-blue-500 font-bold">{faqCount}</span></label>
                      <input type="range" min={5} max={30} value={faqCount} onChange={e => setFaqCount(+e.target.value)} className="w-full accent-blue-600" />
                    </div>
                    <button onClick={generateFAQ} disabled={faqLoading || !faqFile}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition">
                      {faqLoading ? <><FiRefreshCw className="animate-spin" size={13} /> Generating...</> : <><FiZap size={13} /> Generate</>}
                    </button>
                    {faqGenerated.length > 0 && <>
                      <button onClick={() => { setEditingFaqs(faqGenerated); setActiveTab("editor"); }}
                        className={`w-full mt-2 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border ${dark ? "border-yellow-700 text-yellow-400 hover:bg-yellow-900/20" : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"}`}>
                        <FiEdit2 size={12} /> Edit FAQs
                      </button>
                      <button onClick={() => startQuiz(faqGenerated)}
                        className={`w-full mt-2 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border ${dark ? "border-green-700 text-green-400 hover:bg-green-900/20" : "border-green-300 text-green-700 hover:bg-green-50"}`}>
                        <FiHelpCircle size={12} /> Quiz Mode
                      </button>
                    </>}
                  </div>

                  {/* History list */}
                  <div className={card}>
                    <h3 className={`${heading} text-xs mb-3`}>Previous Sets</h3>
                    {faqHistory.length === 0 ? <p className={`text-xs ${dark ? "text-slate-600" : "text-gray-400"}`}>None yet.</p>
                      : faqHistory.map(f => (
                        <div key={f.id} onClick={() => { setActiveFaqId(f.id); setFaqGenerated(f.faqs); setEditingFaqs(f.faqs); }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition mb-1
                            ${activeFaqId === f.id ? dark ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200" : dark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-purple-900/40" : "bg-purple-100"}`}><FiZap className="text-purple-500" size={11} /></div>
                          <div className="flex-1 overflow-hidden">
                            <p className={`text-[11px] font-semibold truncate ${dark ? "text-slate-300" : "text-[#14213d]"}`}>{f.fileName}</p>
                            <p className={`text-[10px] ${dark ? "text-slate-600" : "text-gray-400"}`}>{f.count} FAQs</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); deleteFaq(f.id); }} className="text-red-400 p-1"><FiTrash2 size={10} /></button>
                        </div>
                      ))}
                  </div>
                </div>

                <div className={`md:col-span-2 ${card}`}>
                  {faqGenerated.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className={`${heading} text-sm`}>Generated FAQs</h3>
                          <p className={`${sub} text-xs`}>{faqGenerated.length} questions</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => exportFAQ(faqGenerated, faqFile?.name || "faqs")} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}><FiDownload size={11} /> TXT</button>
                          <button onClick={() => exportFAQJson(faqGenerated, faqFile?.name || "faqs")} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"><FiDownload size={11} /> JSON</button>
                          <button onClick={() => copyText(faqGenerated.map((f,i) => `Q${i+1}: ${f.question}\nA: ${f.answer}`).join("\n\n"))} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${dark ? "border-green-800 text-green-400 hover:bg-green-900/20" : "border-green-200 text-green-700 hover:bg-green-50"}`}><FiCopy size={11} /> Copy</button>
                        </div>
                      </div>
                      <FAQAccordion faqs={faqGenerated} dark={dark} />
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                      <div className="text-4xl mb-3">⚡</div>
                      <h3 className={`${heading} text-base mb-1`}>No FAQs Yet</h3>
                      <p className={`text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}>Upload a document and click Generate.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── FAQ EDITOR ─── */}
          {activeTab === "editor" && (
            <div className="p-6 max-w-5xl mx-auto">
              <div className={card}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className={`${heading} text-sm flex items-center gap-2`}><FiEdit2 size={13} className="text-yellow-500" /> FAQ Editor</h3>
                    <p className={`${sub} text-xs mt-0.5`}>Edit, reorder, delete FAQs then export or save</p>
                  </div>
                  {editingFaqs.length > 0 && (
                    <div className="flex gap-2">
                      <button onClick={saveEditedFaqSet} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition"><FiSave size={11} /> Save</button>
                      <button onClick={() => exportFAQasHTML(editingFaqs, "FAQ")} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${htmlExported ? "bg-green-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>{htmlExported ? <><FiCheck size={11} /> Done!</> : <><FiCode size={11} /> HTML</>}</button>
                      <button onClick={() => exportFAQ(editingFaqs, "FAQ")} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition border ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}><FiDownload size={11} /> TXT</button>
                    </div>
                  )}
                </div>
                {editingFaqs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">✏️</div>
                    <h3 className={`${heading} text-sm mb-2`}>No FAQs to Edit</h3>
                    <p className={`text-xs ${dark ? "text-slate-500" : "text-gray-400"} mb-5`}>Generate FAQs first, then come here to edit them.</p>
                    <button onClick={() => setActiveTab("faq")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition">Go to Generator</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editingFaqs.map((faq, idx) => (
                      <motion.div key={idx} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-xl overflow-hidden ${dark ? "border-slate-700" : "border-gray-200"}`}>
                        {editingIdx === idx ? (
                          <div className={`p-4 border-l-4 border-yellow-400 ${dark ? "bg-yellow-900/10" : "bg-yellow-50"}`}>
                            <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-3">Editing #{idx+1}</p>
                            <div className="space-y-2">
                              <input value={editQ} onChange={e => setEditQ(e.target.value)} className={inputCls} placeholder="Question" />
                              <textarea value={editA} onChange={e => setEditA(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Answer" />
                              <div className="flex gap-2">
                                <button onClick={saveEdit} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"><FiCheck size={11} /> Save</button>
                                <button onClick={() => setEditingIdx(null)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${dark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"}`}><FiX size={11} /> Cancel</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={`flex items-start gap-3 p-4 transition ${dark ? "bg-slate-800 hover:bg-slate-700/60" : "bg-white hover:bg-gray-50"}`}>
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${dark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600"}`}>{idx+1}</span>
                            <div className="flex-1 overflow-hidden">
                              <p className={`font-semibold text-xs mb-0.5 ${dark ? "text-slate-200" : "text-[#14213d]"}`}>{faq.question}</p>
                              <p className={`text-[11px] leading-relaxed line-clamp-2 ${dark ? "text-slate-500" : "text-gray-400"}`}>{faq.answer}</p>
                            </div>
                            <div className="flex gap-0.5 shrink-0">
                              <button onClick={() => moveFaqItem(idx, -1)} disabled={idx===0} className={`p-1.5 rounded-lg transition disabled:opacity-30 ${dark ? "text-slate-500 hover:bg-slate-700 hover:text-blue-400" : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"}`}><FiArrowUp size={11} /></button>
                              <button onClick={() => moveFaqItem(idx, 1)} disabled={idx===editingFaqs.length-1} className={`p-1.5 rounded-lg transition disabled:opacity-30 ${dark ? "text-slate-500 hover:bg-slate-700 hover:text-blue-400" : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"}`}><FiArrowDown size={11} /></button>
                              <button onClick={() => startEdit(idx)} className={`p-1.5 rounded-lg transition ${dark ? "text-slate-500 hover:bg-yellow-900/30 hover:text-yellow-400" : "text-gray-400 hover:bg-yellow-50 hover:text-yellow-600"}`}><FiEdit2 size={11} /></button>
                              <button onClick={() => deleteFaqItem(idx)} className={`p-1.5 rounded-lg transition ${dark ? "text-slate-500 hover:bg-red-900/30 hover:text-red-400" : "text-gray-400 hover:bg-red-50 hover:text-red-500"}`}><FiTrash2 size={11} /></button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <p className={`text-[10px] text-center mt-3 ${dark ? "text-slate-600" : "text-gray-400"}`}>{editingFaqs.length} FAQs · ↑↓ reorder · ✏️ edit · 🗑 delete</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── DOC COMPARE ─── */}
          {activeTab === "compare" && (
            <div className="p-6 max-w-5xl mx-auto space-y-5">
              <div className={card}>
                <h3 className={`${heading} text-sm mb-1 flex items-center gap-2`}><FiShuffle size={13} className="text-pink-500" /> Document Compare</h3>
                <p className={`${sub} text-xs mb-5`}>Upload two documents — AI will highlight similarities, differences, and unique content.</p>
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div><p className={`${label} mb-2`}>Document 1</p><DropZone file={compareFile1} onFile={setCompareFile1} accent="blue" /></div>
                  <div><p className={`${label} mb-2`}>Document 2</p><DropZone file={compareFile2} onFile={setCompareFile2} accent="pink" /></div>
                </div>
                <button onClick={handleCompare} disabled={compareLoading || !compareFile1 || !compareFile2}
                  className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition">
                  {compareLoading ? <><FiRefreshCw className="animate-spin" size={13} /> Comparing...</> : <><FiShuffle size={13} /> Compare Documents</>}
                </button>
              </div>
              <AnimatePresence>
                {compareResult && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    {compareResult.error
                      ? <div className={`${card} flex items-center gap-2 text-red-500 text-sm`}><FiX size={14} />{compareResult.error}</div>
                      : <div className="grid md:grid-cols-3 gap-4">
                          {[
                            { title: "✅ Similarities", content: safeStr(compareResult.similarities), accent: "green" },
                            { title: "🔵 Only in Doc 1", content: safeStr(compareResult.unique_doc1), accent: "blue" },
                            { title: "🟣 Only in Doc 2", content: safeStr(compareResult.unique_doc2), accent: "purple" },
                          ].map(s => (
                            <div key={s.title} className={card}>
                              <h4 className={`${heading} text-xs mb-3`}>{s.title}</h4>
                              <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-gray-600"}`}>{s.content || "None found."}</p>
                            </div>
                          ))}
                          {compareResult.summary && (
                            <div className={`md:col-span-3 ${card}`}>
                              <h4 className={`${heading} text-xs mb-2 flex items-center gap-1.5`}><FiBarChart2 size={12} className="text-blue-500" /> Overall Summary</h4>
                              <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-gray-600"}`}>{safeStr(compareResult.summary)}</p>
                            </div>
                          )}
                        </div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ─── KEYWORDS ─── */}
          {activeTab === "keywords" && (
            <div className="p-6 max-w-4xl mx-auto space-y-5">
              <div className={card}>
                <h3 className={`${heading} text-sm mb-1 flex items-center gap-2`}><FiTag size={13} className="text-indigo-500" /> Keyword Extractor</h3>
                <p className={`${sub} text-xs mb-5`}>Extract key terms, topics, entities, and themes using AI.</p>
                <DropZone file={kwFile} onFile={f => { setKwFile(f); setKwResult(null); }} accent="indigo" />
                <button onClick={handleKeywordExtract} disabled={kwLoading || !kwFile}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition">
                  {kwLoading ? <><FiRefreshCw className="animate-spin" size={13} /> Extracting...</> : <><FiTag size={13} /> Extract Keywords</>}
                </button>
              </div>
              <AnimatePresence>
                {kwResult && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {kwResult.error
                      ? <div className={`${card} text-red-500 text-sm`}>{safeStr(kwResult.error)}</div>
                      : <>
                          <div className="grid md:grid-cols-2 gap-4">
                            {[
                              { label: " Key Terms", items: Array.isArray(kwResult.keywords) ? kwResult.keywords : [], tag: `bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300` },
                              { label: " Topics", items: Array.isArray(kwResult.topics) ? kwResult.topics : [], tag: `bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300` },
                              { label: "Entities", items: Array.isArray(kwResult.entities) ? kwResult.entities : [], tag: `bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300` },
                              { label: " Themes", items: Array.isArray(kwResult.themes) ? kwResult.themes : [], tag: `bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300` },
                            ].map(s => (
                              <div key={s.label} className={card}>
                                <h4 className={`${heading} text-xs mb-3`}>{s.label}</h4>
                                {s.items?.length
                                  ? <div className="flex flex-wrap gap-1.5">{s.items.map((item, i) => <span key={i} className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${s.tag}`}>{safeStr(item)}</span>)}</div>
                                  : <p className={`text-xs ${dark ? "text-slate-600" : "text-gray-400"}`}>None found.</p>}
                              </div>
                            ))}
                          </div>
                          {kwResult.summary && (
                            <div className={card}>
                              <h4 className={`${heading} text-xs mb-2`}> Document Overview</h4>
                              <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-gray-600"}`}>{safeStr(kwResult.summary)}</p>
                            </div>
                          )}
                        </>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ─── QUIZ MODE ─── */}
          {activeTab === "quiz" && (
            <div className="p-6 max-w-2xl mx-auto">
              {quizFaqs.length === 0 ? (
                <div className={`${card} text-center py-14`}>
                  <div className="text-5xl mb-3"></div>
                  <h3 className={`${heading} text-lg mb-2`}>Quiz Mode</h3>
                  <p className={`${sub} text-xs mb-6 max-w-sm mx-auto`}>Test your knowledge using generated FAQs as flashcards.</p>
                  {faqHistory.length > 0 ? (
                    <div className="space-y-2">
                      <p className={`text-xs font-semibold ${dark ? "text-slate-400" : "text-gray-600"} mb-3`}>Pick a FAQ set to quiz from:</p>
                      {faqHistory.slice(0, 4).map(f => (
                        <button key={f.id} onClick={() => startQuiz(f.faqs)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition text-left
                            ${dark ? "bg-slate-800 border-slate-700 hover:border-green-700" : "bg-green-50 border-green-200 hover:border-green-400"}`}>
                          <div className="flex items-center gap-2.5">
                            <FiHelpCircle className="text-green-500" size={14} />
                            <div>
                              <p className={`font-semibold text-xs ${dark ? "text-slate-200" : "text-[#14213d]"}`}>{f.fileName}</p>
                              <p className={`text-[10px] ${dark ? "text-slate-500" : "text-gray-400"}`}>{f.count} questions</p>
                            </div>
                          </div>
                          <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">Start</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button onClick={() => setActiveTab("faq")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                      Generate FAQs First
                    </button>
                  )}
                </div>
              ) : quizDone ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${card} text-center py-14`}>
                  <div className="text-5xl mb-3">{quizScore >= quizFaqs.length * 0.8 ? "" : quizScore >= quizFaqs.length * 0.5 ? "" : ""}</div>
                  <h3 className={`${heading} text-xl mb-1`}>Quiz Complete!</h3>
                  <div className="text-4xl font-black text-blue-500 my-4">{quizScore}/{quizFaqs.length}</div>
                  <p className={`${sub} text-xs mb-1`}>{quizScore >= quizFaqs.length * 0.8 ? "Excellent work!" : quizScore >= quizFaqs.length * 0.5 ? "Good job! Review a few more." : "Keep studying!"}</p>
                  <div className={`w-full rounded-full h-2 my-5 ${dark ? "bg-slate-700" : "bg-gray-200"}`}>
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(quizScore/quizFaqs.length)*100}%` }} />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button onClick={restartQuiz} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2"><FiRefreshCw size={13} /> Retry</button>
                    <button onClick={() => setActiveTab("faq")} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Back to FAQs</button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className={`${card} flex items-center justify-between`}>
                    <span className={`text-xs font-semibold ${dark ? "text-slate-400" : "text-gray-600"}`}>Q {quizIdx+1} of {quizFaqs.length}</span>
                    <div className={`flex-1 mx-4 h-1.5 rounded-full ${dark ? "bg-slate-700" : "bg-gray-200"}`}>
                      <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${((quizIdx+1)/quizFaqs.length)*100}%` }} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500"><FiAward size={13} />{quizScore}</div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={quizIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className={card}>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Question {quizIdx+1}</p>
                      <h3 className={`${heading} text-base leading-relaxed mb-7`}>{quizFaqs[quizIdx]?.question}</h3>
                      {!quizAnswered ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => handleQuizAnswer(true)} className="bg-green-100 hover:bg-green-200 border-2 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/40 py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"><FiCheck size={14} /> I Know This</button>
                          <button onClick={() => handleQuizAnswer(false)} className="bg-red-100 hover:bg-red-200 border-2 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/40 py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"><FiX size={14} /> Show Me</button>
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <div className={`rounded-xl p-4 border mb-4 ${dark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-100"}`}>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1.5">Answer</p>
                            <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-gray-700"}`}>{quizFaqs[quizIdx]?.answer}</p>
                          </div>
                          <button onClick={nextQuestion} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition">
                            {quizIdx+1 >= quizFaqs.length ? "See Results 🏆" : "Next →"}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* ─── TONE REWRITER ─── */}
          {activeTab === "tone" && (
            <div className="p-6 max-w-4xl mx-auto space-y-5">
              <div className={card}>
                <h3 className={`${heading} text-sm mb-1 flex items-center gap-2`}><FiKey size={13} className="text-orange-500" /> FAQ Tone Rewriter</h3>
                <p className={`${sub} text-xs mb-5`}>Generate FAQs from a document written in a specific tone — formal, casual, technical, or plain.</p>
                <DropZone file={toneFile} onFile={f => { setToneFile(f); setToneResult(null); }} accent="orange" />
                <div className="grid md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className={`${label} mb-3`}>Tone Style</p>
                    <div className="space-y-2">
                      {[
                        { id: "formal", icon: "", label: "Formal", desc: "Professional corporate language" },
                        { id: "casual", icon: "", label: "Casual", desc: "Friendly, conversational tone" },
                        { id: "technical", icon: "", label: "Technical", desc: "Detailed developer-style" },
                        { id: "simple", icon: "", label: "Simple", desc: "Plain English, easy to read" },
                      ].map(t => (
                        <button key={t.id} onClick={() => setToneStyle(t.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition text-sm
                            ${toneStyle === t.id ? dark ? "border-orange-600 bg-orange-900/20" : "border-orange-400 bg-orange-50" : dark ? "border-slate-700 hover:border-slate-600" : "border-gray-200 hover:border-orange-300"}`}>
                          <span className="text-lg">{t.icon}</span>
                          <div className="flex-1">
                            <p className={`font-semibold text-xs ${dark ? "text-slate-200" : "text-[#14213d]"}`}>{t.label}</p>
                            <p className={`text-[10px] ${dark ? "text-slate-500" : "text-gray-400"}`}>{t.desc}</p>
                          </div>
                          {toneStyle === t.id && <FiCheck className="text-orange-500 shrink-0" size={13} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`${label} mb-3`}>FAQ Count: <span className="text-orange-500 font-bold">{toneFaqCount}</span></p>
                    <input type="range" min={3} max={15} value={toneFaqCount} onChange={e => setToneFaqCount(+e.target.value)} className="w-full accent-orange-500 mb-4" />
                    <div className={`rounded-xl p-4 border ${dark ? "bg-orange-900/10 border-orange-900/40" : "bg-orange-50 border-orange-100"}`}>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1.5">Sample question style:</p>
                      <p className={`text-xs italic ${dark ? "text-slate-400" : "text-gray-600"}`}>
                        {toneStyle === "formal" && '"What are the applicable terms and conditions?"'}
                        {toneStyle === "casual" && '"Hey, what does this policy mean for me?"'}
                        {toneStyle === "technical" && '"What authentication methods are supported?"'}
                        {toneStyle === "simple" && '"What does this document say in simple words?"'}
                      </p>
                    </div>
                  </div>
                </div>
                <button onClick={handleToneRewrite} disabled={toneLoading || !toneFile}
                  className="w-full mt-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition">
                  {toneLoading ? <><FiRefreshCw className="animate-spin" size={13} /> Rewriting...</> : <><FiKey size={13} /> Generate {toneStyle.charAt(0).toUpperCase()+toneStyle.slice(1)} FAQs</>}
                </button>
              </div>
              <AnimatePresence>
                {toneResult && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={card}>
                    {toneResult.error
                      ? <div className="flex items-center gap-2 text-red-500 text-xs"><FiX size={13} />{safeStr(toneResult.error)}</div>
                      : <>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className={`${heading} text-sm`}>{toneStyle.charAt(0).toUpperCase()+toneStyle.slice(1)} Tone FAQs</h3>
                              <p className={`${sub} text-xs`}>{(toneResult.faqs||[]).length} FAQs rewritten</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => exportFAQ(toneResult.faqs||[], `${toneFile?.name}-${toneStyle}`)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}><FiDownload size={11} /> TXT</button>
                              <button onClick={() => exportFAQasHTML(toneResult.faqs||[], `${toneStyle}-FAQ`)} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition"><FiCode size={11} /> HTML</button>
                              <button onClick={() => { setEditingFaqs(toneResult.faqs||[]); setActiveTab("editor"); }} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition"><FiEdit2 size={11} /> Edit</button>
                            </div>
                          </div>
                          <FAQAccordion faqs={toneResult.faqs||[]} dark={dark} />
                        </>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ─── HISTORY ─── */}
          {activeTab === "history" && (
            <div className="p-6 max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-5">
                <div className={card}>
                  <h3 className={`${heading} text-sm mb-4 flex items-center gap-2`}><FiMessageSquare size={13} className="text-blue-500" /> Chats ({chatHistory.length})</h3>
                  {chatHistory.length === 0 ? <p className={`text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}>No chats yet.</p>
                    : chatHistory.map(c => (
                      <div key={c.id} className={`group flex items-center gap-3 p-3 rounded-xl transition mb-1 ${dark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-blue-900/40" : "bg-blue-100"}`}><FiMessageSquare className="text-blue-500" size={12} /></div>
                        <div className="flex-1 overflow-hidden cursor-pointer" onClick={() => loadChat(c)}>
                          <p className={`font-semibold text-xs truncate ${dark ? "text-slate-200" : "text-[#14213d]"}`}>{c.title}</p>
                          <p className={`text-[10px] ${dark ? "text-slate-500" : "text-gray-400"}`}>{c.messages?.length} msgs · {c.fileName || "No file"}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => exportChat(c)} className="text-blue-400 hover:text-blue-600 p-1"><FiDownload size={11} /></button>
                          <button onClick={e => deleteChat(c.id, e)} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 size={11} /></button>
                        </div>
                      </div>
                    ))}
                </div>
                <div className={card}>
                  <h3 className={`${heading} text-sm mb-4 flex items-center gap-2`}><FiZap size={13} className="text-purple-500" /> FAQ Sets ({faqHistory.length})</h3>
                  {faqHistory.length === 0 ? <p className={`text-xs ${dark ? "text-slate-500" : "text-gray-400"}`}>No FAQ sets yet.</p>
                    : faqHistory.map(f => (
                      <div key={f.id} className={`group flex items-center gap-3 p-3 rounded-xl transition mb-1 ${dark ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-purple-900/40" : "bg-purple-100"}`}><FiZap className="text-purple-500" size={12} /></div>
                        <div className="flex-1 overflow-hidden cursor-pointer" onClick={() => { setActiveFaqId(f.id); setFaqGenerated(f.faqs); setEditingFaqs(f.faqs); setActiveTab("faq"); }}>
                          <p className={`font-semibold text-xs truncate ${dark ? "text-slate-200" : "text-[#14213d]"}`}>{f.fileName}</p>
                          <p className={`text-[10px] ${dark ? "text-slate-500" : "text-gray-400"}`}>{f.count} FAQs · {formatDate(f.ts)}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => startQuiz(f.faqs)} title="Quiz" className="text-green-400 hover:text-green-600 p-1"><FiHelpCircle size={11} /></button>
                          <button onClick={() => exportFAQ(f.faqs, f.fileName)} className="text-blue-400 hover:text-blue-600 p-1"><FiDownload size={11} /></button>
                          <button onClick={() => deleteFaq(f.id)} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 size={11} /></button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── DOC ANALYZER ─── */}
          {activeTab === "upload" && (
            <div className="p-6 max-w-3xl mx-auto space-y-5">
              <div className={card}>
                <h3 className={`${heading} text-sm mb-1 flex items-center gap-2`}><FiBarChart2 size={13} className="text-blue-500" /> Document Analyzer</h3>
                <p className={`${sub} text-xs mb-5`}>Get an AI-powered executive summary and word count for any document.</p>
                <DropZone file={uploadFile} onFile={f => { setUploadFile(f); setUploadResult(null); }} />
                <button onClick={handleUploadSummarize} disabled={!uploadFile || uploadLoading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition">
                  {uploadLoading ? <><FiRefreshCw className="animate-spin" size={13} /> Analyzing...</> : <><FiBarChart2 size={13} /> Analyze Document</>}
                </button>
              </div>
              <AnimatePresence>
                {uploadResult && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={card}>
                    {uploadResult.error
                      ? <div className="flex items-center gap-2 text-red-500 text-sm"><FiX size={13} />{safeStr(uploadResult.error)}</div>
                      : <>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className={`${heading} text-sm`}>Analysis Result</h3>
                              <p className={`${sub} text-xs`}>{uploadResult.fileName}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                              {uploadResult.wordCount && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dark ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700"}`}>{uploadResult.wordCount} words</span>}
                              <button onClick={() => copyText(uploadResult.summary)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ${dark ? "border-slate-600 text-slate-400 hover:bg-slate-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}><FiCopy size={10} /> Copy</button>
                            </div>
                          </div>
                          <div className={`rounded-xl p-5 border ${dark ? "bg-slate-900/50 border-slate-700" : "bg-blue-50/40 border-blue-100"}`}>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Summary</p>
                            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${dark ? "text-slate-300" : "text-gray-700"}`}>{safeStr(uploadResult.summary)}</p>
                          </div>
                          <div className="mt-4 flex gap-2 flex-wrap">
                            <button onClick={() => { setActiveTab("faq"); setFaqFile(uploadFile); }} className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"><FiZap size={11} /> Generate FAQs</button>
                            <button onClick={() => { setActiveTab("keywords"); setKwFile(uploadFile); }} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"><FiTag size={11} /> Extract Keywords</button>
                            <button onClick={() => { setActiveTab("chat"); setSelectedFile(uploadFile); }} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"><FiMessageSquare size={11} /> Chat About It</button>
                          </div>
                        </>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ── Sidebar nav button ─────────────────────────────────────
function NavBtn({ item, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all
        ${active ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
      <span className="shrink-0">{item.icon}</span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${active ? "bg-white/20 text-white" : "bg-blue-600/60 text-blue-200"}`}>{item.badge}</span>}
    </button>
  );
}
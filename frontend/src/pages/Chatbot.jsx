import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import API from "../services/api";

import {
  FiPlus,
  FiLogOut,
  FiUser,
  FiImage,
  FiGlobe,
  FiClock,
  FiFile,
} from "react-icons/fi";

import { auth } from "../firebase";

import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const userEmail =
  localStorage.getItem("userEmail") ||
  "user@gmail.com";

const HISTORY_KEY =
  `chatHistory_${userEmail}`;

  const navigate = useNavigate();

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [showMenu, setShowMenu] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const [chatHistory, setChatHistory] =
    useState([]);

  const [currentDocumentText,
    setCurrentDocumentText] =
    useState("");
  const [currentFileName,
  setCurrentFileName] =
  useState("");

  const fileInputRef = useRef();

  // ====================================
  // CLEAR OLD BROKEN HISTORY
  // ====================================
useEffect(() => {

  const savedHistory =
    JSON.parse(
      localStorage.getItem(
        HISTORY_KEY
      )
    ) || [];

  setChatHistory(savedHistory);

}, []);
    

  // ====================================
  // USER EMAIL
  // ====================================

 
  // ====================================
  // GET NAME
  // ====================================

  const getNameFromEmail = (email) => {

    const name =
      email
        .split("@")[0]
        .replace(/[0-9]/g, "")
        .split(/[._]/)
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");

    return name || "User";
  };

  const profileName =
    getNameFromEmail(userEmail);

  // ====================================
  // SEND MESSAGE
  // ====================================

  const sendMessage = async () => {

    if (
      !input.trim() &&
      !selectedFile
    ) return;

    // USER MESSAGE

    const userMessage = {
      sender: "user",
      text:
        input ||
        `Uploaded file: ${selectedFile.name}`,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    // ====================================
    // FORM DATA
    // ====================================

    const formData = new FormData();

    formData.append(
      "message",
      input
    );

    formData.append(
      "document_text",
      currentDocumentText || ""
    );

    if (selectedFile) {

      formData.append(
        "file",
        selectedFile
      );
    }

    try {

      const response =
        await API.post(
  "/chat",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      // ====================================
      // AI RESPONSE
      // ====================================

      const aiReply =
        response.data.response;

      const aiMessage = {
        sender: "ai",
        text: aiReply,
      };

      const finalMessages = [
        ...updatedMessages,
        aiMessage,
      ];

      setMessages(finalMessages);

      // ====================================
      // SAVE DOCUMENT TEXT
      // ====================================

      const docText =
        response.data.document_text ||
        currentDocumentText;
        setCurrentFileName(
  response.data.file_name || currentFileName
);
      setCurrentDocumentText(docText);

      // ====================================
      // CHAT TITLE
      // ====================================

      let chatTitle =
        "General Chat";

      // FILE NAME

      if (
        response.data.file_name
      ) {

        chatTitle =
          response.data.file_name
            .replace(".txt", "")
            .replace(".pdf", "")
            .replace(".docx", "")
            .replace(".md", "")
            .replaceAll("_", " ");
      }

      // DOCUMENT CONTENT

      if (docText) {

        const lines =
          docText
            .split("\n")
            .filter(
              (line) =>
                line.trim() !== ""
            );

        // FIRST LINE

        if (lines.length > 0) {

          const firstLine =
            lines[0]
              .trim()
              .slice(0, 60);

          if (
            firstLine.length > 5
          ) {

            chatTitle =
              firstLine;
          }
        }

        // KEYWORDS

        const keywords = [
          "policy",
          "company",
          "report",
          "employee",
          "manual",
          "guide",
          "refund",
          "hr",
          "finance",
        ];

        for (let line of lines) {

          const lower =
            line.toLowerCase();

          if (
            keywords.some(
              (word) =>
                lower.includes(word)
            )
          ) {

            chatTitle =
              line
                .trim()
                .slice(0, 60);

            break;
          }
        }
      }

      // ====================================
      // SAVE HISTORY
      // ====================================
const newChat = {
  id: Date.now(),
  title: chatTitle,
  messages: finalMessages,
  documentText: docText,
  fileName:
    response.data.file_name ||
    currentFileName,
};
      // REMOVE OLD SAME TITLE
let updatedHistory =
  JSON.parse(
    localStorage.getItem(
      HISTORY_KEY
    )
  ) || [];

updatedHistory =
  updatedHistory.filter(
          (chat) =>
            chat.title !==
            chatTitle
        );

      // ADD NEW

      updatedHistory.unshift(
        newChat
      );

      // SAVE

      setChatHistory(
        updatedHistory
      );

      localStorage.setItem(
  HISTORY_KEY,
  JSON.stringify(updatedHistory)
);

    } catch (error) {

      console.log(error);

      const aiMessage = {
        sender: "ai",
        text:
          "Error connecting to AI server.",
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);
    }

    // ====================================
    // CLEAR INPUT
    // ====================================

    setInput("");

    setSelectedFile(null);

    setShowMenu(false);
  };

  // ====================================
  // LOAD CHAT
  // ====================================

  const loadChat = (chat) => {

  setMessages(
    chat.messages || []
  );

  setCurrentDocumentText(
    chat.documentText || ""
  );

  setCurrentFileName(
    chat.fileName || ""
  );
};

  // ====================================
  // NEW CHAT
  // ====================================

  const createNewChat = () => {

  setMessages([]);

  setCurrentDocumentText("");

  setCurrentFileName("");

  setInput("");

  setSelectedFile(null);
};

  // ====================================
  // LOGOUT
  // ====================================

  const handleLogout =
    async () => {

      await signOut(auth);

      localStorage.removeItem(
        "userEmail"
      );

      navigate("/login");
    };

  return (

    <div className="flex h-screen bg-[#f4f7fc]">

      {/* SIDEBAR */}

      <div className="w-[300px] bg-[#13213d] text-white flex flex-col justify-between">

        <div>

          {/* TITLE */}

          <div className="p-6 border-b border-blue-900">

            <h1 className="text-4xl font-bold leading-tight">
              Knowledge-Based FAQ
            </h1>

          </div>

          {/* NEW CHAT */}

          <div className="p-4">

            <button
              onClick={createNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3"
            >

              <FiPlus />

              New Chat

            </button>

          </div>

          {/* HISTORY */}

          <div className="px-4">

            <h2 className="text-2xl font-semibold mb-4">
              History
            </h2>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">

              {
                chatHistory.length === 0 ? (

                  <div className="bg-[#1e315c] p-4 rounded-xl text-gray-300">

                    No chats available

                  </div>

                ) : (

                  chatHistory.map((chat) => (

                    <div
                      key={chat.id}
                      onClick={() =>
                        loadChat(chat)
                      }
                      className="bg-[#1e315c] hover:bg-blue-700 p-4 rounded-xl cursor-pointer"
                    >

                      {chat.title}

                    </div>

                  ))
                )
              }

            </div>

          </div>

        </div>

        {/* PROFILE */}

        <div className="p-4 border-t border-blue-900 relative">

          <div
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
            className="bg-[#1e315c] rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
          >

            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">

              {
                profileName.charAt(0)
              }

            </div>

            <div>

              <h3 className="font-semibold text-lg">
                {profileName}
              </h3>

            </div>

          </div>

          {/* DROPDOWN */}

          {
            showProfile && (

              <div className="absolute bottom-24 left-4 bg-white text-black rounded-2xl shadow-xl w-[250px] overflow-hidden">

                <div className="p-4 border-b">

                  <div className="flex items-center gap-3">

                    <FiUser />

                    <div>

                      <p className="font-semibold">
                        {profileName}
                      </p>

                      <p className="text-sm text-gray-500 break-all">
                        {userEmail}
                      </p>

                    </div>

                  </div>

                </div>

                <button
                  onClick={
                    handleLogout
                  }
                  className="w-full text-left p-4 hover:bg-gray-100 flex items-center gap-3"
                >

                  <FiLogOut />

                  Logout

                </button>

              </div>
            )
          }

        </div>

      </div>

      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col">

     {/* DOCUMENT HEADER */}

{
  currentFileName && (
    <div className="bg-blue-100 border-b border-blue-300 px-6 py-3 font-medium">
      📄 {currentFileName}
    </div>
  )
}


{/* MESSAGES */}

<div className="flex-1 overflow-y-auto p-10 space-y-6">
          {
            messages.map(
              (msg, index) => (

                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[65%] px-6 py-4 rounded-3xl text-lg whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >

                    {msg.text}

                  </div>

                </div>
              )
            )
          }

        </div>

        {/* INPUT */}

        <div className="p-6">

          <div className="bg-white rounded-3xl border border-gray-200 flex items-center px-4 py-3 relative">

            {/* PLUS */}

            <button
              onClick={() =>
                setShowMenu(
                  !showMenu
                )
              }
              className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl"
            >

              <FiPlus />

            </button>

            {/* MENU */}

            {
              showMenu && (

                <div className="absolute bottom-20 left-0 bg-white shadow-2xl rounded-3xl w-[320px] p-3 z-50">

                  <button
                    onClick={() =>
                      fileInputRef.current.click()
                    }
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-2xl"
                  >

                    <FiFile />

                    Add photos & files

                  </button>

                  <button
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-2xl"
                  >

                    <FiClock />

                    Recent files

                  </button>

                  <button
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-2xl"
                  >

                    <FiImage />

                    Create image

                  </button>

                  <button
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-2xl"
                  >

                    <FiGlobe />

                    Web search

                  </button>

                </div>
              )
            }

            {/* FILE */}

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={(e) =>
                setSelectedFile(
                  e.target.files[0]
                )
              }
            />

            {/* INPUT */}

            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              className="flex-1 px-6 text-xl outline-none"
            />

            {/* SEND */}

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-lg font-semibold"
            >

              Send

            </button>

          </div>

          {/* FILE NAME */}

          {
            selectedFile && (

              <div className="mt-3 text-gray-600">

                Selected File:
                {" "}
                {selectedFile.name}

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}
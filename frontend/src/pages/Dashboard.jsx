import React, { useState } from "react";

import axios from "axios";

export default function Dashboard() {

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  const sendMessage = async () => {

    if (!message) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setChat([...chat, userMessage]);

    try {

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",

          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        },
        {
          headers: {
            Authorization:
              "Bearer YOUR_OPENROUTER_API_KEY",

            "Content-Type": "application/json",
          },
        }
      );

      const aiReply =
        response.data.choices[0].message.content;

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
        },
      ]);

      setMessage("");

    } catch (error) {

      console.log(error);

      alert("Error generating response");

    }

  };

  return (

    <div className="flex h-screen bg-[#f4f7fc]">

      {/* SIDEBAR */}

      <div className="w-80 bg-[#13213d] text-white p-6">

        <h1 className="text-3xl font-bold mb-10">
          Knowledge-Based FAQ
        </h1>

        <div className="space-y-5">

          <button className="w-full bg-blue-600 p-4 rounded-xl">
            New Chat
          </button>

          <button className="w-full bg-gray-700 p-4 rounded-xl">
            FAQ History
          </button>

        </div>

      </div>

      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col">

        <div className="flex-1 overflow-y-auto p-10">

          {chat.map((msg, index) => (

            <div
              key={index}
              className={`mb-5 ${
                msg.sender === "user"
                  ? "text-right"
                  : "text-left"
              }`}
            >

              <div
                className={`inline-block px-6 py-4 rounded-2xl max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white shadow"
                }`}
              >

                {msg.text}

              </div>

            </div>

          ))}

        </div>

        <div className="p-6 bg-white border-t flex gap-4">

          <input
            type="text"
            placeholder="Ask anything about business documents..."
            className="flex-1 border p-4 rounded-xl"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-8 rounded-xl"
          >

            Send

          </button>

        </div>

      </div>

    </div>
  );
}
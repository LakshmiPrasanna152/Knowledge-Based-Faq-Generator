import React from "react";

export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto px-10 py-8">

      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">

          <div className="text-center">

            <h1 className="text-5xl font-bold text-[#13213d] mb-5">
              Knowledge-Based FAQ AI
            </h1>

            <p className="text-gray-500 text-xl">
              Upload business documents and ask anything
            </p>

          </div>

        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-6 flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl px-6 py-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
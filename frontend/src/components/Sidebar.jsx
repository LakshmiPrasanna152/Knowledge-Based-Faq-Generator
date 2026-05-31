import React, { useState } from "react";

import { FiPlus } from "react-icons/fi";

export default function Sidebar({
  chats,
  setSelectedChat,
  createNewChat,
  userEmail,
  logout,
}) {

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  // FORMAT NAME FROM EMAIL
  const formatNameFromEmail = (email) => {

    if (!email) return "User";

    const username = email.split("@")[0];

    const cleanName =
      username.replace(/[0-9]/g, "");

    const words =
      cleanName.match(/[A-Z]?[a-z]+/g);

    if (!words) return username;

    return words
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  const userName =
    formatNameFromEmail(userEmail);

  // PROFILE LETTER
  const profileLetter = userName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="w-[300px] bg-[#1c3362] text-white h-screen flex flex-col relative">

      {/* TOP */}
      <div className="p-5 border-b border-gray-700">

        <h1 className="text-2xl font-bold mb-6">
          Knowledge-Based FAQ
        </h1>

        {/* NEW CHAT */}
        <button
          onClick={createNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 flex items-center justify-center gap-2 font-semibold"
        >
          <FiPlus size={20} />
          New Chat
        </button>

      </div>

      {/* HISTORY */}
      <div className="flex-1 overflow-y-auto p-4">

        <h2 className="text-lg font-semibold mb-4">
          History
        </h2>

        {chats.length === 0 ? (

          <div className="text-gray-400 text-sm bg-[#1d2f52] rounded-xl p-4">
            No chats available
          </div>

        ) : (

          chats.map((chat, index) => (

            <div
              key={index}
              onClick={() =>
                setSelectedChat(index)
              }
              className="bg-[#1d2f52] hover:bg-[#27406e] transition cursor-pointer p-4 rounded-xl mb-3"
            >
              <p className="font-medium">
                {chat.title}
              </p>
            </div>

          ))

        )}

      </div>

      {/* PROFILE SECTION */}
      <div className="p-4 border-t border-gray-700 relative">

        {/* PROFILE BUTTON */}
        <div
          onClick={() =>
            setShowProfileMenu(
              !showProfileMenu
            )
          }
          className="bg-[#1d2f52] hover:bg-[#27406e] transition rounded-2xl p-4 cursor-pointer"
        >

          <div className="flex items-center gap-4">

            {/* PROFILE ICON */}
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">

              {profileLetter}

            </div>

            {/* NAME */}
            <div className="flex-1 overflow-hidden">

              <p className="text-sm text-gray-300">
                
              </p>

              <p className="font-semibold text-lg truncate">
                {userName}
              </p>

            </div>

          </div>

        </div>

        {/* PROFILE POPUP */}
        {showProfileMenu && (

          <div className="absolute bottom-28 left-4 right-4 bg-white text-black rounded-2xl shadow-2xl overflow-hidden z-50">

            {/* USER INFO */}
            <div className="p-5 border-b">

              <div className="flex items-center gap-4">

                {/* ICON */}
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">

                  {profileLetter}

                </div>

                {/* DETAILS */}
                <div>

                  <h2 className="font-bold text-lg">
                    {userName}
                  </h2>

                  <p className="text-gray-500 text-sm break-all">
                    {userEmail}
                  </p>

                </div>

              </div>

            </div>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="w-full text-left px-5 py-4 hover:bg-red-50 text-red-500 font-semibold transition"
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>
  );
}
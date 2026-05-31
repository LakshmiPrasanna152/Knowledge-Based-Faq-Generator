import React from "react";

export default function Navbar() {
  return (
    <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-700">

      <h1 className="text-2xl">
        AI FAQ Generator
      </h1>

      <a
        href="/profile"
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Profile
      </a>
    </div>
  );
}
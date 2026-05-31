import React from "react";

export default function Profile() {
  return (
    <div className="h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-gray-900 p-10 rounded-xl w-96">

        <h1 className="text-3xl mb-5">
          User Profile
        </h1>

        <p className="mb-3">
          Username: User
        </p>

        <p className="mb-3">
          Email: user@gmail.com
        </p>

        <button
          className="bg-red-600 px-5 py-2 rounded"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}
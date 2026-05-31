import React from "react";

export default function UploadMenu({
  handleFileUpload,
  recentFiles,
  createImage,
  webSearch,
}) {
  return (
    <div className="absolute bottom-20 left-0 bg-white shadow-2xl rounded-2xl w-72 border border-gray-200 z-50">

      {/* FILE */}
      <label className="flex items-center gap-3 px-5 py-4 hover:bg-gray-100 cursor-pointer rounded-t-2xl">

        📎 Add photos & files

        <input
          type="file"
          hidden
          onChange={handleFileUpload}
        />
      </label>

      {/* RECENT */}
      <div className="px-5 py-4 border-t">

        <h3 className="font-semibold mb-2">
          Recent Files
        </h3>

        {recentFiles.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No recent files
          </p>
        ) : (
          recentFiles.map((file, index) => (
            <p
              key={index}
              className="text-sm text-gray-600"
            >
              {file}
            </p>
          ))
        )}
      </div>

      {/* CREATE IMAGE */}
      <button
        onClick={createImage}
        className="w-full text-left px-5 py-4 border-t hover:bg-gray-100"
      >
        🎨 Create Image
      </button>

      {/* WEB SEARCH */}
      <button
        onClick={webSearch}
        className="w-full text-left px-5 py-4 border-t hover:bg-gray-100 rounded-b-2xl"
      >
        🌐 Web Search
      </button>

    </div>
  );
}
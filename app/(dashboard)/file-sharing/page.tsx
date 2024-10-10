"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface SharedFile {
  id: number;
  originalName: string;
  customName: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
}

const FileSharingPage: React.FC = () => {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [customName, setCustomName] = useState<string>("");

  useEffect(() => {
    const storedFiles = localStorage.getItem("sharedFiles");
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    } else {
      // Add mock data if no files are stored
      const mockFiles: SharedFile[] = [
        {
          id: 1,
          originalName: "document.pdf",
          customName: "Important Document",
          size: "1024.00 KB",
          type: "application/pdf",
          uploadedBy: "John Doe",
          uploadDate: new Date().toISOString(),
        },
        {
          id: 2,
          originalName: "image.jpg",
          customName: "Profile Picture",
          size: "512.50 KB",
          type: "image/jpeg",
          uploadedBy: "Jane Smith",
          uploadDate: new Date().toISOString(),
        },
      ];
      setFiles(mockFiles);
      localStorage.setItem("sharedFiles", JSON.stringify(mockFiles));
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: SharedFile = {
        id: Date.now(),
        originalName: file.name,
        customName: customName || file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type || "Unknown", // Add fallback for empty type
        uploadedBy: "Current User",
        uploadDate: new Date().toISOString(),
      };
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem("sharedFiles", JSON.stringify(updatedFiles));
      setCustomName("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition duration-300"
          >
            Upload File
          </label>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Shared Files</h2>
          {files.length === 0 ? (
            <p className="text-blue-600 text-center">No files uploaded yet. Start sharing!</p>
          ) : (
            <ul className="space-y-4">
              {files.map((file) => (
                <li key={file.id} className="bg-white p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-blue-700">{file.originalName}</strong>
                      <p className="text-sm text-blue-600">
                        {file.size} | {file.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-500">Uploaded by {file.uploadedBy}</p>
                      <p className="text-xs text-blue-400">
                        {new Date(file.uploadDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSharingPage;
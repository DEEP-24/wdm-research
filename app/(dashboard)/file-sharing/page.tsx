"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface SharedFile {
  id: number;
  name: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
}

const FileSharingPage: React.FC = () => {
  const [files, setFiles] = useState<SharedFile[]>([]);

  useEffect(() => {
    const storedFiles = localStorage.getItem("sharedFiles");
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: SharedFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedBy: "Current User", // In a real app, this would be the current user's name
        uploadDate: new Date().toISOString(),
      };
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem("sharedFiles", JSON.stringify(updatedFiles));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">File Sharing</h1>
      <input type="file" onChange={handleFileUpload} className="mb-4" />
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Shared Files</h2>
        <ul>
          {files.map((file) => (
            <li key={file.id} className="mb-2">
              <strong>{file.name}</strong> ({file.size}) - Uploaded by {file.uploadedBy} on{" "}
              {new Date(file.uploadDate).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileSharingPage;

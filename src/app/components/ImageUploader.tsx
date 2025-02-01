// components/ImageUploader.tsx
"use client";

import React, { useRef } from "react";

interface ImageUploaderProps {
  onCapture: (imageSrc: string) => void;
}

export default function ImageUploader({ onCapture }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onCapture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              onCapture(reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  return (
    <div
      onPaste={handlePaste}
      className="border-2 border-black p-4 rounded-lg text-center cursor-text bg-white/50"
      style={{ minHeight: "150px" }}
    >
      <p className="mb-2 font-mono text-sm text-gray-700">
        Paste an image from your clipboard here
      </p>
      <p className="mb-2 font-mono text-sm text-gray-700">OR</p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-black text-white rounded-lg font-mono text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
      >
        Upload Image
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
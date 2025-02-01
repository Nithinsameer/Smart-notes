// "use client"

// import React, { useState } from "react"
// import CameraComponent from "./components/Camera"
// import ImageProcessor from "./components/ImageProcessor"
// import ResultsDisplay from "./components/ResultsDisplay"
// import CopyButton from "./components/CopyButton"
// import { ArrowLeft } from "lucide-react"
// import type { ExtractedText } from "@/lib/schema"

// export default function Home() {
//   const [imageSrc, setImageSrc] = useState<string | null>(null)
//   const [extractedData, setExtractedData] = useState<ExtractedText | null>(null)

//   const handleCapture = (capturedImageSrc: string) => {
//     setImageSrc(capturedImageSrc)
//   }

//   const handleProcessed = (result: ExtractedText) => {
//     console.log("Received processed result:", result);
//     setExtractedData(result)
//   }

//   const resetApp = () => {
//     setImageSrc(null)
//     setExtractedData(null)
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-[#DBFFD9] via-[#e5ffe3] to-[#f0fff0] flex items-center">
//       <div className="w-full max-w-[1400px] mx-auto p-3 md:p-4 flex flex-col">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-center text-black font-mono">
//             AI-Powered Handwriting OCR
//           </h1>
//           <p className="text-center text-gray-700 text-sm mt-1 font-mono">Transform your handwritten notes into digital text instantly</p>
//         </div>
        
//         <div className="flex-1">
//           {!imageSrc ? (
//             <div className="max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
//               <div className="bg-white/80 p-4 rounded-xl shadow-md border-[3px] border-black">
//                 <CameraComponent onCapture={handleCapture} />
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn max-w-6xl mx-auto">
//               {/* Left Column - Image */}
//               <div className="space-y-3">
//                 <div className="bg-white/80 rounded-xl shadow-md border-[3px] border-black">
//                   <img
//                     src={imageSrc}
//                     alt="Captured"
//                     className="w-full h-auto rounded-lg"
//                   />
//                 </div>
//                 {!extractedData && (
//                   <div className="bg-white/80 rounded-xl border-[3px] border-black shadow-md">
//                     <ImageProcessor imageSrc={imageSrc} onProcessed={handleProcessed} />
//                   </div>
//                 )}
//                 <button 
//                   onClick={resetApp} 
//                   className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-mono text-sm font-medium group hover:bg-gray-800 transition-colors duration-200"
//                 >
//                   <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" /> 
//                   Take Another Photo
//                 </button>
//               </div>

//               {/* Right Column - Results */}
//               <div>
//                 {extractedData && (
//                   <div className="bg-gradient-to-br from-[#f1f1ff] to-[#e4d5ff] p-4 rounded-xl shadow-md border-[3px] border-black h-full">
//                     <div className="overflow-y-auto font-mono max-h-[calc(100vh-280px)]">
//                       <ResultsDisplay result={extractedData} />
//                     </div>
//                     <div className="mt-4 flex justify-end">
//                       <div className="bg-white rounded-lg border border-black">
//                         <CopyButton 
//                           text={`${extractedData.text.trim()}\n\n${
//                             extractedData.keyPoints?.length 
//                               ? `Key Points:\n${extractedData.keyPoints.map(point => `• ${point.trim()}`).join('\n')}\n\n`
//                               : ''
//                           }${
//                             extractedData.actionItems?.length 
//                               ? `Action Items:\n${extractedData.actionItems.map(item => `☐ ${item.trim()}`).join('\n')}`
//                               : ''
//                           }`} 
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }


// -------------------------------------------------------------- multi image input code --------------------------------------
// app/page.tsx
"use client";

import React, { useState } from "react";
import CameraComponent from "./components/Camera";
import ImageUploader from "./components/ImageUploader";
import ResultsDisplay from "./components/ResultsDisplay";
import CopyButton from "./components/CopyButton";
import { ArrowLeft } from "lucide-react";
import type { ExtractedText } from "@/lib/schema";

// A new component that shows two tab-like buttons and renders the corresponding input UI.
function ImageInputTabs({ onCapture }: { onCapture: (imageSrc: string) => void }) {
  const [selectedTab, setSelectedTab] = useState<"capture" | "upload">("capture");

  return (
    <div className="bg-white/80 p-4 rounded-xl shadow-md border-[3px] border-black">
      {/* Tab Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setSelectedTab("capture")}
          className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-colors duration-200 ${
            selectedTab === "capture" 
              ? "bg-black text-white" 
              : "bg-white text-black border-[2px] border-black hover:bg-gray-100"
          }`}
        >
          Capture Image
        </button>
        <button
          onClick={() => setSelectedTab("upload")}
          className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-colors duration-200 ${
            selectedTab === "upload" 
              ? "bg-black text-white" 
              : "bg-white text-black border-[2px] border-black hover:bg-gray-100"
          }`}
        >
          Upload/Paste Image
        </button>
      </div>
      {/* Content for the selected tab */}
      <div>
        {selectedTab === "capture" ? (
          <CameraComponent onCapture={onCapture} />
        ) : (
          <ImageUploader onCapture={onCapture} />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  // State for mode selection and optional remarks
  const [mode, setMode] = useState<"extraction" | "summary" | null>(null);
  const [remarks, setRemarks] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  // State for image capture and processing
  const [images, setImages] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedText | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Append a new image (up to 3)
  const handleCapture = (capturedImageSrc: string) => {
    if (images.length < 3) {
      setImages((prev) => [...prev, capturedImageSrc]);
    }
  };

  // Process images by calling the API with the chosen mode and remarks.
  const processImages = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/extract-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, mode, remarks }),
      });
      if (!res.ok) {
        throw new Error("Failed to process images");
      }
      const result = await res.json();
      setExtractedData(result);
      setSubmitted(true);
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset all states so the user can start over.
  const resetApp = () => {
    setImages([]);
    setExtractedData(null);
    setSubmitted(false);
    setMode(null);
    setRemarks("");
    setHasStarted(false);
  };

  // Before starting image capture, show the mode selection UI.
  if (!hasStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#DBFFD9] via-[#e5ffe3] to-[#f0fff0] flex items-center">
        <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-md border-[3px] border-black text-center">
          <h1 className="text-3xl font-bold mb-4 font-mono">Select Extraction Mode</h1>
          <div className="mb-4">
            <label className="mr-4 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="extraction"
                checked={mode === "extraction"}
                onChange={() => setMode("extraction")}
                className="mr-1 cursor-pointer"
              />
              Text Extraction Only
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="summary"
                checked={mode === "summary"}
                onChange={() => setMode("summary")}
                className="mr-1 cursor-pointer"
              />
              Summary Format (with key points and action items)
            </label>
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Optional: Add remarks about your note taking style..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>
          <button
            onClick={() => setHasStarted(true)}
            disabled={!mode}
            className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-mono text-sm font-medium transition-colors duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Capturing Images
          </button>
        </div>
      </main>
    );
  }

  // After starting, show the image capture/upload UI along with the rest of the app.
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#DBFFD9] via-[#e5ffe3] to-[#f0fff0] flex items-center">
      <div className="w-full max-w-[1400px] mx-auto p-3 md:p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-black font-mono">
            AI-Powered Handwriting OCR
          </h1>
          <p className="text-center text-gray-700 text-sm mt-1 font-mono">
            Transform your handwritten notes into digital text instantly
          </p>
        </div>

        {/* Before processing, show the capture/upload view */}
        {!submitted && (
          <div className="max-w-2xl mx-auto text-center space-y-4">
            {images.length > 0 && (
              <div className="flex justify-center gap-3 mb-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="bg-white/80 rounded-xl shadow-md border-[3px] border-black p-1"
                  >
                    <img
                      src={img}
                      alt={`Captured ${index + 1}`}
                      className="w-32 h-auto rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Show a unified box with tabbed options */}
            {images.length < 3 && <ImageInputTabs onCapture={handleCapture} />}

            {images.length > 0 && (
              <button
                onClick={processImages}
                disabled={isProcessing}
                className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-mono text-sm font-medium transition-colors duration-200 hover:bg-gray-800"
              >
                {isProcessing ? "Processing..." : "Process Images"}
              </button>
            )}
          </div>
        )}

        {/* Once processing is complete, display the results */}
        {submitted && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn max-w-6xl mx-auto">
            {/* Left Column: Thumbnails and Reset button */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="bg-white/80 rounded-xl shadow-md border-[3px] border-black p-1"
                  >
                    <img
                      src={img}
                      alt={`Captured ${index + 1}`}
                      className="w-32 h-auto rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={resetApp}
                className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-mono text-sm font-medium transition-colors duration-200 hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200" />
                Reset
              </button>
            </div>

            {/* Right Column: Results Display */}
            <div>
              {extractedData && (
                <div className="bg-gradient-to-br from-[#f1f1ff] to-[#e4d5ff] p-4 rounded-xl shadow-md border-[3px] border-black h-full">
                  <div className="overflow-y-auto font-mono max-h-[calc(100vh-280px)]">
                    <ResultsDisplay result={extractedData} />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="bg-white rounded-lg border border-black">
                      <CopyButton
                        text={
                          mode === "extraction"
                            ? extractedData.text.trim()
                            : `${extractedData.text.trim()}\n\n${
                                extractedData.keyPoints?.length
                                  ? `Key Points:\n${extractedData.keyPoints
                                      .map((point) => `• ${point.trim()}`)
                                      .join("\n")}\n\n`
                                  : ""
                              }${
                                extractedData.actionItems?.length
                                  ? `Action Items:\n${extractedData.actionItems
                                      .map((item) => `☐ ${item.trim()}`)
                                      .join("\n")}`
                                  : ""
                              }`
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
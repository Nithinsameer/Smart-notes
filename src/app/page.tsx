"use client"

import React, { useState } from "react"
import CameraComponent from "./components/Camera"
import ImageProcessor from "./components/ImageProcessor"
import ResultsDisplay from "./components/ResultsDisplay"
import CopyButton from "./components/CopyButton"
import { ArrowLeft } from "lucide-react"
import type { ExtractedText } from "@/lib/schema"

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedText | null>(null)

  const handleCapture = (capturedImageSrc: string) => {
    setImageSrc(capturedImageSrc)
  }

  const handleProcessed = (result: ExtractedText) => {
    console.log("Received processed result:", result);
    setExtractedData(result)
  }

  const resetApp = () => {
    setImageSrc(null)
    setExtractedData(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#DBFFD9] via-[#e5ffe3] to-[#f0fff0] flex items-center">
      <div className="w-full max-w-[1400px] mx-auto p-3 md:p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-black font-mono">
            AI-Powered Handwriting OCR
          </h1>
          <p className="text-center text-gray-700 text-sm mt-1 font-mono">Transform your handwritten notes into digital text instantly</p>
        </div>
        
        <div className="flex-1">
          {!imageSrc ? (
            <div className="max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
              <div className="bg-white/80 p-4 rounded-xl shadow-md border-[3px] border-black">
                <CameraComponent onCapture={handleCapture} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn max-w-6xl mx-auto">
              {/* Left Column - Image */}
              <div className="space-y-3">
                <div className="bg-white/80 rounded-xl shadow-md border-[3px] border-black">
                  <img
                    src={imageSrc}
                    alt="Captured"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                {!extractedData && (
                  <div className="bg-white/80 rounded-xl border-[3px] border-black shadow-md">
                    <ImageProcessor imageSrc={imageSrc} onProcessed={handleProcessed} />
                  </div>
                )}
                <button 
                  onClick={resetApp} 
                  className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg font-mono text-sm font-medium group hover:bg-gray-800 transition-colors duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" /> 
                  Take Another Photo
                </button>
              </div>

              {/* Right Column - Results */}
              <div>
                {extractedData && (
                  <div className="bg-gradient-to-br from-[#f1f1ff] to-[#e4d5ff] p-4 rounded-xl shadow-md border-[3px] border-black h-full">
                    <div className="overflow-y-auto font-mono max-h-[calc(100vh-280px)]">
                      <ResultsDisplay result={extractedData} />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="bg-white rounded-lg border border-black">
                        <CopyButton 
                          text={`${extractedData.text.trim()}\n\n${
                            extractedData.keyPoints?.length 
                              ? `Key Points:\n${extractedData.keyPoints.map(point => `• ${point.trim()}`).join('\n')}\n\n`
                              : ''
                          }${
                            extractedData.actionItems?.length 
                              ? `Action Items:\n${extractedData.actionItems.map(item => `☐ ${item.trim()}`).join('\n')}`
                              : ''
                          }`} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
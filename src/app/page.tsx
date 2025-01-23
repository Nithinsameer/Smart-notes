"use client"

import React, { useState } from "react"
import CameraComponent from "./components/Camera"
import ImageProcessor from "./components/ImageProcessor"
import ResultsDisplay from "./components/ResultsDisplay"
import CopyButton from "./components/CopyButton"
// import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")

  const handleCapture = (capturedImageSrc: string) => {
    setImageSrc(capturedImageSrc)
  }

  const handleProcessed = (text: string) => {
    setExtractedText(text)
  }

  const resetApp = () => {
    setImageSrc(null)
    setExtractedText("")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">AI-Powered Handwriting OCR</h1>
        {!imageSrc ? (
          <CameraComponent onCapture={handleCapture} />
        ) : (
          <>
            <div className="mb-4">
              <img
                src={imageSrc || "/placeholder.svg"}
                alt="Captured"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <ImageProcessor imageSrc={imageSrc} onProcessed={handleProcessed} />
            {extractedText && (
              <>
                <ResultsDisplay text={extractedText} />
                <div className="mt-4 flex justify-between">
                  <button onClick={resetApp} className="flex items-center px-4 py-2 border rounded-lg">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Take Another Photo
                  </button>
                  <CopyButton text={extractedText} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}


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
//     <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
//         <h1 className="text-4xl font-bold mb-8 text-center">AI-Powered Handwriting OCR</h1>
//         {!imageSrc ? (
//           <CameraComponent onCapture={handleCapture} />
//         ) : (
//           <>
//             <div className="mb-4">
//               <img
//                 src={imageSrc}
//                 alt="Captured"
//                 className="max-w-full h-auto rounded-lg shadow-lg"
//               />
//             </div>
//             <ImageProcessor imageSrc={imageSrc} onProcessed={handleProcessed} />
//             {extractedData && (
//               <>
//                 <ResultsDisplay result={extractedData} />
//                 <div className="mt-4 flex justify-between">
//                   <button 
//                     onClick={resetApp} 
//                     className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100"
//                   >
//                     <ArrowLeft className="mr-2 h-4 w-4" /> 
//                     Take Another Photo
//                   </button>
//                   <CopyButton 
//                     text={JSON.stringify({
//                       text: extractedData.text,
//                       keyPoints: extractedData.keyPoints,
//                       actionItems: extractedData.actionItems
//                     }, null, 2)} 
//                   />
//                 </div>
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </main>
//   )
// }
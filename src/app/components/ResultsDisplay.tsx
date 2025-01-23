"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { ExtractedText } from "@/lib/schema";

interface ResultsDisplayProps {
  text: string;
}

export default function ResultsDisplay({ text }: ResultsDisplayProps) {
  // Try to parse the text as JSON in case it's structured
  let structuredData: ExtractedText | null = null;
  try {
    structuredData = JSON.parse(text) as ExtractedText;
  } catch {
    // If parsing fails, use the text as-is
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Extracted Text</h2>
        <ReactMarkdown className="prose">
          {structuredData?.text || text}
        </ReactMarkdown>
      </div>

      {structuredData?.keyPoints && structuredData.keyPoints.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-1">Key Points:</h3>
          <ul className="list-disc pl-5">
            {structuredData.keyPoints.map((point, index) => (
              <li key={index} className="mb-1">{point}</li>
            ))}
          </ul>
        </div>
      )}

      {structuredData?.actionItems && structuredData.actionItems.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-1">Action Items:</h3>
          <ul className="list-disc pl-5">
            {structuredData.actionItems.map((item, index) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// "use client";

// import React from "react";
// import ReactMarkdown from "react-markdown";
// import type { ExtractedText } from "@/lib/schema";

// interface ResultsDisplayProps {
//   result: ExtractedText;
// }

// export default function ResultsDisplay({ result }: ResultsDisplayProps) {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold mb-2">Extracted Text</h2>
//         <ReactMarkdown className="prose">
//           {result.text}
//         </ReactMarkdown>
//       </div>

//       {result.keyPoints.length > 0 && (
//         <div>
//           <h3 className="text-xl font-semibold mb-1">Key Points:</h3>
//           <ul className="list-disc pl-5">
//             {result.keyPoints.map((point, index) => (
//               <li key={index} className="mb-1">{point}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {result.actionItems.length > 0 && (
//         <div>
//           <h3 className="text-xl font-semibold mb-1">Action Items:</h3>
//           <ul className="list-disc pl-5">
//             {result.actionItems.map((item, index) => (
//               <li key={index} className="mb-1">{item}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
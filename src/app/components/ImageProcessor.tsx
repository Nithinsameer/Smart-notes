"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { experimental_useObject as useObject } from "ai/react";
import { extractedTextSchema } from "@/lib/schema";
import type { ExtractedText } from "@/lib/schema";

interface ImageProcessorProps {
  imageSrc: string | null;
  onProcessed: (text: string) => void;
//   onProcessed: (text: ExtractedText) => void;
}

export default function ImageProcessor({ imageSrc, onProcessed }: ImageProcessorProps) {
  // Add a ref to track if we've already processed this image
  const processedRef = React.useRef<string | null>(null);

  const {
    object: analysis,
    submit,
    isLoading,
    error
  } = useObject<ExtractedText>({
    api: "/api/extract-text",
    schema: extractedTextSchema
  });

  React.useEffect(() => {
    // Only submit if this is a new image we haven't processed yet
    if (imageSrc && processedRef.current !== imageSrc && !isLoading) {
      console.log("Processing new image...");
      processedRef.current = imageSrc; // Store the current image src
      submit({ image: imageSrc });
    }
  }, [imageSrc, submit, isLoading]);

  React.useEffect(() => {
    if (analysis?.text) {
      console.log("Calling onProcessed with:", analysis.text);
    //   onProcessed(analysis.text);
      onProcessed(analysis.text);
    }
  }, [analysis, onProcessed]);

  if (error) {
    console.error('Processing error:', error);
    return (
      <div className="text-red-500">
        Error processing image: {error.message}
      </div>
    );
  }

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Processing image...</span>
        </div>
      )}
    </div>
  );
}

// "use client";

// import React from "react";
// import { Loader2 } from "lucide-react";
// import { experimental_useObject as useObject } from "ai/react";
// import { extractedTextSchema } from "@/lib/schema";
// import type { ExtractedText } from "@/lib/schema";

// interface ImageProcessorProps {
//   imageSrc: string | null;
//   onProcessed: (text: ExtractedText) => void;
// }

// export default function ImageProcessor({ imageSrc, onProcessed }: ImageProcessorProps) {
//   // Keep track of processed images
//   const processedRef = React.useRef<string | null>(null);

//   const {
//     object: analysis,
//     submit,
//     isLoading,
//     error
//   } = useObject<ExtractedText>({
//     api: "/api/extract-text",
//     schema: extractedTextSchema
//   });

//   React.useEffect(() => {
//     // Only submit if this is a new image we haven't processed yet
//     if (imageSrc && processedRef.current !== imageSrc && !isLoading) {
//       console.log("Processing new image...");
//       processedRef.current = imageSrc; // Store the current image src
//       submit({ image: imageSrc });
//     }
//   }, [imageSrc, submit, isLoading]);

//   React.useEffect(() => {
//     // Make sure we have a complete analysis object before calling onProcessed
//     if (analysis && analysis.text && Array.isArray(analysis.keyPoints) && Array.isArray(analysis.actionItems)) {
//       console.log("Calling onProcessed with structured data:", analysis);
//       const structuredData: ExtractedText = {
//         text: analysis.text,
//         keyPoints: analysis.keyPoints.filter((point): point is string => point !== null && point !== undefined),
//         actionItems: analysis.actionItems.filter((item): item is string => item !== null && item !== undefined)
//       };
//       onProcessed(structuredData);
//     }
//   }, [analysis, onProcessed]);

//   if (error) {
//     console.error('Processing error:', error);
//     return (
//       <div className="text-red-500">
//         Error processing image: {error.message}
//       </div>
//     );
//   }

//   return (
//     <div>
//       {isLoading && (
//         <div className="flex items-center justify-center p-4">
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           <span>Processing image...</span>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";

// import React from "react";
// import { Loader2 } from "lucide-react";
// import { experimental_useObject as useObject } from "ai/react";
// import { extractedTextSchema } from "@/lib/schema";
// import type { ExtractedText } from "@/lib/schema";

// interface ImageProcessorProps {
//   imageSrc: string | null;
//   onProcessed: (text: string) => void;
// //   onProcessed: (text: ExtractedText) => void;
// }

// export default function ImageProcessor({ imageSrc, onProcessed }: ImageProcessorProps) {
//   // Add a ref to track if we've already processed this image
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
//     if (analysis?.text) {
//       console.log("Calling onProcessed with:", analysis.text);
//     //   onProcessed(analysis.text);
//       onProcessed(analysis.text);
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

"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { experimental_useObject as useObject } from "ai/react";
import { extractedTextSchema } from "@/lib/schema";
import type { ExtractedText } from "@/lib/schema";

interface ImageProcessorProps {
  imageSrc: string | null;
  onProcessed: (result: ExtractedText) => void;
}

export default function ImageProcessor({ imageSrc, onProcessed }: ImageProcessorProps) {
  // Keep track of processed images so we don't re-trigger on the same image
  const processedRef = React.useRef<string | null>(null);

  const {
    object: analysis,
    submit,
    isLoading,
    error
  } = useObject<ExtractedText>({
    api: "/api/extract-text",
    schema: extractedTextSchema,
  });

  React.useEffect(() => {
    // Only submit if this is a new image, not loading, etc.
    if (imageSrc && processedRef.current !== imageSrc && !isLoading) {
      processedRef.current = imageSrc;
      submit({ image: imageSrc });
    }
  }, [imageSrc, submit, isLoading]);

  React.useEffect(() => {
    // If analysis has *all* fields (text, keyPoints, and actionItems), pass it up
    // This check ensures we don't call onProcessed too early
    if (
      analysis?.text &&
      Array.isArray(analysis.keyPoints) &&
      Array.isArray(analysis.actionItems)
    ) {
      onProcessed(analysis as ExtractedText);
    }
  }, [analysis, onProcessed]);

  if (error) {
    console.error("Processing error:", error);
    return <div className="text-red-500">Error processing image: {error.message}</div>;
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
// // app/api/extract-text/route.ts
// import { extractedTextSchema } from "../../../lib/schema";
// import { google } from "@ai-sdk/google";
// import { streamObject } from "ai";

// export async function POST(req: Request) {
//   try {
//     const { image } = await req.json();
    
//     if (!image) {
//       return new Response("No image data provided", { status: 400 });
//     }

//     // Extract base64 data if it's a data URL
//     const base64Data = image.startsWith('data:image') ? image.split(',')[1] : image;

//     const result = await streamObject({
//       schema: extractedTextSchema,
//       model: google("gemini-1.5-flash-latest"),
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "image",
//               image: base64Data
//             },
//             {
//                 type: "text",
//                 text: `Analyze the text in this image and provide a structured response as follows:
  
//   1. First, extract all the text from the image
//   2. Then, identify any key points (look for bullet points, arrows, or numbered items)
//   3. Finally, identify any action items (tasks, to-dos, or required actions)
  
//   Return your response in this exact JSON format:
//   {
//     "text": "The full extracted text goes here",
//     "keyPoints": [
//       "First key point here",
//       "Second key point here",
//       "etc..."
//     ],
//     "actionItems": [
//       "First action item here",
//       "Second action item here",
//       "etc..."
//     ]
//   }
  
//   Note: Make sure to properly format all arrows, bullet points, and numbering in the extracted text.
//   Do not include any explanation or additional text outside the JSON structure.`
//               }
//           ],
//         },
//       ],
//     });

//     return result.toTextStreamResponse();
    
//   } catch (error) {
//     console.error('API Route Error:', error);
//     return new Response(JSON.stringify({ error: "Failed to process image" }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

import { extractedTextSchema } from "../../../lib/schema";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response("No image data provided", { status: 400 });
    }

    // Extract base64 data if it's a data URL
    const base64Data = image.startsWith('data:image') ? image.split(',')[1] : image;

    const result = await streamObject({
      schema: extractedTextSchema,
      model: google("gemini-1.5-flash-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: base64Data
            },
            {
                type: "text",
                text: `Extract text from this image and format it as follows:
                1. Extract the main text content
                2. Identify key points (starting with bullet points, numbers, or arrows)
                3. Identify action items (tasks, requirements, or needed actions)
                
                Format your response to match this structure:
                {
                  "text": "The complete extracted text",
                  "keyPoints": ["key point 1", "key point 2", ...],
                  "actionItems": ["action item 1", "action item 2", ...]`
            }
          ],
        },
      ],
    });

    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: "Failed to process image" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
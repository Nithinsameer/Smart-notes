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

// --------------------------------------------------- working code ----------------------------------
// // import { extractedTextSchema } from "../../../lib/schema";
// // import { extractedTextSchema } from "@/lib/schema";
// import { google } from "@ai-sdk/google";
// // import { streamObject } from "ai";
// import {generateObject} from 'ai';
// import { NextResponse } from "next/server";
// import { z } from 'zod';

// export async function POST(req: Request) {
//   try {
//     const { image } = await req.json();
    
//     if (!image) {
//       return new Response("No image data provided", { status: 400 });
//     }

//     // Extract base64 data if it's a data URL
//     const base64Data = image.startsWith('data:image') ? image.split(',')[1] : image;

//     const ExtractedTextSchema = z.object({
//       text: z.string(),
//       keyPoints: z.array(z.string()),
//       actionItems: z.array(z.string()),
//     })

//     // const extractedTextSchema = z.object({
//     //   summary: z.string(), // a short but helpful summary
//     //   keyPoints: z.array(z.string()), // bullet points
//     //   actionItems: z.array(z.string()), // tasks / next steps
//     // })

//     const result = await generateObject({
//       schema: ExtractedTextSchema,
//       model: google("gemini-1.5-flash-latest"),
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "image",
//               image: base64Data
//             },
// //             {
// //                 type: "text",
// //                 text: ` You are an AI that returns valid JSON only. 
// // Do not include any extra text or explanations outside of the JSON.
// // Return your response exactly in the following JSON format:
// //                 Extract text from this image and format it as follows:
// //                 1. Extract the main text content
// //                 2. Identify key points (starting with bullet points, numbers, or arrows)
// //                 3. Identify action items (tasks, requirements, or needed actions)
                
// //                 Format your response to match this structure:
// //                 {
// //                   "text": "The complete extracted text",
// //                   "keyPoints": ["key point 1", "key point 2", ...],
// //                   "actionItems": ["action item 1", "action item 2", ...]
// //                 }` 
// //             }
//             {
//               type: "text",
//               text: `You are an AI that reads the base64-encoded handwritten note below.
// 1. First, extract or transcribe as much text as you can.
// 2. Then analyze it deeply:
//    - Provide a short but comprehensive "Summary" explaining what the note is about and pass it in the text field.
//    - Identify the "Top 5 Key Points" or key ideas (or fewer if not enough content).
//    - Identify any "Action Items" or next steps that are implied or mentioned. If nothing is explicitly mentioned then from the summary and what you have understood from the image create the actions items from the content that you just analyzed.
// 3. Make your content helpful and neatly formatted for someone reading it digitally.
// 4. Return your final answer as valid JSON *only*, matching this shape:
// {
//   "text": "string",
//   "keyPoints": ["string", "string", ...],
//   "actionItems": ["string", "string", ...]
// }

// NO extra text. NO disclaimers outside the JSON.`
//             }
//           ],
//         },
//       ],
//     });

//     return NextResponse.json(result.object)
    
//   }catch (error) {
//     console.error("Extraction error:", error)
//     return new Response(JSON.stringify({ error: "Failed to process image" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// --------------------------------------------------- multiple image capture code ------------------------------------------

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the schemas outside of the handler function
const extractionSchema = z.object({
  text: z.string().describe("The complete extracted text"),
});

const summarySchema = z.object({
  text: z.string().describe("The summary of the note"),
  keyPoints: z.array(z.string()).describe("Key points from the note"),
  actionItems: z.array(z.string()).describe("Action items identified in the note"),
});

// Define types based on the ai package's CoreUserMessage interface
type ImagePart = {
  type: 'image';
  image: string;
};

type TextPart = {
  type: 'text';
  text: string;
};

export async function POST(req: Request) {
  try {
    // Expecting images (array), mode, and remarks in the payload
    const { images, mode, remarks } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response("No images data provided", { status: 400 });
    }
    if (images.length > 3) {
      return new Response("Too many images provided. Maximum 3 allowed.", { status: 400 });
    }
    if (!mode || (mode !== "extraction" && mode !== "summary")) {
      return new Response("Invalid mode provided", { status: 400 });
    }

    // Prepare each image: if it is a data URL, extract the base64 portion.
    const base64DataArray = images.map((img: string) =>
      img.startsWith("data:image") ? img.split(",")[1] : img
    );

    // Build an array of image message parts
    const imageMessages: ImagePart[] = base64DataArray.map((data) => ({
      type: "image",
      image: data,
    }));

    // Prepare the prompt based on the chosen mode.
    const schema = mode === "extraction" ? extractionSchema : summarySchema;
    const textInstruction = mode === "extraction"
      ? `You are an AI that extracts text from handwritten notes.
Use the provided images and the following user remarks (if any) to extract as much text as possible:
User Remarks: "${remarks || ""}"
Return your answer as valid JSON *only* in the following exact format:
{
  "text": "The complete extracted text"
}`
      : `You are an AI that reads handwritten notes.
Using the provided images and taking into account the following user remarks:
"${remarks || ""}"
first, extract as much text as possible, then analyze it to produce:
1. A concise summary of the note,
2. A list of key points (if applicable),
3. A list of action items (if applicable).
Return your final answer as valid JSON *only* exactly in this format:
{
  "text": "The summary of the note",
  "keyPoints": ["Key point 1", "Key point 2", ...],
  "actionItems": ["Action item 1", "Action item 2", ...]
}`;

    // Create the content array with proper typing
    const content: (ImagePart | TextPart)[] = [
      ...imageMessages,
      {
        type: "text",
        text: textInstruction,
      }
    ];

    // Generate the response using the appropriate schema
    const result = await generateObject({
      schema,
      model: google("gemini-1.5-flash-latest"),
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("Extraction error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process images" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
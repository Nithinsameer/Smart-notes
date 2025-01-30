// lib/schema.ts
import { z } from "zod";

export const extractedTextSchema = z.object({
  text: z.string().describe("The summary text based on the image"),
  keyPoints: z.array(z.string()).optional().describe("Key points extracted from the text"),
  actionItems: z.array(z.string()).optional().describe("Action items extracted from the text")
});

export type ExtractedText = z.infer<typeof extractedTextSchema>;
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { ExtractedText } from "@/lib/schema";

interface Props {
  result: ExtractedText;
}

export default function ResultsDisplay({ result }: Props) {
  const { text, keyPoints, actionItems } = result;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Summary</h2>
        <p className="mt-2">{text}</p>
      </div>

      {keyPoints?.length ? (
        <div>
          <h3 className="text-lg font-semibold mb-1">Key Points:</h3>
          <ul className="list-disc pl-5">
            {keyPoints.map((point, index) => (
              <li key={index} className="mb-1">{point}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {actionItems?.length ? (
        <div>
          <h3 className="text-lg font-semibold mb-1">Action Items:</h3>
          <ul className="list-none pl-5">
            {actionItems.map((item, index) => (
              <li key={index} className="mb-1 flex items-start">
                <span className="mr-2">☐</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
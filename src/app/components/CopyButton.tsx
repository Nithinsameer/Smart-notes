"use client"

import React from "react"
import { Copy, Check } from "lucide-react"

interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100"
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" /> Copy Text
        </>
      )}
    </button>
  )
}


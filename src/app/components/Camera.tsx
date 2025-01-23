"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw } from "lucide-react"

interface CameraProps {
  onCapture: (imageSrc: string) => void
}

const CameraComponent: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
          setStream(stream)
          setError(null)
        })
        .catch((err) => {
          console.error("Error accessing camera:", err)
          setError("Unable to access the camera. Please make sure you have granted the necessary permissions.")
        })
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  if (!mounted) return null

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
      const imageSrc = canvas.toDataURL("image/jpeg")
      onCapture(imageSrc)
    }
  }

  const retryCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    if (typeof window !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
          setStream(stream)
          setError(null)
        })
        .catch((err) => {
          console.error("Error accessing camera:", err)
          setError("Unable to access the camera. Please make sure you have granted the necessary permissions.")
        })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="max-w-full h-auto rounded-lg shadow-lg" />
          <div className="flex space-x-4">
            <Button onClick={captureImage}>
              <Camera className="mr-2 h-4 w-4" /> Capture Image
            </Button>
            <Button onClick={retryCamera} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry Camera
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default CameraComponent


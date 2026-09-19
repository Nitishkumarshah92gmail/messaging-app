"use client"

import { Phone, Video, PhoneOff, Mic, MicOff, VideoOff, Camera } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function CallModal({ type, isOpen, onClose, callerName }: { type: 'audio' | 'video', isOpen: boolean, onClose: () => void, callerName: string }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-between py-12">
      {/* Caller Info */}
      <div className="flex flex-col items-center mt-10">
        <div className="w-24 h-24 bg-[var(--wa-header)] rounded-full flex items-center justify-center mb-4 border border-[var(--wa-border)] shadow-xl overflow-hidden">
          {isVideoOff || !isAccepted || type === 'audio' ? (
            <span className="text-4xl font-light text-white">{callerName[0]}</span>
          ) : (
            <div className="w-full h-full bg-gray-800 animate-pulse"></div> // Placeholder for video stream
          )}
        </div>
        <h2 className="text-2xl font-medium text-white mb-2">{callerName}</h2>
        <p className="text-gray-400">
          {!isAccepted ? `Incoming ${type} call...` : "00:00"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mb-10">
        {isAccepted ? (
          <>
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={cn("p-4 rounded-full transition-colors shadow-lg", isVideoOff ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700")}
            >
              {isVideoOff ? <VideoOff size={24} /> : <Camera size={24} />}
            </button>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={cn("p-4 rounded-full transition-colors shadow-lg", isMuted ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700")}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button 
              onClick={onClose}
              className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
            >
              <PhoneOff size={24} />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={onClose}
              className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg animate-bounce"
            >
              <PhoneOff size={24} />
            </button>
            <button 
              onClick={() => setIsAccepted(true)}
              className="p-4 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors shadow-lg animate-bounce"
            >
              {type === 'audio' ? <Phone size={24} /> : <Video size={24} />}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Check, CheckCheck, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any
  isMe: boolean
  onReply: () => void
  onDelete: () => void
  onReact: (emoji: string) => void
}

export function MessageBubble({ message, isMe, onReply, onDelete }: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false)
  
  return (
    <div 
      className={cn("flex w-full mb-1 group", isMe ? "justify-end" : "justify-start")}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className={cn(
        "max-w-[65%] rounded-lg px-2.5 py-1.5 relative text-[14.2px] leading-relaxed shadow-sm",
        isMe ? "bg-[var(--color-wa-bubble-sent)] rounded-tr-none" : "bg-[var(--color-wa-bubble-recv)] rounded-tl-none"
      )}>
        
        {/* Tail (CSS triangle effect) */}
        <div className={cn(
          "absolute top-0 w-2 h-3",
          isMe ? "-right-2 bg-[var(--color-wa-bubble-sent)] [clip-path:polygon(0_0,0%_100%,100%_0)]" : "-left-2 bg-[var(--color-wa-bubble-recv)] [clip-path:polygon(100%_0,0_0,100%_100%)]"
        )}></div>

        {/* Hover Menu Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "absolute top-1 right-2 w-6 h-6 flex items-center justify-center opacity-0 transition-opacity z-10 rounded-full text-[var(--color-wa-text-muted)] hover:bg-black/10",
            isMe ? "bg-gradient-to-l from-[var(--color-wa-bubble-sent)] via-[var(--color-wa-bubble-sent)]" : "bg-gradient-to-l from-[var(--color-wa-bubble-recv)] via-[var(--color-wa-bubble-recv)]",
            "group-hover:opacity-100",
            showMenu && "opacity-100"
          )}
        >
          <ChevronDown size={18} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className={cn(
            "absolute top-8 z-50 w-48 bg-[var(--color-wa-panel)] rounded-sm shadow-xl overflow-hidden py-2 border border-[var(--color-wa-border)]",
            isMe ? "right-0" : "left-0"
          )}>
            <div className="flex flex-col text-[14.5px] text-[var(--color-wa-text)]">
              <button className="flex items-center px-6 py-3 hover:bg-white/5 transition-colors" onClick={onReply}>
                Reply
              </button>
              <button className="flex items-center px-6 py-3 hover:bg-white/5 transition-colors">
                React
              </button>
              <button className="flex items-center px-6 py-3 hover:bg-white/5 transition-colors">
                Forward
              </button>
              <button className="flex items-center px-6 py-3 hover:bg-white/5 transition-colors">
                Star
              </button>
              {isMe && (
                <>
                  <button className="flex items-center px-6 py-3 hover:bg-white/5 transition-colors text-red-400" onClick={onDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="pr-[4.5rem]">
          {message.mediaUrl && (
            <img src={message.mediaUrl} alt="media" className="rounded-lg mb-1 max-w-full h-auto max-h-[300px] object-cover cursor-pointer" />
          )}
          <span className="text-[var(--color-wa-text)] whitespace-pre-wrap break-words">{message.text}</span>
        </div>
        
        <div className="absolute right-2 bottom-1 flex items-center space-x-1 text-[11px] text-[var(--color-wa-text-muted)] whitespace-nowrap mt-1">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isMe && (
            <div className="ml-1">
              {message.status === "read" ? <CheckCheck size={16} className="text-[#53bdeb]" /> :
               message.status === "delivered" ? <CheckCheck size={16} /> :
               <Check size={16} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

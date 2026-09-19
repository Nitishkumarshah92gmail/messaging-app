"use client"

import { useState } from "react"
import { Check, CheckCheck, ChevronDown, Reply, Star, Trash2, Edit2, CornerUpRight, Smile } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any
  isMe: boolean
  onReply: () => void
  onDelete: () => void
  onReact: (emoji: string) => void
}

export function MessageBubble({ message, isMe, onReply, onDelete, onReact }: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false)
  
  return (
    <div 
      className={cn("flex w-full mb-6 group", isMe ? "justify-end" : "justify-start")}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className={cn(
        "max-w-[85%] md:max-w-[65%] rounded-3xl px-5 py-3 relative text-[15px] transition-transform duration-300",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] backdrop-blur-xl border border-white/20",
        isMe ? "bg-white/20 dark:bg-black/30 rounded-tr-sm" : "bg-white/40 dark:bg-white/10 rounded-tl-sm",
        "hover:scale-[1.01]"
      )}>
        
        {/* Hover Menu Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "absolute -top-3 right-2 w-8 h-8 rounded-full neu-button flex items-center justify-center opacity-0 transition-opacity z-10",
            "group-hover:opacity-100",
            showMenu && "opacity-100"
          )}
        >
          <ChevronDown size={16} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className={cn(
            "absolute top-6 z-50 w-48 glass-panel rounded-xl shadow-2xl overflow-hidden",
            isMe ? "right-0" : "left-0"
          )}>
            <div className="flex flex-col text-[14px]">
              <button className="flex items-center px-4 py-3 hover:bg-white/10 transition-colors" onClick={onReply}>
                <Reply size={16} className="mr-3" /> Reply
              </button>
              <button className="flex items-center px-4 py-3 hover:bg-white/10 transition-colors">
                <Smile size={16} className="mr-3" /> React
              </button>
              <button className="flex items-center px-4 py-3 hover:bg-white/10 transition-colors">
                <CornerUpRight size={16} className="mr-3" /> Forward
              </button>
              <button className="flex items-center px-4 py-3 hover:bg-white/10 transition-colors">
                <Star size={16} className="mr-3" /> Star
              </button>
              {isMe && (
                <>
                  <button className="flex items-center px-4 py-3 hover:bg-white/10 transition-colors">
                    <Edit2 size={16} className="mr-3" /> Edit
                  </button>
                  <button className="flex items-center px-4 py-3 text-red-500 hover:bg-white/10 transition-colors" onClick={onDelete}>
                    <Trash2 size={16} className="mr-3" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="pr-12">
          {message.mediaUrl && (
            <img src={message.mediaUrl} alt="media" className="rounded-xl mb-3 max-w-full h-auto max-h-[300px] object-cover shadow-sm border border-white/10" />
          )}
          <span className="leading-relaxed drop-shadow-sm font-medium opacity-90 text-[var(--foreground)]">{message.text}</span>
        </div>
        
        <div className="absolute right-4 bottom-2 flex items-center space-x-1 text-[11px] font-semibold opacity-60 whitespace-nowrap">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isMe && (
            message.status === "read" ? <CheckCheck size={14} className="text-blue-500 drop-shadow-md" /> :
            message.status === "delivered" ? <CheckCheck size={14} /> :
            <Check size={14} />
          )}
        </div>
      </div>
    </div>
  )
}

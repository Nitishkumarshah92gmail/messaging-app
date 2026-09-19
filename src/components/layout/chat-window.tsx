"use client"

import { useState, useEffect } from "react"
import { useChatStore } from "@/store/chat-store"
import { DUMMY_CHATS, DUMMY_MESSAGES } from "@/lib/dummy-data"
import { ArrowLeft, Search, MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send, Image as ImageIcon, FileText, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { Virtuoso } from "react-virtuoso"
import { MessageBubble } from "@/components/chat/message-bubble"
import { CallModal } from "@/components/chat/call-modal"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"

export function ChatWindow() {
  const { activeChatId, setActiveChatId } = useChatStore()
  const [inputText, setInputText] = useState("")
  const [showEmoji, setShowEmoji] = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const [callState, setCallState] = useState<{type: 'audio'|'video', open: boolean} | null>(null)
  const { theme } = useTheme()
  
  const activeChat = DUMMY_CHATS.find((c) => c.id === activeChatId)
  const messages = activeChatId ? (DUMMY_MESSAGES[activeChatId] || []) : []

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.emoji-btn') && !target.closest('.EmojiPickerReact')) setShowEmoji(false)
      if (!target.closest('.attach-btn') && !target.closest('.attach-menu')) setShowAttach(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!activeChatId || !activeChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center flex-col text-[var(--foreground)] relative">
        <div className="w-80 h-80 glass-panel rounded-full flex items-center justify-center mb-8 shadow-2xl relative z-10">
           <span className="text-3xl font-light drop-shadow-lg">ChatApp Web</span>
        </div>
        <h1 className="text-4xl font-light mb-4 drop-shadow-lg z-10">Liquid Experience</h1>
        <p className="text-lg opacity-80 z-10 font-medium">Send and receive messages in a futuristic UI.</p>
      </div>
    )
  }

  const renderMessage = (index: number) => {
    const msg = messages[index]
    const isMe = msg.senderId === "me"
    
    return (
      <MessageBubble 
        message={msg} 
        isMe={isMe} 
        onReply={() => console.log('Reply')}
        onDelete={() => console.log('Delete')}
        onReact={(emoji) => console.log('React:', emoji)}
      />
    )
  }

  const handleEmojiClick = (emojiData: any) => {
    setInputText((prev) => prev + emojiData.emoji)
  }

  return (
    <div className={cn(
      "w-full h-full flex flex-col relative",
      !activeChatId ? "hidden md:flex" : "flex flex-1"
    )}>
      {/* Header */}
      <div className="h-[70px] flex-shrink-0 glass-panel flex items-center justify-between px-6 z-10 rounded-b-2xl mx-4 mt-2">
        <div className="flex items-center">
          <button 
            className="md:hidden w-10 h-10 neu-button flex items-center justify-center mr-4"
            onClick={() => setActiveChatId(null)}
          >
            <ArrowLeft size={20} />
          </button>
          <img
            src={activeChat.user.avatar}
            alt={activeChat.user.name}
            className="w-12 h-12 rounded-full mr-4 cursor-pointer neu-flat p-0.5 object-cover"
          />
          <div className="cursor-pointer">
            <div className="font-semibold text-lg drop-shadow-sm">{activeChat.user.name}</div>
            <div className="text-xs opacity-70 font-medium">
              {activeChat.user.online ? "online" : activeChat.user.lastSeen || "offline"}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden sm:flex w-10 h-10 neu-button items-center justify-center" onClick={() => setCallState({type: 'video', open: true})}><Video size={18} /></button>
          <button className="hidden sm:flex w-10 h-10 neu-button items-center justify-center" onClick={() => setCallState({type: 'audio', open: true})}><Phone size={18} /></button>
          <div className="w-px h-6 bg-white/20 hidden sm:block mx-2"></div>
          <button className="w-10 h-10 neu-button flex items-center justify-center"><Search size={18} /></button>
          <button className="w-10 h-10 neu-button flex items-center justify-center"><MoreVertical size={18} /></button>
        </div>
      </div>

      {callState?.open && (
        <CallModal 
          type={callState.type} 
          isOpen={callState.open} 
          onClose={() => setCallState(null)} 
          callerName={activeChat.user.name} 
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative px-4 py-4 z-0">
        <Virtuoso
          data={messages}
          itemContent={renderMessage}
          initialTopMostItemIndex={messages.length - 1}
          className="h-full scroll-smooth"
          alignToBottom
        />
      </div>

      {/* Footer / Input Area */}
      <div className="glass-panel mx-4 mb-4 rounded-2xl flex items-center px-4 py-3 z-20 gap-3">
        
        {/* Emoji Picker Popup */}
        {showEmoji && (
          <div className="absolute bottom-24 left-4 z-50 shadow-2xl glass rounded-2xl overflow-hidden">
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
            />
          </div>
        )}

        {/* Attachment Menu Popup */}
        {showAttach && (
          <div className="attach-menu absolute bottom-24 left-16 z-50 glass-panel rounded-2xl p-6 flex gap-8">
             <div className="flex flex-col items-center gap-3 cursor-pointer group">
               <div className="w-16 h-16 rounded-full neu-button flex items-center justify-center group-hover:-translate-y-2 transition-transform"><FileText size={28}/></div>
               <span className="text-sm font-semibold">Document</span>
             </div>
             <div className="flex flex-col items-center gap-3 cursor-pointer group">
               <div className="w-16 h-16 rounded-full neu-button flex items-center justify-center group-hover:-translate-y-2 transition-transform"><ImageIcon size={28}/></div>
               <span className="text-sm font-semibold">Photos</span>
             </div>
             <div className="flex flex-col items-center gap-3 cursor-pointer group">
               <div className="w-16 h-16 rounded-full neu-button flex items-center justify-center group-hover:-translate-y-2 transition-transform"><Camera size={28}/></div>
               <span className="text-sm font-semibold">Camera</span>
             </div>
          </div>
        )}

        <button 
          className="emoji-btn w-12 h-12 neu-button flex items-center justify-center"
          onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
        >
          <Smile size={22} />
        </button>
        <button 
          className="attach-btn w-12 h-12 neu-button flex items-center justify-center"
          onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
        >
          <Paperclip size={22} className="rotate-45" />
        </button>
        
        <div className="flex-1">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full neu-input px-6 py-4 text-[16px] placeholder:opacity-50"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => { setShowEmoji(false); setShowAttach(false); }}
          />
        </div>
        
        <div className="flex-shrink-0">
          {inputText.trim() ? (
            <button className="w-14 h-14 neu-button flex items-center justify-center text-blue-500">
              <Send size={24} />
            </button>
          ) : (
            <button className="w-14 h-14 neu-button flex items-center justify-center">
              <Mic size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { useChatStore } from "@/store/chat-store"
import { Search, MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send, Image as ImageIcon, FileText, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { Virtuoso, VirtuosoHandle } from "react-virtuoso"
import { MessageBubble } from "@/components/chat/message-bubble"
import { CallModal } from "@/components/chat/call-modal"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import io from "socket.io-client"

// In a real app, this should be an environment variable.
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://messaging-app-backend-n5as.onrender.com";

export function ChatWindow() {
  const { activeChatId, setActiveChatId, users } = useChatStore()
  const [inputText, setInputText] = useState("")
  const [showEmoji, setShowEmoji] = useState(false)
  const [showAttach, setShowAttach] = useState(false)
  const [callState, setCallState] = useState<{type: 'audio'|'video', open: boolean} | null>(null)
  
  // Real Data State
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef<any>(null)
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const { theme } = useTheme()
  
  const activeChatUser = users.find((c) => c.id === activeChatId)

  // 1. Initialize Socket.IO connection
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentUserId = (session?.user as any)?.id;
    if (!currentUserId) return;

    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      console.log("Connected to socket server");
      socketRef.current.emit('setup', currentUserId);
    });

    socketRef.current.on('receive_message', (newMessage: any) => {
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => virtuosoRef.current?.scrollToIndex({ index: 'LAST', align: 'end' }), 100);
    });

    return () => {
      socketRef.current?.disconnect();
    }
  }, [session]);

  // 2. Fetch Messages when Active Chat Changes
  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/messages?userId=${activeChatId}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentChatId(data.chatId);
          setMessages(data.messages);
          if (socketRef.current) {
            socketRef.current.emit('join_chat', data.chatId);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  // 3. Handle external clicks for popups
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.emoji-btn') && !target.closest('.EmojiPickerReact')) setShowEmoji(false)
      if (!target.closest('.attach-btn') && !target.closest('.attach-menu')) setShowAttach(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!activeChatId || !activeChatUser) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center flex-col bg-[#222e35] relative border-b-[6px] border-[var(--color-wa-green)]">
        <div className="text-center">
          <h1 className="text-[32px] font-light text-[var(--color-wa-text)] mb-4">WhatsApp Web</h1>
          <p className="text-sm text-[var(--color-wa-text-muted)] max-w-md mx-auto leading-relaxed">
            Send and receive messages without keeping your phone online.<br/>
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    )
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentChatId) return;
    const text = inputText;
    setInputText("");

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: currentChatId, text })
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        if (socketRef.current) {
          socketRef.current.emit('send_message', newMessage);
        }
        setTimeout(() => virtuosoRef.current?.scrollToIndex({ index: 'LAST', align: 'end' }), 100);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const renderMessage = (index: number) => {
    const msg = messages[index]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isMe = msg.senderId === (session?.user as any)?.id;
    
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

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputText((prev) => prev + emojiData.emoji)
  }

  return (
    <div className={cn(
      "w-full h-full flex flex-col relative bg-[var(--color-wa-app-bg)]",
      !activeChatId ? "hidden md:flex" : "flex flex-1"
    )}>
      {/* Header */}
      <div className="h-[59px] flex-shrink-0 bg-[var(--color-wa-panel)] flex items-center justify-between px-4 z-10 border-l border-[var(--color-wa-border)]">
        <div className="flex items-center">
          <img
            src={activeChatUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChatUser.name}`}
            alt={activeChatUser.name}
            className="w-10 h-10 rounded-full mr-4 cursor-pointer object-cover"
          />
          <div className="cursor-pointer flex flex-col justify-center">
            <span className="font-medium text-base text-[var(--color-wa-text)] leading-tight">{activeChatUser.name}</span>
            <span className="text-xs text-[var(--color-wa-text-muted)]">
              {activeChatUser.isOnline ? "online" : activeChatUser.lastSeen ? `last seen ${new Date(activeChatUser.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}` : "offline"}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[var(--color-wa-text-muted)]">
          <button className="p-2 rounded-full hover:bg-white/10" onClick={() => setCallState({type: 'video', open: true})}><Video size={20} /></button>
          <button className="p-2 rounded-full hover:bg-white/10" onClick={() => setCallState({type: 'audio', open: true})}><Phone size={20} /></button>
          <div className="w-px h-6 bg-[var(--color-wa-border)] mx-2"></div>
          <button className="p-2 rounded-full hover:bg-white/10"><Search size={20} /></button>
          <button className="p-2 rounded-full hover:bg-white/10"><MoreVertical size={20} /></button>
        </div>
      </div>

      {callState?.open && (
        <CallModal 
          type={callState.type} 
          isOpen={callState.open} 
          onClose={() => setCallState(null)} 
          callerName={activeChatUser.name} 
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative px-[5%] py-4 z-0 bg-[#0b141a]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-[var(--color-wa-text-muted)]">Loading messages...</div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={messages}
            itemContent={renderMessage}
            initialTopMostItemIndex={messages.length > 0 ? messages.length - 1 : 0}
            className="h-full scroll-smooth"
            alignToBottom
          />
        )}
      </div>

      {/* Footer / Input Area */}
      <div className="bg-[var(--color-wa-panel)] flex items-center px-4 py-3 z-20 gap-2 min-h-[62px]">
        
        {/* Emoji Picker Popup */}
        {showEmoji && (
          <div className="absolute bottom-20 left-4 z-50 shadow-2xl rounded-lg overflow-hidden border border-[var(--color-wa-border)]">
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
            />
          </div>
        )}

        {/* Attachment Menu Popup */}
        {showAttach && (
          <div className="attach-menu absolute bottom-20 left-16 z-50 bg-[var(--color-wa-panel)] rounded-2xl p-4 flex gap-6 shadow-xl border border-[var(--color-wa-border)]">
             <div className="flex flex-col items-center gap-2 cursor-pointer group">
               <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white"><FileText size={24}/></div>
               <span className="text-xs text-[var(--color-wa-text)]">Document</span>
             </div>
             <div className="flex flex-col items-center gap-2 cursor-pointer group">
               <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white"><ImageIcon size={24}/></div>
               <span className="text-xs text-[var(--color-wa-text)]">Photos</span>
             </div>
             <div className="flex flex-col items-center gap-2 cursor-pointer group">
               <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white"><Camera size={24}/></div>
               <span className="text-xs text-[var(--color-wa-text)]">Camera</span>
             </div>
          </div>
        )}

        <button 
          className="emoji-btn p-2 text-[var(--color-wa-text-muted)] hover:text-[var(--color-wa-text)] transition-colors"
          onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
        >
          <Smile size={26} />
        </button>
        <button 
          className="attach-btn p-2 text-[var(--color-wa-text-muted)] hover:text-[var(--color-wa-text)] transition-colors"
          onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
        >
          <Paperclip size={24} />
        </button>
        
        <div className="flex-1 mx-2">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full bg-[var(--color-wa-input)] rounded-lg px-4 py-2.5 text-[15px] text-[var(--color-wa-text)] outline-none placeholder:text-[var(--color-wa-text-muted)]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onFocus={() => { setShowEmoji(false); setShowAttach(false); }}
          />
        </div>
        
        <div className="flex-shrink-0">
          {inputText.trim() ? (
            <button 
              className="p-2 text-[var(--color-wa-text-muted)] hover:text-[var(--color-wa-text)] transition-colors"
              onClick={handleSendMessage}
            >
              <Send size={24} />
            </button>
          ) : (
            <button className="p-2 text-[var(--color-wa-text-muted)] hover:text-[var(--color-wa-text)] transition-colors">
              <Mic size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

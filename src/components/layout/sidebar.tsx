"use client"

import { useState } from "react"
import { Search, MoreVertical, MessageSquarePlus, ArrowLeft, Check, Users } from "lucide-react"
import { CURRENT_USER, DUMMY_CHATS } from "@/lib/dummy-data"
import { useChatStore } from "@/store/chat-store"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Virtuoso } from "react-virtuoso"

export function Sidebar() {
  const { activeChatId, setActiveChatId } = useChatStore()
  const { setTheme, theme } = useTheme()
  const [filter, setFilter] = useState<"all" | "unread" | "groups">("all")
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [groupName, setGroupName] = useState("")

  if (showNewGroup) {
    return (
      <div className="w-full md:w-[400px] h-full flex flex-col bg-[var(--color-wa-bg)] z-20 border-r border-[var(--color-wa-border)]">
        <div className="h-[108px] bg-[var(--color-wa-panel)] flex items-end px-6 pb-4 text-[var(--color-wa-text)]">
          <div className="flex items-center space-x-6">
            <button onClick={() => setShowNewGroup(false)} className="hover:opacity-80 transition-opacity">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-medium">Add group subject</h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center pt-8 px-4 bg-[var(--color-wa-bg)]">
          <div className="w-48 h-48 bg-[var(--color-wa-panel)] rounded-full flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity mb-8">
            <span className="text-xs font-medium uppercase mt-2 text-[var(--color-wa-text-muted)]">Add group icon</span>
          </div>
          <div className="w-full p-2 border-b-2 border-[var(--color-wa-green)]">
            <input 
              type="text" 
              placeholder="Group subject" 
              className="w-full bg-transparent p-2 text-lg text-[var(--color-wa-text)] outline-none placeholder:text-[var(--color-wa-text-muted)]"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="mt-auto mb-8">
            <button 
              className="w-12 h-12 rounded-full bg-[var(--color-wa-green)] flex items-center justify-center text-white disabled:opacity-50"
              disabled={!groupName.trim()}
              onClick={() => setShowNewGroup(false)}
            >
              <Check size={24} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "w-full md:w-[400px] h-full flex flex-col bg-[var(--color-wa-bg)] border-r border-[var(--color-wa-border)] transition-transform duration-300",
      activeChatId ? "hidden md:flex" : "flex"
    )}>
      {/* Header */}
      <div className="h-[59px] flex-shrink-0 bg-[var(--color-wa-panel)] flex items-center justify-between px-4 z-10">
        <img
          src={CURRENT_USER.avatar}
          alt={CURRENT_USER.name}
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        />
        <div className="flex items-center space-x-3 text-[var(--color-wa-text-muted)]">
          <button className="p-2 rounded-full hover:bg-white/10" title="Communities">
            <Users size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10" onClick={() => setShowNewGroup(true)} title="New Chat">
            <MessageSquarePlus size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10" title="Menu">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-[var(--color-wa-border)]">
        <div className="bg-[var(--color-wa-input)] flex items-center px-4 py-1.5 rounded-lg">
          <Search size={18} className="text-[var(--color-wa-text-muted)] mr-4" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--color-wa-text-muted)]"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden relative">
        <Virtuoso
          data={DUMMY_CHATS}
          itemContent={(index, chat) => (
            <div 
              className={cn(
                "flex items-center px-3 cursor-pointer transition-colors",
                activeChatId === chat.id ? "bg-[var(--color-wa-panel)]" : "hover:bg-[var(--color-wa-panel)]"
              )}
              onClick={() => setActiveChatId(chat.id)}
            >
              <img src={chat.user.avatar} alt="" className="w-12 h-12 rounded-full mr-3 object-cover" />
              <div className="flex-1 min-w-0 border-b border-[var(--color-wa-border)] py-3 pr-4">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-base text-[var(--color-wa-text)] truncate">{chat.user.name}</span>
                  <span className="text-xs text-[var(--color-wa-text-muted)]">
                    {chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm truncate text-[var(--color-wa-text-muted)]">{chat.lastMessage?.text || ''}</span>
                  {chat.unreadCount > 0 && (
                    <span className="bg-[var(--color-wa-green)] text-[var(--color-wa-bg)] text-[11px] font-bold px-1.5 py-0.5 rounded-full ml-2">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          className="h-full scroll-smooth"
        />
      </div>
    </div>
  )
}

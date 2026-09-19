"use client"

import { useState } from "react"
import { Search, MoreVertical, MessageSquarePlus, ArrowLeft, Check } from "lucide-react"
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
      <div className="w-full md:w-[400px] h-full flex flex-col glass z-20 border-r border-white/10">
        <div className="h-[108px] glass-panel flex items-end px-6 pb-4 text-white">
          <div className="flex items-center space-x-6">
            <button onClick={() => setShowNewGroup(false)} className="hover:opacity-80 transition-opacity">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-medium">Add group subject</h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center pt-8 px-4">
          <div className="w-48 h-48 neu-flat rounded-full flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity mb-8">
            <span className="text-xs font-medium uppercase mt-2">Add group icon</span>
          </div>
          <div className="w-full p-2">
            <input 
              type="text" 
              placeholder="Group subject" 
              className="w-full neu-input p-4 text-lg"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="mt-auto mb-8">
            <button 
              className="w-16 h-16 neu-button flex items-center justify-center disabled:opacity-50"
              disabled={!groupName.trim()}
              onClick={() => {
                setShowNewGroup(false);
              }}
            >
              <Check size={28} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "w-full md:w-[400px] h-full flex flex-col glass border-r border-white/10 transition-transform duration-300",
      activeChatId ? "hidden md:flex" : "flex"
    )}>
      {/* Header */}
      <div className="h-[70px] flex-shrink-0 glass-panel flex items-center justify-between px-4 z-10">
        <img
          src={CURRENT_USER.avatar}
          alt={CURRENT_USER.name}
          className="w-12 h-12 rounded-full cursor-pointer hover:scale-105 transition-transform neu-flat p-0.5"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Theme"
        />
        <div className="flex items-center space-x-4">
          <button className="w-10 h-10 neu-button flex items-center justify-center" onClick={() => setShowNewGroup(true)} title="New Group">
            <MessageSquarePlus size={20} />
          </button>
          <button className="w-10 h-10 neu-button flex items-center justify-center">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="neu-input flex items-center px-4 py-2">
          <Search size={20} className="text-[var(--foreground)] opacity-50 mr-3" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-transparent outline-none placeholder:text-[var(--foreground)] placeholder:opacity-50"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pb-2 flex space-x-2">
        <button 
          className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", filter === "all" ? "neu-pressed" : "neu-button")}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all", filter === "unread" ? "neu-pressed" : "neu-button")}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden relative">
        <Virtuoso
          data={DUMMY_CHATS}
          itemContent={(index, chat) => (
            <div 
              className={cn(
                "flex items-center px-4 py-3 cursor-pointer transition-colors m-2 rounded-xl",
                activeChatId === chat.id ? "neu-pressed" : "hover:bg-white/10 dark:hover:bg-black/10"
              )}
              onClick={() => setActiveChatId(chat.id)}
            >
              <img src={chat.user.avatar} alt="" className="w-12 h-12 rounded-full mr-4 object-cover" />
              <div className="flex-1 min-w-0 border-b border-white/5 pb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-lg truncate drop-shadow-sm">{chat.user.name}</span>
                  <span className="text-xs opacity-70">
                    {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm truncate opacity-80">{chat.lastMessage.text}</span>
                  {chat.unreadCount > 0 && (
                    <span className="bg-white text-black dark:bg-black dark:text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 neu-flat">
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

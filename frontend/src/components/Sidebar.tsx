"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  user: User;
  activeChat: string | null;
  setActiveChat: (id: string) => void;
}

export default function Sidebar({ user, activeChat, setActiveChat }: SidebarProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [view, setView] = useState<'chats' | 'users'>('chats');

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
  }, [user.id]);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('conversation_members')
      .select(`
        conversation_id,
        conversations ( id, name, is_group, last_message_at )
      `)
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (data && !error) {
      setConversations(data.map(d => d.conversations));
    }
  };

  const fetchAllUsers = async () => {
    // Fetch all profiles except the current user
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id);
      
    if (data && !error) {
      setAllUsers(data);
    }
  };

  const startChat = async (otherUser: any) => {
    // Basic implementation: for MVP, if RLS fails to insert the other user, we'll need an RPC.
    // For now, let's try to create a conversation and insert both users.
    const { data: newConv } = await supabase
      .from('conversations')
      .insert([{ is_group: false, name: otherUser.display_name }])
      .select()
      .single();

    if (newConv) {
      await supabase.from('conversation_members').insert([
        { conversation_id: newConv.id, user_id: user.id, role: 'admin' },
        // NOTE: If RLS blocks this second insert, we need to update the RLS policy in Supabase.
        { conversation_id: newConv.id, user_id: otherUser.id, role: 'member' }
      ]);
      fetchConversations();
      setActiveChat(newConv.id);
      setView('chats');
    }
  };

  return (
    <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900/50">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-bold text-lg tracking-tight">Messages</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('chats')}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${view === 'chats' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            Chats
          </button>
          <button 
            onClick={() => setView('users')}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${view === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            Directory
          </button>
        </div>
      </div>
      <div className="p-4">
        <input 
          type="text" 
          placeholder={view === 'chats' ? "Search chats..." : "Search users..."}
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {view === 'chats' ? (
          conversations.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-4">No conversations yet. Go to Directory to start one!</p>
          ) : (
            conversations.map((chat: any) => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  activeChat === chat.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-400 uppercase">
                  {chat.name ? chat.name[0] : '#'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium truncate">{chat.name || 'Private Chat'}</h3>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          allUsers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-4">No other users found.</p>
          ) : (
            allUsers.map((u: any) => (
              <div 
                key={u.id} 
                onClick={() => startChat(u)}
                className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-300 uppercase">
                    {u.display_name ? u.display_name[0] : '?'}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{u.display_name}</h3>
                    <p className="text-xs text-gray-500">@{u.username}</p>
                  </div>
                </div>
                <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full transition-colors">
                  Message
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

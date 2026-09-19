"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface ChatWindowProps {
  user: User;
  conversationId: string;
}

export default function ChatWindow({ user, conversationId }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      scrollToBottom();
    };
    fetchMessages();

    // 2. Subscribe to new real-time messages
    const channel = supabase
      .channel(`room:${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Optimistic update
    const tempId = crypto.randomUUID();
    const messageData = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: user.id,
      body: newMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    scrollToBottom();

    // Actual database insert
    await supabase.from('messages').insert([{
      conversation_id: conversationId,
      sender_id: user.id,
      body: messageData.body
    }]);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 h-full">
      <div className="h-16 border-b border-gray-800 flex items-center px-6">
        <h2 className="font-bold">Chat Room</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMine = msg.sender_id === user.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                isMine ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm'
              }`}>
                {msg.body}
              </div>
              <span className="text-xs text-gray-600 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 bg-gray-950 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..." 
          className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

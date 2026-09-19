export type User = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
};

export type Chat = {
  id: string;
  user: User;
  unreadCount: number;
  lastMessage?: Message;
};

export const CURRENT_USER: User = {
  id: "me",
  name: "My Profile",
  avatar: "https://i.pravatar.cc/150?u=me",
  online: true,
};

export const DUMMY_USERS: User[] = [
  { id: "1", name: "Alice", avatar: "https://i.pravatar.cc/150?u=1", online: true },
  { id: "2", name: "Bob", avatar: "https://i.pravatar.cc/150?u=2", online: false, lastSeen: "Today at 2:30 PM" },
  { id: "3", name: "Charlie", avatar: "https://i.pravatar.cc/150?u=3", online: true },
];

export const DUMMY_CHATS: Chat[] = [
  {
    id: "chat-1",
    user: DUMMY_USERS[0],
    unreadCount: 2,
    lastMessage: {
      id: "m1",
      chatId: "chat-1",
      senderId: "1",
      text: "Hey! How are you?",
      timestamp: new Date().toISOString(),
      status: "read",
    },
  },
  {
    id: "chat-2",
    user: DUMMY_USERS[1],
    unreadCount: 0,
    lastMessage: {
      id: "m2",
      chatId: "chat-2",
      senderId: "me",
      text: "See you tomorrow!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "read",
    },
  },
  {
    id: "chat-3",
    user: DUMMY_USERS[2],
    unreadCount: 0,
  }
];

export const DUMMY_MESSAGES: Record<string, Message[]> = {
  "chat-1": Array.from({ length: 50 }).map((_, i) => ({
    id: `c1-m${i}`,
    chatId: "chat-1",
    senderId: i % 2 === 0 ? "1" : "me",
    text: `This is dummy message ${i + 1} in the conversation.`,
    timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString(),
    status: i === 49 ? "delivered" : "read",
  })),
};

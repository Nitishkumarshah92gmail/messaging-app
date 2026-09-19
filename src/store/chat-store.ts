import { create } from 'zustand'

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  about: string;
  lastSeen: string;
  isOnline: boolean;
}

interface ChatState {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
  users: [],
  setUsers: (users) => set({ users }),
}))

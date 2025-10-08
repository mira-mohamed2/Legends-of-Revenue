import { create } from 'zustand';
import { saveToStorage, loadFromStorage, clearStorage } from '../utils/storage';

interface SessionState {
  currentUser: string | null;
  isAuthenticated: boolean;
  users: Map<string, string>; // username -> password (hashed in production)
  
  // Actions
  register: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loadSession: () => void;
}

const STORAGE_KEY = 'session';
const USERS_KEY = 'users';

export const useSessionStore = create<SessionState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  users: new Map(),
  
  register: (username: string, password: string) => {
    const { users } = get();
    
    // Validation
    if (!username || username.length < 3) {
      alert('Username must be at least 3 characters');
      return false;
    }
    
    if (!password || password.length < 4) {
      alert('Password must be at least 4 characters');
      return false;
    }
    
    if (users.has(username)) {
      alert('Username already exists');
      return false;
    }
    
    // Add user
    const newUsers = new Map(users);
    newUsers.set(username, password); // In production, hash this!
    
    set({ users: newUsers });
    
    // Save to storage
    saveToStorage(USERS_KEY, Array.from(newUsers.entries()));
    
    return true;
  },
  
  login: (username: string, password: string) => {
    const { users } = get();
    
    const storedPassword = users.get(username);
    
    if (!storedPassword) {
      alert('Username not found');
      return false;
    }
    
    if (storedPassword !== password) {
      alert('Incorrect password');
      return false;
    }
    
    set({
      currentUser: username,
      isAuthenticated: true,
    });
    
    // Save session
    saveToStorage(STORAGE_KEY, { username });
    
    return true;
  },
  
  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
    });
    
    clearStorage(STORAGE_KEY);
  },
  
  loadSession: () => {
    // Load users
    const usersData = loadFromStorage<[string, string][]>(USERS_KEY);
    if (usersData) {
      set({ users: new Map(usersData) });
    }
    
    // Load session
    const sessionData = loadFromStorage<{ username: string }>(STORAGE_KEY);
    if (sessionData) {
      set({
        currentUser: sessionData.username,
        isAuthenticated: true,
      });
    }
  },
}));

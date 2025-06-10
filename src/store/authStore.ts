
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = { id: '1', name: 'John Doe', email };
        set({ user, isAuthenticated: true });
        return true;
      },
      signup: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = { id: '1', name, email };
        set({ user, isAuthenticated: true });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminLogin, verifyAdminToken } from '../services/apiService';

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
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const { token, user: userData } = await adminLogin(email, password);
          localStorage.setItem('authToken', token);
          const user = { 
            id: userData.id || userData._id, 
            name: userData.fullName || userData.email, 
            email: userData.email 
          };
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      signup: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = { id: '1', name, email };
        set({ user, isAuthenticated: true });
        return true;
      },
      logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, isAuthenticated: false });
      },
      initializeAuth: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
          const { user: userData } = await verifyAdminToken();
          const user = {
            id: userData.id || userData._id,
            name: userData.fullName || userData.email,
            email: userData.email
          };
          set({ user, isAuthenticated: true });
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

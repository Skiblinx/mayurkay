
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true, // Default to dark theme
      toggleTheme: () => {
        const newTheme = !get().isDark;
        set({ isDark: newTheme });
        document.documentElement.classList.toggle('dark', newTheme);
      },
      setTheme: (isDark) => {
        set({ isDark });
        document.documentElement.classList.toggle('dark', isDark);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle('dark', state.isDark);
        }
      },
    }
  )
);

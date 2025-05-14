import { create } from 'zustand';

type ThemeStore = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

// Check system preference for dark mode
const getSystemPreference = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Get saved theme or use system preference
const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('ripscore-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return getSystemPreference();
  }
  return false;
};

// Apply theme class to document
const applyTheme = (isDark: boolean) => {
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

// Theme store using zustand
export const useTheme = create<ThemeStore>((set) => {
  const isDarkMode = getInitialTheme();
  
  // Apply initial theme
  applyTheme(isDarkMode);
  
  return {
    isDarkMode,
    toggleTheme: () => set((state) => {
      const newState = !state.isDarkMode;
      localStorage.setItem('ripscore-theme', newState ? 'dark' : 'light');
      applyTheme(newState);
      return { isDarkMode: newState };
    }),
    setTheme: (isDark: boolean) => set(() => {
      localStorage.setItem('ripscore-theme', isDark ? 'dark' : 'light');
      applyTheme(isDark);
      return { isDarkMode: isDark };
    })
  };
});

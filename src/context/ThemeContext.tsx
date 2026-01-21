import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, type PaletteMode } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAppTheme } from '@/styles/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  actualMode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从 localStorage 读取初始值，默认为 system
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'system';
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // 计算实际应用的调色板模式
  const actualMode = useMemo<PaletteMode>(() => {
    if (mode === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return mode;
  }, [mode, prefersDarkMode]);

  // 当 mode 改变时，保存到 localStorage 并更新 html class (供 tailwind 使用)
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    
    const root = window.document.documentElement;
    if (actualMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode, actualMode]);

  const theme = useMemo(() => getAppTheme(actualMode), [actualMode]);

  const value = useMemo(() => ({
    mode,
    setMode,
    actualMode
  }), [mode, actualMode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeContextProvider');
  }
  return context;
};

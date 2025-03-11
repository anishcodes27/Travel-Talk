import React, { createContext, useState, useContext, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check local storage for saved theme preference
    const savedMode = localStorage.getItem('themeMode');
    
    // Check for system preference if no saved preference
    if (!savedMode) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return (savedMode as ThemeMode) || 'light';
  });

  // Save theme mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    // Apply mode class to the document element for global styling
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

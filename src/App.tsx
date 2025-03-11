import React, { useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TranslationPage from './pages/TranslationPage';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import WelcomeAnimation from './components/WelcomeAnimation';

// App wrapper with theme context
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Check if we've shown the welcome screen recently
  useEffect(() => {
    const lastShown = localStorage.getItem('welcomeShown');
    const currentTime = Date.now();
    
    // Only show welcome if it hasn't been shown in the last hour
    if (lastShown && currentTime - parseInt(lastShown) < 3600000) {
      setShowWelcome(false);
    }
  }, []);
  
  const handleWelcomeComplete = () => {
    localStorage.setItem('welcomeShown', Date.now().toString());
    setShowWelcome(false);
  };
  
  return (
    <CustomThemeProvider>
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      <ThemedApp />
    </CustomThemeProvider>
  );
}

// Inner component that uses the theme context
function ThemedApp() {
  const { mode } = useTheme();
  
  // Create MUI theme based on our theme mode
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#5e35b1' : '#9575cd',
        light: mode === 'light' ? '#9162e4' : '#b39ddb',
        dark: mode === 'light' ? '#4527a0' : '#7e57c2',
      },
      secondary: {
        main: mode === 'light' ? '#ff6f00' : '#ffb74d',
        light: mode === 'light' ? '#ff9e40' : '#ffe0b2',
        dark: mode === 'light' ? '#c43e00' : '#ff9800',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      }
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
        letterSpacing: '0.02em'
      },
      subtitle1: {
        fontWeight: 500,
        letterSpacing: '0.01em'
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      }
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light' 
                ? '0 2px 8px rgba(0,0,0,0.12)' 
                : '0 2px 8px rgba(0,0,0,0.4)',
            }
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            transition: 'box-shadow 0.2s ease-in-out',
          }
        }
      }
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <TranslationPage />
    </MuiThemeProvider>
  );
}

export default App;

import React from 'react';
import { Paper, BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Fab, Box, useTheme, alpha } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import MicIcon from '@mui/icons-material/Mic';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  onStartListening: () => void;
  isListening: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function BottomNavigation({ 
  onStartListening, 
  isListening, 
  activeTab = 'translate', 
  onTabChange = () => {} 
}: BottomNavigationProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 8px 8px',
        borderRadius: '24px 24px 0 0',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(0deg, #1a1a1a, #212121)'
          : 'linear-gradient(0deg, #f5f5f5, #ffffff)',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 -4px 20px rgba(0,0,0,0.3)'
          : '0 -4px 20px rgba(0,0,0,0.1)',
        display: { xs: 'block', sm: 'none' }
      }}
      elevation={3}
    >
      <Box sx={{ position: 'relative', height: 56 }}>
        <MuiBottomNavigation
          value={activeTab}
          onChange={(_, newValue) => onTabChange(newValue)}
          sx={{ 
            backgroundColor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main
              }
            }
          }}
        >
          <BottomNavigationAction 
            label="Translate" 
            value="translate" 
            icon={<TranslateIcon />} 
          />
          <BottomNavigationAction 
            label="History" 
            value="history" 
            icon={<HistoryIcon />} 
          />
          <Box sx={{ width: 56 }} />
          <BottomNavigationAction 
            label="Settings" 
            value="settings" 
            icon={<SettingsIcon />} 
          />
        </MuiBottomNavigation>
        
        {/* Center FAB */}
        <Box
          sx={{
            position: 'absolute',
            top: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Fab
              color={isListening ? "error" : "primary"}
              aria-label="Start speaking"
              onClick={onStartListening}
              sx={{
                boxShadow: isListening 
                  ? `0 0 0 6px ${alpha(theme.palette.error.main, 0.2)}`
                  : `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              <MicIcon />
            </Fab>
          </motion.div>
        </Box>
      </Box>
    </Paper>
  );
}

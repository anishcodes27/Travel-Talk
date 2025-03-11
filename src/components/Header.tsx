import React from 'react';
import { 
  AppBar, Toolbar, Typography, Box, 
  IconButton, useTheme as useMuiTheme, alpha
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { motion } from 'framer-motion';

export default function Header() {
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      color="primary"
      sx={{
        background: mode === 'light' 
          ? 'linear-gradient(145deg, #673ab7, #5e35b1)' 
          : 'linear-gradient(145deg, #303030, #212121)',
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background shapes */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', opacity: 0.1 }}>
        <motion.div 
          animate={{ 
            x: [0, 10, 0], 
            y: [0, 5, 0],
            rotate: [0, 5, 0],
          }} 
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(muiTheme.palette.primary.light, 0.7)} 0%, transparent 70%)`,
            top: '-150px',
            right: '-50px',
          }}
        />
        <motion.div 
          animate={{ 
            x: [0, -15, 0], 
            y: [0, -8, 0],
            scale: [1, 1.05, 1],
          }} 
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '30%',
            background: `radial-gradient(circle, ${alpha(muiTheme.palette.secondary.light, 0.5)} 0%, transparent 70%)`,
            top: '-20px',
            left: '30%',
          }}
        />
      </Box>

      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo size={42} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                ml: 2,
                fontWeight: 'bold',
                fontFamily: '"Montserrat", sans-serif',
                background: `linear-gradient(90deg, ${muiTheme.palette.common.white} 0%, rgba(255,255,255,0.85) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 2px 3px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px'
              }}
            >
              TravelTalk
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                ml: 2, 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 400,
                opacity: 0.9,
                fontStyle: 'italic'
              }}
            >
              Real-time Travel Translation
            </Typography>
          </motion.div>
        </Box>

        {/* Theme toggle button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            aria-label="toggle theme"
            component={motion.button}
            whileHover={{ rotate: 30, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            sx={{ 
              ml: 2,
              transition: 'all 0.3s ease',
              background: alpha(muiTheme.palette.background.paper, 0.1),
              '&:hover': { 
                background: alpha(muiTheme.palette.background.paper, 0.2),
              }
            }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
}

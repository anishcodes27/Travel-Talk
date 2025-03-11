import React, { useEffect, useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface WelcomeAnimationProps {
  onComplete?: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [show, setShow] = useState(true);
  const theme = useTheme();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #121212, #1e1e1e)'
              : 'linear-gradient(135deg, #f5f5f5, #ffffff)'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
          >
            <Logo size={120} animated />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                mt: 3, 
                fontWeight: 700,
                fontFamily: '"Montserrat", sans-serif',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.1em'
              }}
            >
              TravelTalk
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mt: 1, 
                color: theme.palette.text.secondary,
                fontWeight: 400,
                fontSize: '1rem',
                fontStyle: 'italic'
              }}
            >
              Bridging Languages, Connecting People
            </Typography>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

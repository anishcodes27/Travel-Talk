import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion, Transition } from 'framer-motion';

interface AnimatedLoaderProps {
  size?: number;
  color?: string;
}

export default function AnimatedLoader({ size = 40, color }: AnimatedLoaderProps) {
  const theme = useTheme();
  const dotColor = color || theme.palette.primary.main;
  
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2
      }
    },
    end: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const dotVariants = {
    start: {
      y: "0%"
    },
    end: {
      y: "100%"
    }
  };

  const dotTransition: Transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: size
    }}>
      <motion.div
        style={{
          display: 'flex',
          width: size,
          height: size / 2,
          justifyContent: 'space-around'
        }}
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[0, 1, 2].map(index => (
          <motion.div
            key={index}
            style={{
              width: size / 6,
              height: size / 6,
              borderRadius: '50%',
              backgroundColor: dotColor
            }}
            variants={dotVariants}
            transition={dotTransition}
          />
        ))}
      </motion.div>
    </Box>
  );
}

import React from 'react';
import { useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  animated?: boolean;
}

export default function Logo({ size = 40, animated = true }: LogoProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  
  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    },
    hover: {
      scale: 1.05,
      rotate: [0, -1, 1, -1, 0],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };
  
  const bubblesVariant = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    }),
    hover: (i: number) => ({
      y: [-1, -3, -1],
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    })
  };
  
  const globeVariant = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        delay: 0.2,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      rotate: 10,
      scale: 1.05,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };
  
  return (
    <motion.div
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      whileHover="hover"
      variants={logoVariants}
      style={{ 
        width: size, 
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width={size} 
        height={size} 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TravelTalk logo"
      >
        {/* Base Globe */}
        <motion.ellipse
          variants={globeVariant}
          cx="45" 
          cy="50" 
          rx="35" 
          ry="35"
          fill={`url(#globe-gradient-${size})`}
          stroke={primaryColor}
          strokeWidth="2"
        />
        
        {/* Globe Lines */}
        <motion.g variants={globeVariant} stroke={theme.palette.background.paper} strokeWidth="1.5" opacity="0.7">
          <path d="M10,50 Q45,15 80,50" fill="none" />
          <path d="M10,50 Q45,85 80,50" fill="none" />
          <path d="M45,15 Q45,50 45,85" fill="none" />
        </motion.g>
        
        {/* Speech Bubbles */}
        <motion.circle custom={0} variants={bubblesVariant} cx="75" cy="35" r="15" fill={secondaryColor} />
        <motion.circle custom={1} variants={bubblesVariant} cx="85" cy="50" r="8" fill={secondaryColor} opacity="0.8" />
        <motion.circle custom={2} variants={bubblesVariant} cx="90" cy="60" r="5" fill={secondaryColor} opacity="0.6" />
        
        {/* Text/Marks in Bubbles */}
        <motion.text 
          custom={0} 
          variants={bubblesVariant} 
          x="75" 
          y="40" 
          fontSize="14" 
          textAnchor="middle" 
          fill={theme.palette.background.paper}
          fontFamily="'Poppins', sans-serif"
          fontWeight="bold"
        >
          T
        </motion.text>
        
        {/* Provide gradient definitions */}
        <defs>
          <linearGradient id={`globe-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.palette.primary.dark} />
            <stop offset="100%" stopColor={theme.palette.primary.light} />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

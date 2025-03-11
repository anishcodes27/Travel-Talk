import React from 'react';
import { 
  Paper, Box, Typography, Divider, useTheme, alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { ConversationItem } from '../types/conversation';
import TranslationCard from './TranslationCard';
import { Language } from '../types/language';

interface ConversationBoxProps {
  conversation: ConversationItem[];
  onSpeakTranslation: (text: string, langCode: string) => void;
  onRetranslate: (item: ConversationItem, targetLanguage: Language) => void;
}

export default function ConversationBox({ 
  conversation, 
  onSpeakTranslation, 
  onRetranslate 
}: ConversationBoxProps) {
  const theme = useTheme();
  
  if (conversation.length === 0) {
    return null;
  }

  return (
    <Paper 
      elevation={theme.palette.mode === 'dark' ? 2 : 1} 
      sx={{ 
        mt: 3, 
        p: 2, 
        borderRadius: 3,
        maxHeight: '500px',
        overflow: 'auto',
        backgroundImage: 'none',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #1e1e1e, #252525)' 
          : 'linear-gradient(145deg, #ffffff, #fafafa)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0,0,0,0.2)'
          : '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '1.1rem',
            letterSpacing: '0.02em',
            color: theme.palette.primary.main
          }}
        >
          Conversation History
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              px: 1,
              py: 0.5,
              borderRadius: '10px'
            }}
          >
            {conversation.length} {conversation.length === 1 ? 'message' : 'messages'}
          </Typography>
        </motion.div>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      {/* Use the updated TranslationCard component */}
      <Box sx={{ p: 0 }}>
        {conversation.map(item => (
          <TranslationCard 
            key={item.id} 
            item={item} 
            onSpeakTranslation={onSpeakTranslation}
            onRetranslate={onRetranslate}
          />
        ))}
      </Box>
    </Paper>
  );
}

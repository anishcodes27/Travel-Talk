import React from 'react';
import { 
  Paper, Box, Typography, Divider, IconButton, 
  List, ListItem
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { ConversationItem } from '../types/conversation';

interface ConversationBoxProps {
  conversation: ConversationItem[];
  onSpeakTranslation: (text: string, langCode: string) => void;
}

export default function ConversationBox({ conversation, onSpeakTranslation }: ConversationBoxProps) {
  if (conversation.length === 0) {
    return null;
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mt: 3, 
        p: 2, 
        borderRadius: 2,
        maxHeight: '400px',
        overflow: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Conversation History
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {conversation.map((item) => (
          <ListItem 
            key={item.id} 
            sx={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              mb: 2,
              p: 2,
              backgroundColor: '#f9f9f9',
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography variant="subtitle2" color="primary">
                {item.originalLanguage.name}:
              </Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {item.originalText}
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => onSpeakTranslation(item.originalText, item.originalLanguage.code)}
              >
                <VolumeUpIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%', 
              mt: 1,
              backgroundColor: '#e8f4fd',
              p: 1,
              borderRadius: 1
            }}>
              <Typography variant="subtitle2" color="secondary">
                {item.targetLanguage.name}:
              </Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {item.translatedText || "Translating..."}
                </Typography>
              </Box>
              {item.translatedText && (
                <IconButton 
                  size="small" 
                  onClick={() => onSpeakTranslation(item.translatedText, item.targetLanguage.code)}
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

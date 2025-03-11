import React, { useState } from 'react';
import { 
  Box, Typography, IconButton, useTheme, alpha, 
  Paper, Tooltip, Select, MenuItem, FormControl, InputLabel,
  Button
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TranslateIcon from '@mui/icons-material/Translate';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationItem } from '../types/conversation';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { Language } from '../types/language';

interface TranslationCardProps {
  item: ConversationItem;
  onSpeakTranslation: (text: string, langCode: string) => void;
  onRetranslate?: (originalItem: ConversationItem, targetLanguage: Language) => void;
}

export default function TranslationCard({ 
  item, 
  onSpeakTranslation, 
  onRetranslate 
}: TranslationCardProps) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  
  // Filter out languages that are the same as source or already translated target
  const availableLanguages = SUPPORTED_LANGUAGES.filter(lang => 
    lang.code !== item.originalLanguage.code && 
    lang.code !== item.targetLanguage.code
  );

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const langCode = event.target.value as string;
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
    if (language) {
      setSelectedLanguage(language);
    }
  };

  const handleTranslate = () => {
    if (selectedLanguage && onRetranslate) {
      onRetranslate(item, selectedLanguage);
      setShowLanguageSelector(false);
      setSelectedLanguage(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <Paper 
        elevation={theme.palette.mode === 'dark' ? 2 : 1}
        sx={{
          mb: 2,
          overflow: 'hidden',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {/* Original text section */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center', 
          p: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.primary.dark, 0.1)
            : alpha(theme.palette.primary.light, 0.05),
          position: 'relative'
        }}>
          <Box sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: theme.palette.primary.main,
            opacity: 0.6,
          }} />
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                mb: 0.5
              }}
            >
              {item.originalLanguage.name}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: '"Inter", sans-serif',
                fontWeight: theme.palette.mode === 'dark' ? 400 : 500,
              }}
            >
              {item.originalText}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', ml: 1 }}>
            <Tooltip title="Copy text">
              <IconButton 
                size="small"
                onClick={() => handleCopyText(item.originalText)}
                sx={{ 
                  opacity: 0.7, 
                  '&:hover': { opacity: 1 },
                  color: theme.palette.primary.main,
                }}
              >
                {copied ? <span>✓</span> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Listen">
              <IconButton 
                size="small"
                onClick={() => onSpeakTranslation(item.originalText, item.originalLanguage.code)}
                sx={{ 
                  opacity: 0.7, 
                  '&:hover': { opacity: 1 },
                  color: theme.palette.primary.main,
                }}
              >
                <VolumeUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Translation section */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center', 
          p: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.secondary.dark, 0.1)
            : alpha(theme.palette.secondary.light, 0.07),
          position: 'relative',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`
        }}>
          <Box sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: theme.palette.secondary.main,
            opacity: 0.4,
          }} />
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.secondary.main,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                mb: 0.5
              }}
            >
              {item.targetLanguage.name}
            </Typography>
            
            {item.translatedText ? (
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                }}
              >
                {item.translatedText}
              </Typography>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                height: 24,
              }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  bgcolor: 'text.disabled',
                  mr: 1,
                  animation: 'pulse 1.5s infinite ease-in-out'
                }} />
                <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Translating...
                </Typography>
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                  }
                `}</style>
              </Box>
            )}
          </Box>
          
          {item.translatedText && (
            <Box sx={{ display: 'flex', ml: 1 }}>
              {onRetranslate && (
                <Tooltip title="Translate to another language">
                  <IconButton
                    size="small"
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    sx={{
                      opacity: 0.7,
                      '&:hover': { opacity: 1 },
                      color: theme.palette.secondary.main,
                      backgroundColor: showLanguageSelector ? alpha(theme.palette.secondary.main, 0.1) : 'transparent',
                    }}
                  >
                    <TranslateIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Copy translation">
                <IconButton 
                  size="small"
                  onClick={() => handleCopyText(item.translatedText)}
                  sx={{ 
                    opacity: 0.7, 
                    '&:hover': { opacity: 1 },
                    color: theme.palette.secondary.main,
                  }}
                >
                  {copied ? <span>✓</span> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Listen to translation">
                <IconButton 
                  size="small"
                  onClick={() => onSpeakTranslation(item.translatedText, item.targetLanguage.code)}
                  sx={{ 
                    opacity: 0.7, 
                    '&:hover': { opacity: 1 },
                    color: theme.palette.secondary.main,
                  }}
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        
        {/* Language dropdown section */}
        <AnimatePresence>
          {showLanguageSelector && onRetranslate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backgroundColor: theme.palette.background.paper,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
                  <InputLabel id="new-language-select-label">Translate to</InputLabel>
                  <Select
                    labelId="new-language-select-label"
                    value={selectedLanguage?.code || ''}
                    label="Translate to"
                    onChange={handleLanguageChange as any}
                    sx={{ borderRadius: 2 }}
                  >
                    {availableLanguages.map(lang => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<TranslateIcon />}
                  disabled={!selectedLanguage}
                  onClick={handleTranslate}
                  sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                >
                  Translate
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
}

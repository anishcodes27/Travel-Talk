import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Box, Typography, Paper, IconButton, 
  Grid, Alert, useTheme, alpha, Button,
  Collapse, Divider
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop'; // Fixed import path
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TranslateIcon from '@mui/icons-material/Translate';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HistoryIcon from '@mui/icons-material/History'; // Added missing import
import LanguageSelector from '../components/LanguageSelector';
import ConversationBox from '../components/ConversationBox';
import BottomNavigation from '../components/BottomNavigation';
import AnimatedLoader from '../components/AnimatedLoader';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { translateText } from '../services/translationService';
import Header from '../components/Header';
import { Language } from '../types/language';
import { ConversationItem } from '../types/conversation';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

export default function TranslationPage() {
  const [sourceLanguage, setSourceLanguage] = useState<Language>({ code: 'en', name: 'English' });
  const [targetLanguage, setTargetLanguage] = useState<Language>({ code: 'hi', name: 'हिन्दी (Hindi)' });
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('translate');
  const [expandedHistoryItem, setExpandedHistoryItem] = useState<number | null>(null);
  const [newTargetLanguage, setNewTargetLanguage] = useState<Language>({ code: 'fr', name: 'French' });
  const [retranslating, setRetranslating] = useState<number | null>(null);
  
  const { 
    transcript, 
    listening, 
    startListening, 
    stopListening, 
    resetTranscript,
    error: recognitionError,
    isUsingFallback
  } = useSpeechRecognition(sourceLanguage.code);
  
  const { speak, isSpeaking, error: speechError } = useTextToSpeech();
  const theme = useTheme();

  // Combine errors from different sources
  useEffect(() => {
    if (recognitionError) {
      setError(recognitionError);
    } else if (speechError) {
      setError(speechError);
    }
  }, [recognitionError, speechError]);

  const handleTranslation = useCallback(async (text: string) => {
    try {
      setTranslating(true);
      setError(null);
      
      // Add original text to conversation
      const newItem: ConversationItem = {
        id: Date.now(),
        originalText: text,
        originalLanguage: sourceLanguage,
        translatedText: '',
        targetLanguage: targetLanguage
      };
      
      setConversation(prev => [...prev, newItem]);
      
      // Translate the text
      const result = await translateText(text, sourceLanguage.code, targetLanguage.code);
      
      // Update conversation with translation (no alternatives)
      setConversation(prev => 
        prev.map(item => 
          item.id === newItem.id 
            ? { 
                ...item, 
                translatedText: result
              } 
            : item
        )
      );
      
      // Speak the translation
      speak(result, targetLanguage.code);
      
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate. Please try again.');
    } finally {
      setTranslating(false);
      resetTranscript();
    }
  }, [sourceLanguage, targetLanguage, speak, resetTranscript]);

  // Only translate when we have a transcript and stopped listening
  useEffect(() => {
    if (transcript && !listening && transcript.trim().length > 0) {
      handleTranslation(transcript);
    }
  }, [transcript, listening, handleTranslation]);

  const handleStartListening = useCallback(() => {
    if (isSpeaking) {
      console.log("Currently speaking, can't start listening");
      return;
    }
    resetTranscript();
    startListening();
  }, [resetTranscript, startListening, isSpeaking]);

  const handleStopListening = useCallback(() => {
    stopListening();
  }, [stopListening]);

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleSpeakTranslation = (text: string, langCode: string) => {
    speak(text, langCode);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Function to handle re-translating text to a new language
  const handleRetranslate = async (item: ConversationItem) => {
    try {
      setRetranslating(item.id);
      setError(null);
      
      // Create a new conversation item with the same source but different target language
      const newItem: ConversationItem = {
        id: Date.now(),
        originalText: item.originalText,
        originalLanguage: item.originalLanguage,
        translatedText: '',
        targetLanguage: newTargetLanguage
      };
      
      // Add to conversation history
      setConversation(prev => [...prev, newItem]);
      
      // Translate the text
      const result = await translateText(item.originalText, item.originalLanguage.code, newTargetLanguage.code);
      
      // Update conversation with translation
      setConversation(prev => 
        prev.map(convItem => 
          convItem.id === newItem.id 
            ? { ...convItem, translatedText: result }
            : convItem
        )
      );
      
    } catch (err) {
      console.error('Re-translation error:', err);
      setError('Failed to translate to new language. Please try again.');
    } finally {
      setRetranslating(null);
      setExpandedHistoryItem(null); // Collapse the expanded item
    }
  };

  // Add this additional method to handle re-translations
  const handleConversationRetranslate = async (item: ConversationItem, newTargetLanguage: Language) => {
    try {
      setError(null);
      
      // Create a new conversation item with the same source but different target language
      const newItem: ConversationItem = {
        id: Date.now(),
        originalText: item.originalText,
        originalLanguage: item.originalLanguage,
        translatedText: '',
        targetLanguage: newTargetLanguage
      };
      
      // Add to conversation history
      setConversation(prev => [...prev, newItem]);
      
      // Translate the text
      const result = await translateText(item.originalText, item.originalLanguage.code, newTargetLanguage.code);
      
      // Update conversation with translation
      setConversation(prev => 
        prev.map(convItem => 
          convItem.id === newItem.id 
            ? { ...convItem, translatedText: result }
            : convItem
        )
      );
      
    } catch (err) {
      console.error('Re-translation error:', err);
      setError('Failed to translate to new language. Please try again.');
    }
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'translate':
        return (
          <>
            <motion.div variants={fadeInUp}>
              <Paper 
                elevation={theme.palette.mode === 'dark' ? 2 : 3} 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(145deg, #1e1e1e, #2d2d2d)'
                    : 'linear-gradient(145deg, #ffffff, #f8f8f8)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <LanguageSelector
                      label="From"
                      value={sourceLanguage}
                      onChange={setSourceLanguage}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                      <IconButton 
                        onClick={handleSwapLanguages}
                        sx={{ 
                          borderRadius: '50%', 
                          p: 1.5,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        <SwapHorizIcon />
                      </IconButton>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <LanguageSelector
                      label="To"
                      value={targetLanguage}
                      onChange={setTargetLanguage}
                    />
                  </Grid>
                </Grid>

                <Box 
                  sx={{ 
                    mt: 5, 
                    mb: 2,
                    display: 'flex', 
                    justifyContent: 'center', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <IconButton 
                      color={listening ? "secondary" : "primary"}
                      size="large"
                      onClick={listening ? handleStopListening : handleStartListening}
                      disabled={translating || isSpeaking}
                      sx={{ 
                        width: 90, 
                        height: 90, 
                        boxShadow: listening 
                          ? '0 0 0 10px rgba(255,0,0,0.1)' 
                          : '0 8px 20px rgba(0,0,0,0.1)',
                        background: listening 
                          ? theme.palette.mode === 'dark'
                            ? 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0.1) 100%)'
                            : 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,235,235,1) 100%)'
                          : theme.palette.mode === 'dark'
                            ? 'radial-gradient(circle, rgba(94,53,177,0.2) 0%, rgba(94,53,177,0.1) 100%)'
                            : 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(245,245,255,1) 100%)',
                        transition: 'all 0.3s ease',
                        display: { xs: 'none', sm: 'flex' }
                      }}
                    >
                      {listening 
                        ? <StopIcon fontSize="large" sx={{ color: theme.palette.error.main }} /> 
                        : <MicIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />
                      }
                    </IconButton>
                  </motion.div>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 2, 
                      color: 'text.secondary',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      fontSize: '0.875rem',
                      opacity: 0.8,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Hold spacebar to talk
                  </Typography>
                  
                  {isUsingFallback && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        mt: 0.5, 
                        color: 'warning.main', 
                        fontStyle: 'italic',
                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Using Hindi speech recognition for better results
                    </Typography>
                  )}
                </Box>
                
                {listening && (
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 2,
                      borderRadius: theme.shape.borderRadius,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        textAlign: 'center', 
                        fontStyle: 'italic',
                        fontFamily: '"Inter", sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                      }}
                    >
                      {transcript ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {transcript}
                        </motion.span>
                      ) : (
                        <>
                          <AnimatedLoader size={20} />
                          Listening...
                        </>
                      )}
                    </Typography>
                  </Box>
                )}
                
                {translating && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    mt: 2,
                    p: 1,
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                  }}>
                    <AnimatedLoader size={24} color={theme.palette.info.main} />
                    <Typography sx={{ ml: 1.5, fontWeight: 500 }}>Translating...</Typography>
                  </Box>
                )}
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 2,
                      borderRadius: theme.shape.borderRadius,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}
                    variant="outlined"
                  >
                    {error}
                  </Alert>
                )}
              </Paper>
            </motion.div>
            
            <ConversationBox 
              conversation={conversation} 
              onSpeakTranslation={handleSpeakTranslation}
              onRetranslate={handleConversationRetranslate}
            />
          </>
        );
      
      case 'history':
        return (
          <motion.div variants={fadeInUp}>
            <Paper 
              elevation={2} 
              sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: 3,
                minHeight: 300,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, #1e1e1e, #262626)'
                  : 'linear-gradient(145deg, #ffffff, #f8f8f8)',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.palette.primary.main
                }}
              >
                <HistoryIcon sx={{ mr: 1 }} /> Conversation History
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {conversation.length === 0 ? (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 200
                  }}
                >
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No conversation history yet
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<TranslateIcon />}
                    onClick={() => setActiveTab('translate')}
                  >
                    Start Translating
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {conversation.map((item) => (
                    <Paper 
                      key={item.id}
                      elevation={1}
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      {/* Main content */}
                      <Box 
                        sx={{ 
                          p: 2,
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? alpha(theme.palette.primary.dark, 0.05)
                            : alpha(theme.palette.primary.light, 0.03),
                        }}
                      >
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={10}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              From: {item.originalLanguage.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{
                                mt: 0.5,
                                fontStyle: 'italic',
                                color: theme.palette.text.secondary,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {item.originalText}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ textAlign: 'right' }}>
                            <IconButton
                              size="small"
                              onClick={() => setExpandedHistoryItem(expandedHistoryItem === item.id ? null : item.id)}
                            >
                              {expandedHistoryItem === item.id ? 
                                <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                              }
                            </IconButton>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                              To: {item.targetLanguage.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                              {item.translatedText || <em>Translating...</em>}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      {/* Expandable section for re-translation */}
                      <Collapse in={expandedHistoryItem === item.id}>
                        <Box 
                          sx={{ 
                            p: 2,
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? alpha(theme.palette.background.paper, 0.05)
                              : alpha(theme.palette.background.paper, 0.5),
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Translate to another language:
                          </Typography>
                          
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                              <LanguageSelector
                                label="New target language"
                                value={newTargetLanguage}
                                onChange={setNewTargetLanguage}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<TranslateIcon />}
                                onClick={() => handleRetranslate(item)}
                                disabled={retranslating === item.id}
                              >
                                {retranslating === item.id ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AnimatedLoader size={20} color="#fff" />
                                    <Box sx={{ ml: 1 }}>Translating...</Box>
                                  </Box>
                                ) : (
                                  'Translate'
                                )}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </motion.div>
        );
        
      case 'settings':
        return (
          <motion.div variants={fadeInUp}>
            <Paper 
              elevation={2} 
              sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: 3,
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Typography variant="h6">Settings</Typography>
              <Typography variant="body1" color="text.secondary">
                Configure your translation preferences
              </Typography>
            </Paper>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        pb: { xs: 8, sm: 4 }, // Added padding for bottom navigation on mobile
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #121212 0%, #1a1a1a 100%)' 
          : 'linear-gradient(145deg, #f5f5f5 0%, #fdfdfd 100%)'
      }}
    >
      <Header />
      
      <Container maxWidth="md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {renderTabContent()}
        </motion.div>
      </Container>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        onStartListening={handleStartListening}
        isListening={listening}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </Box>
  );
}

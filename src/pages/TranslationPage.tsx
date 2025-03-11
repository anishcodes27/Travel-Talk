import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Box, Typography, Paper, IconButton, 
  Grid, CircularProgress, Alert, Button
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import LanguageSelector from '../components/LanguageSelector';
import ConversationBox from '../components/ConversationBox';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { translateText } from '../services/translationService';
import Header from '../components/Header';
import { Language } from '../types/language';
import { ConversationItem } from '../types/conversation';

export default function TranslationPage() {
  const [sourceLanguage, setSourceLanguage] = useState<Language>({ code: 'en', name: 'English' });
  const [targetLanguage, setTargetLanguage] = useState<Language>({ code: 'hi', name: 'हिन्दी (Hindi)' });
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      <Header />
      
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <LanguageSelector
                label="From"
                value={sourceLanguage}
                onChange={setSourceLanguage}
              />
            </Grid>
            
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={handleSwapLanguages}
                sx={{ borderRadius: '50%', minWidth: '40px', width: '40px', height: '40px', p: 0 }}
              >
                ⇄
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={5}>
              <LanguageSelector
                label="To"
                value={targetLanguage}
                onChange={setTargetLanguage}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton 
              color={listening ? "secondary" : "primary"}
              size="large"
              onClick={listening ? handleStopListening : handleStartListening}
              sx={{ 
                width: 80, 
                height: 80, 
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                background: listening ? 'rgba(255,0,0,0.1)' : 'rgba(94,53,177,0.1)'
              }}
              disabled={translating || isSpeaking}
            >
              {listening ? <StopIcon fontSize="large" /> : <MicIcon fontSize="large" />}
            </IconButton>
            
            <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
              Hold spacebar to talk
            </Typography>
            
            {isUsingFallback && (
              <Typography 
                variant="caption" 
                sx={{ mt: 0.5, color: 'warning.main', fontStyle: 'italic' }}
              >
                Using Hindi speech recognition for better results
              </Typography>
            )}
          </Box>
          
          {listening && (
            <Typography 
              variant="subtitle1" 
              sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}
            >
              Listening... {transcript}
            </Typography>
          )}
          
          {translating && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 1 }}>Translating...</Typography>
            </Box>
          )}
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
        
        <ConversationBox 
          conversation={conversation} 
          onSpeakTranslation={handleSpeakTranslation} 
        />
      </Container>
    </Box>
  );
}

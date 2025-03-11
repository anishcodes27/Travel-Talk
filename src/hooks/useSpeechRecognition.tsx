import { useState, useEffect, useCallback, useRef } from 'react';
import { startContinuousRecognition, stopContinuousRecognition } from '../services/speechService';
import { getSpeechRecognitionCode, INDIAN_LANGUAGES } from '../constants/languages';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const useSpeechRecognition = (languageCode: string = 'en') => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef(false); // To prevent duplicate processing
  
  // Get proper speech recognition code for the language
  const speechLanguageCode = getSpeechRecognitionCode(languageCode);
  
  // Track if we're using a fallback language
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  // Define startListening and stopListening before using them in useEffect
  
  const startListening = useCallback(async () => {
    // Prevent multiple initializations
    if (listening || recognizerRef.current || isProcessingRef.current) {
      console.log("Already listening or processing, ignoring request");
      return;
    }
    
    try {
      isProcessingRef.current = true;
      setError(null);
      setListening(true);
      setTranscript('');
      
      // If using a fallback language, show a message in the console
      if (isUsingFallback) {
        console.log(`Using Hindi speech recognition as a fallback for ${languageCode}`);
      }
      
      console.log(`Starting speech recognition in ${speechLanguageCode}`);
      
      // Function to handle recognized text (final results)
      const handleRecognized = (text: string) => {
        if (!text.trim()) return;
        
        // Simply set the text, don't append to previous text to avoid duplication
        setTranscript(text);
      };
      
      // Function to handle interim results 
      const handleRecognizing = (text: string) => {
        // For interim results, just show them temporarily for Indian languages
        if (speechLanguageCode.includes('-IN') || 
            ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur'].some(
              lang => speechLanguageCode.startsWith(lang)
            )) {
          
          if (!text.trim()) return;
          
          // For interim results, only update if significantly different
          setTranscript(prev => {
            // Only update if significantly different to avoid flicker
            if (Math.abs(text.length - prev.length) > 5 || 
                !text.includes(prev.substring(0, Math.min(20, prev.length)))) {
              return text;
            }
            return prev;
          });
        }
      };
      
      const recognizer = await startContinuousRecognition(
        speechLanguageCode, 
        handleRecognized, 
        handleRecognizing
      );
      
      recognizerRef.current = recognizer;
      
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError(error instanceof Error ? error.message : 'Unknown error starting recognition');
      setListening(false);
      recognizerRef.current = null;
    } finally {
      isProcessingRef.current = false;
    }
  }, [speechLanguageCode, listening, isUsingFallback, languageCode]);
  
  const stopListening = useCallback(async () => {
    // Prevent multiple stops
    if (!recognizerRef.current || isProcessingRef.current) {
      setListening(false);
      return;
    }
    
    try {
      isProcessingRef.current = true;
      console.log("Stopping speech recognition");
      setListening(false);
      
      // Save the reference to a local variable
      const recognizer = recognizerRef.current;
      recognizerRef.current = null;
      
      // Stop the recognizer
      await stopContinuousRecognition(recognizer);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setError(error instanceof Error ? error.message : 'Unknown error stopping recognition');
    } finally {
      // Clear state regardless of errors
      recognizerRef.current = null;
      isProcessingRef.current = false;
    }
  }, []);
  
  // Check if we're using a fallback language
  useEffect(() => {
    const baseCode = languageCode.split('-')[0];
    const usingFallback = INDIAN_LANGUAGES.includes(baseCode) && 
                          baseCode !== 'hi' && 
                          speechLanguageCode === 'hi-IN';
    setIsUsingFallback(usingFallback);
  }, [languageCode, speechLanguageCode]);
  
  // Clean up recognizer on unmount
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          stopContinuousRecognition(recognizerRef.current);
        } catch (e) {
          console.error("Error cleaning up recognizer:", e);
        }
      }
    };
  }, []);
  
  // Handle spacebar push-to-talk
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle spacebar if it's not in an input element
      if (event.code === 'Space' && 
          !(event.target instanceof HTMLInputElement || 
            event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault(); // Prevent scrolling
        
        if (!listening && !isProcessingRef.current) {
          startListening();
        }
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && 
          !(event.target instanceof HTMLInputElement || 
            event.target instanceof HTMLTextAreaElement)) {
        if (listening) {
          stopListening();
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [listening, startListening, stopListening]); // Now these functions are defined before their use
  
  // Reset recognizer when language changes
  useEffect(() => {
    if (recognizerRef.current && listening) {
      const stopAndRestartIfNeeded = async () => {
        console.log("Language changed while listening, stopping recognition");
        await stopListening();
      };
      
      stopAndRestartIfNeeded();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechLanguageCode]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    transcript: transcript.trim(),
    listening,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isUsingFallback
  };
};

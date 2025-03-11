import { useCallback, useState } from 'react';
import { speakText } from '../services/speechService';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const speak = useCallback(async (text: string, languageCode: string) => {
    if (isSpeaking) return;
    
    try {
      setError(null);
      setIsSpeaking(true);
      await speakText(text, languageCode);
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError(err instanceof Error ? err.message : 'Failed to speak text');
    } finally {
      setIsSpeaking(false);
    }
  }, [isSpeaking]);
  
  return { 
    speak,
    isSpeaking,
    error
  };
};

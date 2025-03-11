import axios from 'axios';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { INDIAN_LANGUAGES } from '../constants/languages';

// API base URL
const API_BASE = '/api';

interface SpeechToken {
  token: string;
  region: string;
  expiresIn: number;
}

interface Voice {
  Name: string;
  DisplayName: string;
  LocalName: string;
  ShortName: string;
  Gender: string;
  Locale: string;
  LocaleName: string;
  SampleRateHertz: string;
  VoiceType: string;
  Status: string;
  WordsPerMinute: string;
}

// Cache the token to reduce API calls
let cachedToken: SpeechToken | null = null;
let cachedTokenTimestamp = 0;
let cachedVoices: Voice[] = [];

/**
 * Get Azure speech token for client-side operations
 * @returns {Promise<SpeechToken>}
 */
export const getSpeechToken = async (): Promise<SpeechToken> => {
  // Use cached token if it's less than 8 minutes old (tokens expire in 10 minutes)
  const now = Date.now();
  if (cachedToken && now - cachedTokenTimestamp < 480000) {
    return cachedToken;
  }

  try {
    const response = await axios.get<SpeechToken>(`${API_BASE}/translate/speech-token`);
    cachedToken = response.data;
    cachedTokenTimestamp = now;
    return cachedToken;
  } catch (error) {
    console.error('Error getting speech token:', error);
    throw new Error('Failed to get speech token');
  }
};

/**
 * Get available voices from server
 * @returns {Promise<Voice[]>}
 */
export const getVoices = async (): Promise<Voice[]> => {
  // Use cached voices if available
  if (cachedVoices.length > 0) {
    return cachedVoices;
  }

  try {
    const response = await axios.get<{voices: Voice[]}>(`${API_BASE}/translate/voices`);
    cachedVoices = response.data.voices;
    return cachedVoices;
  } catch (error) {
    console.error('Error getting voices:', error);
    return [];
  }
};

/**
 * Create speech recognizer for speech-to-text
 * @param {string} languageCode - Language code for recognition
 * @returns {Promise<sdk.SpeechRecognizer>}
 */
export const createSpeechRecognizer = async (languageCode: string): Promise<sdk.SpeechRecognizer> => {
  try {
    const tokenData = await getSpeechToken();
    
    // Check if language is an unsupported Indian language
    const baseCode = languageCode.split('-')[0].toLowerCase();
    let recognitionLanguage = languageCode;
    
    // If it's an unsupported Indian language, switch to Hindi
    if (INDIAN_LANGUAGES.includes(baseCode) && baseCode !== 'hi' && baseCode !== 'en') {
      // Check if we should use Hindi by default
      const isUnsupportedRegionalLanguage = !['bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'gu-IN', 
                                            'kn-IN', 'ml-IN', 'pa-IN', 'ur-IN', 'or-IN', 
                                            'as-IN'].includes(languageCode);
      
      if (isUnsupportedRegionalLanguage) {
        console.log(`Using Hindi speech recognition for ${languageCode}`);
        recognitionLanguage = 'hi-IN';
      }
    }
    
    // Create speech configuration with token auth
    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
      tokenData.token, 
      tokenData.region
    );
    
    // Set speech recognition language
    speechConfig.speechRecognitionLanguage = recognitionLanguage;
    
    try {
      // Enable detailed output format for better recognition
      speechConfig.outputFormat = sdk.OutputFormat.Detailed;
    } catch (e) {
      console.warn('Could not set output format, using default');
    }

    // Improve recognition for Indian languages
    if (recognitionLanguage.includes('-IN') || 
        ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur'].some(
          lang => recognitionLanguage.startsWith(lang)
        )) {
      try {
        // Set properties to optimize for these languages
        speechConfig.setProperty("SpeechServiceConnection_LanguageIdMode", "Continuous");
        
        // Use service property for continuous language identification
        speechConfig.setServiceProperty(
          "languageIdentification.continuousLanguageIdProbabilityThreshold",
          "0.7",
          sdk.ServicePropertyChannel.UriQueryParameter
        );
      } catch (e) {
        console.warn('Could not set language-specific properties', e);
      }
    }
    
    // Create audio config for microphone
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    
    // Create recognizer
    return new sdk.SpeechRecognizer(speechConfig, audioConfig);
  } catch (error) {
    console.error('Error creating speech recognizer:', error);
    throw new Error('Failed to create speech recognizer');
  }
};

/**
 * Create speech synthesizer for text-to-speech
 * @param {string} voiceName - Voice name for synthesis
 * @returns {Promise<sdk.SpeechSynthesizer>}
 */
export const createSpeechSynthesizer = async (voiceName: string): Promise<sdk.SpeechSynthesizer> => {
  try {
    const tokenData = await getSpeechToken();
    
    // Create speech configuration with token auth
    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
      tokenData.token, 
      tokenData.region
    );
    
    // Set speech synthesis voice
    speechConfig.speechSynthesisVoiceName = voiceName;
    
    // Improve voice quality for Indian languages
    if (voiceName.includes('hi-IN') || 
        voiceName.includes('ta-IN') || 
        voiceName.includes('te-IN') ||
        voiceName.includes('-IN')) {
      try {
        // Use best quality for Indian voices
        speechConfig.speechSynthesisOutputFormat = 
          sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;
      } catch (e) {
        console.warn('Could not set high-quality speech output format', e);
      }
    }
    
    // Create synthesizer (default audio output)
    return new sdk.SpeechSynthesizer(speechConfig);
  } catch (error) {
    console.error('Error creating speech synthesizer:', error);
    throw new Error('Failed to create speech synthesizer');
  }
};

/**
 * Recognize speech from microphone
 * @param {string} languageCode - Language code for recognition
 * @returns {Promise<string>} - Recognized text
 */
export const recognizeSpeech = async (languageCode: string): Promise<string> => {
  try {
    const recognizer = await createSpeechRecognizer(languageCode);
    
    return new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (result) => {
          recognizer.close();
          
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            resolve(result.text);
          } else {
            reject(new Error('Speech recognition failed or was canceled'));
          }
        },
        (err) => {
          recognizer.close();
          reject(err);
        }
      );
    });
  } catch (error) {
    console.error('Speech recognition error:', error);
    throw new Error('Failed to recognize speech');
  }
};

// Map of language codes to appropriate voice names for Indian languages
const INDIAN_LANGUAGE_VOICE_MAP: Record<string, string> = {
  // Hindi voices
  'hi': 'hi-IN-SwaraNeural',     // Hindi - Female
  'hi-alt': 'hi-IN-MadhurNeural', // Hindi - Male alternate

  // Other Indian language voices
  'bn': 'bn-IN-TanishaaNeural',  // Bengali - Female
  'bn-alt': 'bn-IN-BashkarNeural', // Bengali - Male
  'as': 'as-IN-YashicaNeural',   // Assamese - Female
  'gu': 'gu-IN-DhwaniNeural',    // Gujarati - Female
  'kn': 'kn-IN-SapnaNeural',     // Kannada - Female
  'ml': 'ml-IN-SobhanaNeural',   // Malayalam - Female
  'mr': 'mr-IN-AarohiNeural',    // Marathi - Female
  'or': 'or-IN-SubhasiniNeural', // Odia - Female
  'pa': 'pa-IN-VaaniNeural',     // Punjabi - Female
  'ta': 'ta-IN-PallaviNeural',   // Tamil - Female
  'te': 'te-IN-ShrutiNeural',    // Telugu - Female
  'ur': 'ur-IN-GulNeural',       // Urdu - Female
  
  // Male voices where available
  'bn-male': 'bn-IN-BashkarNeural', // Bengali - Male
  'gu-male': 'gu-IN-NiranjanNeural', // Gujarati - Male
  'hi-male': 'hi-IN-MadhurNeural', // Hindi - Male
  'kn-male': 'kn-IN-GaganNeural', // Kannada - Male
  'ml-male': 'ml-IN-MidhunNeural', // Malayalam - Male
  'mr-male': 'mr-IN-ManoharNeural', // Marathi - Male
  'or-male': 'or-IN-SukantNeural', // Odia - Male
  'pa-male': 'pa-IN-OjasNeural', // Punjabi - Male
  'ta-male': 'ta-IN-ValluvarNeural', // Tamil - Male
  'te-male': 'te-IN-MohanNeural', // Telugu - Male
  'ur-male': 'ur-IN-SalmanNeural', // Urdu - Male
  'as-male': 'as-IN-PriyomNeural' // Assamese - Male
};

/**
 * Speak text using Azure neural voices
 */
export const speakText = async (text: string, languageCode: string): Promise<void> => {
  if (!text || !text.trim()) {
    console.warn('Empty text provided to speakText');
    return;
  }
  
  try {
    console.log(`Speaking text in ${languageCode}: "${text}"`);
    
    // Get language code prefix for matching (e.g., "hi" from "hi-IN")
    const langPrefix = languageCode.toLowerCase().split('-')[0];
    
    // Check if it's an Indian language without direct support
    const isUnsupportedIndianLanguage = INDIAN_LANGUAGES.includes(langPrefix) && 
                                        !INDIAN_LANGUAGE_VOICE_MAP[langPrefix];
    
    // For unsupported Indian languages, default to Hindi
    if (isUnsupportedIndianLanguage) {
      console.log(`${langPrefix} is an unsupported Indian language, defaulting to Hindi voice`);
      const hindiVoice = INDIAN_LANGUAGE_VOICE_MAP['hi'];
      const synthesizer = await createSpeechSynthesizer(hindiVoice);
      await synthesizeTextToSpeech(synthesizer, text);
      return;
    }
    
    // Check if we have a specific mapping for this language
    const preferredVoice = INDIAN_LANGUAGE_VOICE_MAP[langPrefix];
    
    if (preferredVoice) {
      console.log(`Using preferred voice for ${languageCode}: ${preferredVoice}`);
      try {
        const synthesizer = await createSpeechSynthesizer(preferredVoice);
        await synthesizeTextToSpeech(synthesizer, text);
        return;
      } catch (e) {
        console.warn(`Failed to use preferred voice: ${e}, falling back to available voices`);
      }
    }
    
    // If we don't have a mapping or it failed, try to find a suitable voice from available voices
    const voices = await getVoices();
    
    // Filter voices that match this language
    const languageVoices = voices.filter(v => 
      v.Locale && v.Locale.toLowerCase().startsWith(langPrefix)
    );
    
    if (languageVoices.length === 0) {
      console.warn(`No voices found for ${languageCode}, checking if it's an Indian language`);
      
      // If it's an Indian language, default to Hindi
      if (INDIAN_LANGUAGES.includes(langPrefix)) {
        console.log(`Defaulting ${langPrefix} to Hindi voice`);
        const hindiVoices = voices.filter(v => v.Locale && v.Locale.startsWith('hi-'));
        if (hindiVoices.length > 0) {
          console.log(`Using Hindi voice for ${languageCode}`);
          const synthesizer = await createSpeechSynthesizer(hindiVoices[0].ShortName);
          await synthesizeTextToSpeech(synthesizer, text);
          return;
        }
      }
      
      // Fallback to English voice
      const englishVoices = voices.filter(v => v.Locale && v.Locale.startsWith('en-'));
      if (englishVoices.length > 0) {
        console.log(`Using English voice for ${languageCode}`);
        const synthesizer = await createSpeechSynthesizer(englishVoices[0].ShortName);
        await synthesizeTextToSpeech(synthesizer, text);
        return;
      }
      
      console.error(`No voice available for language: ${languageCode}`);
      return; // Don't throw, just silently fail to make app more resilient
    }
    
    // Prefer neural voices if available
    const neuralVoice = languageVoices.find(v => v.VoiceType === 'Neural');
    const voice = neuralVoice || languageVoices[0];
    
    console.log(`Using voice: ${voice.ShortName}`);
    const synthesizer = await createSpeechSynthesizer(voice.ShortName);
    await synthesizeTextToSpeech(synthesizer, text);
    
  } catch (error) {
    console.error('Speech synthesis error:', error);
    // Don't throw, just log error to make app more resilient
  }
};

/**
 * Helper function to synthesize text to speech using a synthesizer
 */
const synthesizeTextToSpeech = (
  synthesizer: sdk.SpeechSynthesizer, 
  text: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        synthesizer.close();
        
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve();
        } else {
          reject(new Error('Speech synthesis failed or was canceled'));
        }
      },
      (err) => {
        synthesizer.close();
        reject(err);
      }
    );
  });
};

/**
 * Recognize speech using continuous recognition
 * This fixes issues with timing out during recognition
 */
export const startContinuousRecognition = async (
  languageCode: string,
  onRecognized: (text: string) => void,
  onRecognizing?: (text: string) => void
): Promise<sdk.SpeechRecognizer> => {
  console.log(`Creating speech recognizer for ${languageCode}`);
  const recognizer = await createSpeechRecognizer(languageCode);

  // Handle final recognition results
  recognizer.recognized = (_, event) => {
    if (event.result.reason === sdk.ResultReason.RecognizedSpeech) {
      const text = event.result.text?.trim();
      if (text) {
        console.log(`Recognized: ${text}`);
        // Send the complete utterance, not an incremental addition
        onRecognized(text);
      }
    } else {
      console.log(`Recognition result: ${event.result.reason}`);
    }
  };

  // Handle interim results if desired
  if (onRecognizing) {
    recognizer.recognizing = (_, event) => {
      const text = event.result.text?.trim();
      if (text) {
        console.log(`Recognizing interim: ${text}`);
        onRecognizing(text);
      }
    };
  }
  
  // Handle recognition errors
  recognizer.canceled = (_, event) => {
    console.log(`Recognition canceled: ${event.reason}`);
    if (event.reason === sdk.CancellationReason.Error) {
      console.error(`Recognition error: ${event.errorCode}, ${event.errorDetails}`);
    }
  };

  console.log("Starting continuous recognition");
  await recognizer.startContinuousRecognitionAsync();
  return recognizer;
};

/**
 * Stop continuous recognition
 */
export const stopContinuousRecognition = async (
  recognizer: sdk.SpeechRecognizer | null
): Promise<void> => {
  if (!recognizer) return;
  
  try {
    console.log("Stopping continuous recognition");
    await recognizer.stopContinuousRecognitionAsync();
    recognizer.close();
    console.log("Recognition stopped and resources cleaned up");
  } catch (error) {
    console.error('Error stopping recognition:', error);
    // Try to close anyway
    try { recognizer.close(); } catch (e) {
      console.error('Failed to close recognizer:', e);
    }
    throw error;
  }
};

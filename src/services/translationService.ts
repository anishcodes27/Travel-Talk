import axios from 'axios';
import { getSpeechToTranslateCode } from '../constants/languages';

// Using our local server API instead of directly calling Azure
const LOCAL_API_BASE = '/api';

export interface TranslationResponse {
  translation: string;
}

export interface AlternativesResponse {
  alternatives: string[];
}

export interface DetectionResponse {
  detectedLanguage: string;
}

export const translateText = async (
  text: string, 
  sourceLanguage: string, 
  targetLanguage: string
): Promise<string> => {
  try {
    // Convert language codes from speech API format to simpler format
    const sourceLang = getSpeechToTranslateCode(sourceLanguage);
    const targetLang = getSpeechToTranslateCode(targetLanguage);
    
    // Call our local server API
    const response = await axios.post<TranslationResponse>(
      `${LOCAL_API_BASE}/translate`,
      {
        text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      }
    );

    // Check if we have a valid response
    if (response.data && response.data.translation) {
      return response.data.translation;
    } else {
      throw new Error('Invalid translation response');
    }
    
  } catch (error) {
    console.error('Translation error:', error);
    
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      console.error('API error:', error.response.data.error);
    }
    
    // Fallback with simple indication of original text
    return `[Translation: ${text}]`;
  }
};

// Get alternative translations if available
export const getAlternativeTranslations = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string[]> => {
  try {
    const sourceLang = getSpeechToTranslateCode(sourceLanguage);
    const targetLang = getSpeechToTranslateCode(targetLanguage);
    
    // Call our local server API
    const response = await axios.post<AlternativesResponse>(
      `${LOCAL_API_BASE}/translate/alternatives`,
      {
        text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      }
    );

    return response.data.alternatives || [];
  } catch (error) {
    console.error('Error getting alternative translations:', error);
    return [];
  }
};

// Helper function to identify the language of text
export const detectLanguage = async (text: string): Promise<string> => {
  try {
    // Call our local server API
    const response = await axios.post<DetectionResponse>(
      `${LOCAL_API_BASE}/translate/detect`,
      { text }
    );

    return response.data.detectedLanguage || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
};

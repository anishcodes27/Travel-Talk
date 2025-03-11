const axios = require('axios');
const { azure } = require('../config');

// Azure Speech Service configuration
const AZURE_SPEECH_KEY = azure.speechKey;
const AZURE_SPEECH_REGION = azure.speechRegion;
const AZURE_SPEECH_ENDPOINT = azure.speechEndpoint?.replace(/\/+$/, '') || `https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com`;

/**
 * Get Azure speech authentication token for client-side use
 * @returns {Promise<{authToken: string, region: string, expiresIn: number}>} 
 */
const getSpeechToken = async () => {
  try {
    const url = `${AZURE_SPEECH_ENDPOINT}/sts/v1.0/issueToken`;
    const response = await axios({
      method: 'post',
      url,
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': 'application/json'
      }
    });

    return {
      authToken: response.data,
      region: AZURE_SPEECH_REGION,
      expiresIn: 600 // Tokens are valid for 10 minutes
    };
  } catch (error) {
    console.error('Error getting speech token:', error);
    throw new Error('Failed to get speech token');
  }
};

/**
 * Get available voices from Azure Speech Service
 * @returns {Promise<Array>} List of available voices
 */
const getVoices = async () => {
  try {
    const url = `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
    const response = await axios({
      method: 'get',
      url,
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY
      }
    });

    // Check if response.data exists and is an array
    if (!Array.isArray(response.data)) {
      console.warn('Voice API did not return an array:', response.data);
      return [];
    }

    // Filter to focus on Indian and important global languages
    // Expanded list of Indian language locales
    const indianLanguages = [
      'hi-IN', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 
      'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN', 'ur-IN',
      'as-IN', 'or-IN', 'ta-LK', 'ta-MY', 'ta-SG'
    ];
    
    const highlightedVoices = response.data.filter(voice => {
      // Skip if voice or voice.locale is undefined
      if (!voice || !voice.locale) return false;
      
      // Prioritize Indian languages
      if (indianLanguages.some(lang => voice.locale.startsWith(lang))) {
        return true;
      }
      
      // Include other common languages
      return (
        voice.locale.startsWith('en-') ||
        voice.locale.startsWith('zh-') ||
        voice.locale.startsWith('ar-') ||
        voice.locale.startsWith('es-') ||
        voice.locale.startsWith('fr-') ||
        voice.locale.startsWith('de-') ||
        voice.locale.startsWith('ru-') ||
        voice.locale.startsWith('pt-') ||
        voice.locale.startsWith('ja-') ||
        voice.locale.startsWith('ko-')
      );
    });
    
    // Return all voices if we couldn't find any highlighted voices
    return highlightedVoices.length > 0 ? 
      highlightedVoices : 
      (Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error getting voices:', error);
    // Return empty array instead of throwing error to make system more resilient
    return [];
  }
};

module.exports = {
  getSpeechToken,
  getVoices
};

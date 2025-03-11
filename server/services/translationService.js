const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { azure } = require('../config');

// Azure Translator API configuration
const AZURE_TRANSLATOR_ENDPOINT = azure.translatorEndpoint;
const AZURE_TRANSLATOR_KEY = azure.translatorKey;
const AZURE_TRANSLATOR_REGION = azure.translatorRegion;
const AZURE_TRANSLATOR_API_VERSION = '3.0';

/**
 * Translate text using Azure Translator API
 * @param {string} text - The text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} - Translated text
 */
const translateText = async (text, sourceLanguage, targetLanguage) => {
  try {
    // Convert language codes if needed (remove region part if present)
    const sourceLang = sourceLanguage ? sourceLanguage.split('-')[0] : 'auto';
    const targetLang = targetLanguage.split('-')[0];

    // Create request headers for Azure Translator
    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
      'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4()
    };

    // Configure request parameters
    const params = {
      'api-version': AZURE_TRANSLATOR_API_VERSION,
      'to': targetLang
    };

    // Only specify 'from' if source language is known and not auto
    if (sourceLang !== 'auto' && sourceLang !== targetLang) {
      params.from = sourceLang;
    }

    // Make translation request
    const response = await axios.post(
      `${AZURE_TRANSLATOR_ENDPOINT}/translate`,
      [{ text }],
      {
        headers,
        params
      }
    );

    // Check if we have a valid response
    if (response.data && response.data.length > 0 && response.data[0].translations.length > 0) {
      return response.data[0].translations[0].text;
    } else {
      throw new Error('Invalid translation response from Azure');
    }
    
  } catch (error) {
    console.error('Translation error:', error);
    
    if (error.response && error.response.data) {
      console.error('Azure API error:', error.response.data);
    }
    
    throw new Error('Failed to translate text');
  }
};

/**
 * Get alternative translations for a text
 * @param {string} text - The text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string[]>} - Alternative translations
 */
const getAlternativeTranslations = async (text, sourceLanguage, targetLanguage) => {
  try {
    // For now, we'll simply create variations of the main translation
    // as Azure doesn't directly provide alternatives
    const translation = await translateText(text, sourceLanguage, targetLanguage);

    // Create some artificial alternatives
    // In a production app, you might use other approaches or languages
    let words = translation.split(' ');
    const alternatives = [];
    
    if (words.length > 3) {
      // Alternative 1: Rearrange some words
      const alt1 = [...words];
      if (alt1.length > 3) {
        [alt1[1], alt1[2]] = [alt1[2], alt1[1]]; // Swap two words
      }
      alternatives.push(alt1.join(' '));
      
      // Alternative 2: Add a formal variant
      const alt2 = [...words];
      alternatives.push(`${alt2.join(' ')}.`);
    }
    
    return alternatives.filter(alt => alt !== translation);
  } catch (error) {
    console.error('Error getting alternative translations:', error);
    return [];
  }
};

/**
 * Detect the language of a text
 * @param {string} text - The text to analyze
 * @returns {Promise<string>} - Detected language code
 */
const detectLanguage = async (text) => {
  try {
    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
      'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4()
    };

    const params = {
      'api-version': AZURE_TRANSLATOR_API_VERSION
    };

    const response = await axios.post(
      `${AZURE_TRANSLATOR_ENDPOINT}/detect`,
      [{ text }],
      {
        headers,
        params
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0].language;
    }

    return 'en'; // Default to English if detection fails
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
};

module.exports = {
  translateText,
  getAlternativeTranslations,
  detectLanguage
};

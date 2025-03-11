const express = require('express');
const { translateText, detectLanguage, getAlternativeTranslations } = require('../services/translationService');
const { getSpeechToken, getVoices } = require('../services/speechService');

const router = express.Router();

// Route to translate text
router.post('/', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Missing required parameters: text and targetLanguage are required'
      });
    }

    const result = await translateText(text, sourceLanguage, targetLanguage);
    
    res.json({ translation: result });
  } catch (error) {
    console.error('Translation route error:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
});

// Route to get alternative translations
router.post('/alternatives', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Missing required parameters: text and targetLanguage are required'
      });
    }

    const alternatives = await getAlternativeTranslations(text, sourceLanguage, targetLanguage);
    
    res.json({ alternatives });
  } catch (error) {
    console.error('Alternatives route error:', error);
    res.status(500).json({ error: 'Failed to get alternative translations' });
  }
});

// Route to detect language
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing required parameter: text' });
    }

    const detectedLanguage = await detectLanguage(text);
    
    res.json({ detectedLanguage });
  } catch (error) {
    console.error('Language detection route error:', error);
    res.status(500).json({ error: 'Failed to detect language' });
  }
});

// Route to get Azure Speech token for client-side auth
router.get('/speech-token', async (req, res) => {
  try {
    const token = await getSpeechToken();
    
    res.json({ 
      token: token.authToken, 
      region: token.region,
      expiresIn: token.expiresIn
    });
  } catch (error) {
    console.error('Speech token error:', error);
    res.status(500).json({ error: 'Failed to get speech token' });
  }
});

// Route to get available TTS voices
router.get('/voices', async (req, res) => {
  try {
    const voices = await getVoices();
    res.json({ voices });
  } catch (error) {
    console.error('Voices route error:', error);
    res.status(500).json({ error: 'Failed to get voices' });
  }
});

module.exports = {
  translateRoute: router
};

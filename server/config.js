require('dotenv').config();

module.exports = {
  azure: {
    translatorKey: process.env.AZURE_TRANSLATOR_KEY,
    translatorRegion: process.env.AZURE_TRANSLATOR_REGION,
    translatorEndpoint: process.env.AZURE_TRANSLATOR_ENDPOINT,
    speechKey: process.env.AZURE_SPEECH_KEY,
    speechEndpoint: process.env.AZURE_SPEECH_ENDPOINT,
    speechRegion: process.env.AZURE_SPEECH_REGION
  },
  server: {
    port: process.env.PORT || 5000
  }
};

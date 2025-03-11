import { Language } from '../types/language';

export const SUPPORTED_LANGUAGES: Language[] = [
  // Indian languages (highlighted at the top)
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bangla)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'gom', name: 'कोंकणी (Konkani)' },
  { code: 'sd', name: 'سنڌي (Sindhi)' },
  { code: 'ks', name: 'کٲشُر (Kashmiri)' },
  { code: 'doi', name: 'डोगरी (Dogri)' },
  { code: 'mai', name: 'मैथिली (Maithili)' },
  { code: 'bho', name: 'भोजपुरी (Bhojpuri)' },
  { code: 'brx', name: 'बड़ो (Bodo)' },
  
  // Other languages supported by Azure Translator
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani (Latin)' },
  { code: 'ba', name: 'Bashkir' },
  { code: 'eu', name: 'Basque' },
  { code: 'bs', name: 'Bosnian (Latin)' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'yue', name: 'Cantonese (Traditional)' },
  { code: 'ca', name: 'Catalan' },
  { code: 'lzh', name: 'Chinese (Literary)' },
  { code: 'zh-Hans', name: 'Chinese Simplified' },
  { code: 'zh-Hant', name: 'Chinese Traditional' },
  { code: 'sn', name: 'chiShona' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'prs', name: 'Dari' },
  { code: 'dv', name: 'Divehi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Estonian' },
  { code: 'fo', name: 'Faroese' },
  { code: 'fj', name: 'Fijian' },
  { code: 'fil', name: 'Filipino' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fr-ca', name: 'French (Canada)' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'he', name: 'Hebrew' },
  { code: 'mww', name: 'Hmong Daw (Latin)' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ikt', name: 'Inuinnaqtun' },
  { code: 'iu', name: 'Inuktitut' },
  { code: 'iu-Latn', name: 'Inuktitut (Latin)' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'tlh-Latn', name: 'Klingon' },
  { code: 'tlh-Piqd', name: 'Klingon (plqaD)' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish (Central)' },
  { code: 'kmr', name: 'Kurdish (Northern)' },
  { code: 'ky', name: 'Kyrgyz (Cyrillic)' },
  { code: 'lo', name: 'Lao' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'ln', name: 'Lingala' },
  { code: 'dsb', name: 'Lower Sorbian' },
  { code: 'lug', name: 'Luganda' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay (Latin)' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mn-Cyrl', name: 'Mongolian (Cyrillic)' },
  { code: 'mn-Mong', name: 'Mongolian (Traditional)' },
  { code: 'my', name: 'Myanmar' },
  { code: 'ne', name: 'Nepali' },
  { code: 'nb', name: 'Norwegian Bokmål' },
  { code: 'nya', name: 'Nyanja' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese (Brazil)' },
  { code: 'pt-pt', name: 'Portuguese (Portugal)' },
  { code: 'otq', name: 'Queretaro Otomi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'run', name: 'Rundi' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan (Latin)' },
  { code: 'sr-Cyrl', name: 'Serbian (Cyrillic)' },
  { code: 'sr-Latn', name: 'Serbian (Latin)' },
  { code: 'st', name: 'Sesotho' },
  { code: 'nso', name: 'Sesotho sa Leboa' },
  { code: 'tn', name: 'Setswana' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali (Arabic)' },
  { code: 'es', name: 'Spanish' },
  { code: 'sw', name: 'Swahili (Latin)' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ty', name: 'Tahitian' },
  { code: 'tt', name: 'Tatar (Latin)' },
  { code: 'th', name: 'Thai' },
  { code: 'bo', name: 'Tibetan' },
  { code: 'ti', name: 'Tigrinya' },
  { code: 'to', name: 'Tongan' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen (Latin)' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'hsb', name: 'Upper Sorbian' },
  { code: 'ug', name: 'Uyghur (Arabic)' },
  { code: 'uz', name: 'Uzbek (Latin)' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'yua', name: 'Yucatec Maya' },
  { code: 'zu', name: 'Zulu' }
];

// Update the language code mapping for speech recognition compatibility
export const SPEECH_TO_TRANSLATE_LANG_MAP: Record<string, string> = {
  // Common speech recognition language codes to Azure Translator codes
  'en-US': 'en',
  'en-GB': 'en',
  'en-IN': 'en',
  'hi-IN': 'hi',
  'bn-IN': 'bn',
  'ur-IN': 'ur',
  'pa-IN': 'pa',
  'ta-IN': 'ta',
  'te-IN': 'te',
  'kn-IN': 'kn',
  'ml-IN': 'ml',
  'gu-IN': 'gu',
  'mr-IN': 'mr',
  'or-IN': 'or',
  'as-IN': 'as',
  'ar-SA': 'ar',
  'zh-CN': 'zh-Hans',
  'zh-TW': 'zh-Hant',
  'nl-NL': 'nl',
  'fr-FR': 'fr',
  'fr-CA': 'fr-ca',
  'de-DE': 'de',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'pt-BR': 'pt',
  'pt-PT': 'pt-pt',
  'ru-RU': 'ru',
  'es-ES': 'es',
  'es-MX': 'es',
  'th-TH': 'th',
  'tr-TR': 'tr',
  'vi-VN': 'vi'
};

// Azure speech recognition language codes with full support
export const AZURE_SPEECH_LANGUAGE_CODES: Record<string, string> = {
  // Indian languages
  'hi': 'hi-IN',   // Hindi (India)
  'en': 'en-IN',   // English (India)
  
  // Indian languages with limited support - map to appropriate fallbacks
  'bn': 'bn-IN',   // Bengali (India)
  'gu': 'gu-IN',   // Gujarati (India)
  'kn': 'kn-IN',   // Kannada (India)
  'ml': 'ml-IN',   // Malayalam (India)
  'mr': 'mr-IN',   // Marathi (India)
  'ta': 'ta-IN',   // Tamil (India)
  'te': 'te-IN',   // Telugu (India)
  'ur': 'ur-IN',   // Urdu (India)
  'pa': 'pa-IN',   // Punjabi (India)
  'or': 'or-IN',   // Odia (India)
  'as': 'as-IN',   // Assamese (India)
  
  // Other well-supported languages
  'zh': 'zh-CN',   // Chinese (Simplified)
  'fr': 'fr-FR',   // French (France)
  'de': 'de-DE',   // German (Germany)
  'es': 'es-ES',   // Spanish (Spain)
  'it': 'it-IT',   // Italian (Italy)
  'ja': 'ja-JP',   // Japanese (Japan)
  'ko': 'ko-KR',   // Korean (Korea)
  'pt': 'pt-BR',   // Portuguese (Brazil)
  'ru': 'ru-RU',   // Russian (Russia)
};

// Languages with good speech-to-text support
export const GOOD_STT_SUPPORT = [
  'en-US', 'en-GB', 'en-IN', 
  'hi-IN',
  'zh-CN', 'es-ES', 'es-MX', 
  'fr-FR', 'de-DE', 'it-IT', 
  'ja-JP', 'ko-KR', 'pt-BR'
];

// List of Indian language codes - expanded to include all Indian languages
export const INDIAN_LANGUAGES = [
  'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 'as', 'or',
  'sd', 'ks', 'doi', 'mai', 'bho', 'brx', 'gom', 'sa', 'ne'
];

// Get the speech recognition code for a language
export function getSpeechRecognitionCode(translationCode: string): string {
  // For Azure speech service we need proper regional codes
  const baseCode = translationCode.split('-')[0];
  
  // Check if we have a direct mapping for this language
  if (AZURE_SPEECH_LANGUAGE_CODES[baseCode]) {
    return AZURE_SPEECH_LANGUAGE_CODES[baseCode];
  }
  
  // Check if it's an unsupported Indian language
  if (INDIAN_LANGUAGES.includes(baseCode)) {
    console.log(`Unsupported Indian language: ${baseCode}, falling back to Hindi`);
    return 'hi-IN'; // Default unsupported Indian languages to Hindi
  }
  
  // For languages not in our map, try to construct a code
  // or fall back to English
  return `${baseCode}-${baseCode.toUpperCase()}` || 'en-US';
}

// Get the Azure Translator language code from speech recognition code
export function getSpeechToTranslateCode(speechCode: string): string {
  // First check the map
  if (SPEECH_TO_TRANSLATE_LANG_MAP[speechCode]) {
    return SPEECH_TO_TRANSLATE_LANG_MAP[speechCode];
  }
  
  // For Chinese, default to Simplified if not specified
  if (speechCode.startsWith('zh')) {
    return 'zh-Hans';
  }
  
  // For Portuguese, default to Brazilian if not specified
  if (speechCode.startsWith('pt')) {
    return 'pt';
  }
  
  // If not found in map, return the first part before the dash
  // or the entire code if there's no dash
  return speechCode.includes('-') ? speechCode.split('-')[0] : speechCode;
}

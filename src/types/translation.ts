export interface AzureTranslationResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
  detectedLanguage?: {
    language: string;
    score: number;
  };
}

export interface AzureDetectionResponse {
  language: string;
  score: number;
  isTranslationSupported: boolean;
  isTransliterationSupported: boolean;
}

export interface TranslationAlternative {
  text: string;
  confidence?: number;
}

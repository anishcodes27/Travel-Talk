import { Language } from './language';

export interface ConversationItem {
  id: number;
  originalText: string;
  originalLanguage: Language;
  translatedText: string;
  targetLanguage: Language;
}

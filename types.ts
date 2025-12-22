export enum KanaType {
  HIRAGANA = 'HIRAGANA',
  KATAKANA = 'KATAKANA',
  BOTH = 'BOTH'
}

export enum QuizMode {
  CHOICE = 'CHOICE',       // 選擇題
  HANDWRITING = 'HANDWRITING', // 手寫板
  FLASHCARD = 'FLASHCARD',  // 翻牌記憶
  LISTENING = 'LISTENING'   // 聽力測驗
}

export interface KanaChar {
  romaji: string;
  hiragana: string;
  katakana: string;
  category: string;
}

export interface QuizSettings {
  mode: QuizMode;
  kanaType: KanaType;
  categories: string[];
}

export interface Question {
  correct: KanaChar;
  options: string[];
  questionType: 'TO_ROMAJI' | 'TO_KANA';
  targetScript?: 'HIRAGANA' | 'KATAKANA';
}

// ✅ 這次新增的：錯誤詳細資訊的定義
export interface MistakeItem {
  id: string | number;
  questionContent: string;
  userAnswerContent: string;
  correctAnswerContent: string;
}

export interface QuizResult {
  total: number;
  correct: number;
  wrongItems: KanaChar[];
  mistakes?: MistakeItem[]; // ✅ 新增這個欄位，讓成績單可以攜帶詳細錯誤資訊
}

export interface Mnemonic {
  character: string;
  mnemonic: string;
  exampleWord: string;
  exampleMeaning: string;
}
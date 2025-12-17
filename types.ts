import { Type } from "@google/genai";

export enum ViewState {
  MENU = 'MENU',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  CHART = 'CHART'
}

export enum KanaType {
  HIRAGANA = 'HIRAGANA',
  KATAKANA = 'KATAKANA',
  MIX = 'MIX'
}

export enum KanaCategory {
  SEION = 'SEION',   // 清音 (Basic 50)
  DAKUON = 'DAKUON', // 濁音 & 半濁音
  YOON = 'YOON'      // 拗音
}

export enum QuizMode {
  CHOICE = 'CHOICE',       // 看字選羅馬拼音 (或反之)
  HANDWRITING = 'HANDWRITING', // 看羅馬拼音寫假名
  FLASHCARD = 'FLASHCARD',   // 看字讀音 (自我檢測)
  LISTENING = 'LISTENING'    // 聽力測驗
}

export interface QuizSettings {
  kanaType: KanaType;
  categories: KanaCategory[];
  mode: QuizMode;
}

export interface KanaChar {
  romaji: string;
  hiragana: string;
  katakana: string;
  category: KanaCategory;
}

export interface Question {
  correct: KanaChar;
  options: string[]; // For choice mode
  questionType: 'TO_ROMAJI' | 'TO_KANA'; 
  targetScript?: 'HIRAGANA' | 'KATAKANA'; // For Mixed handwriting/audio context
}

export interface QuizResult {
  total: number;
  correct: number;
  wrongItems: KanaChar[];
}

// Gemini Response Types
export interface Mnemonic {
  character: string;
  mnemonic: string;
  exampleWord: string;
  exampleMeaning: string;
}

export const MnemonicSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      character: { type: Type.STRING },
      mnemonic: { type: Type.STRING },
      exampleWord: { type: Type.STRING },
      exampleMeaning: { type: Type.STRING }
    },
    required: ["character", "mnemonic", "exampleWord", "exampleMeaning"]
  }
};
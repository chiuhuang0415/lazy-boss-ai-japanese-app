import { KanaChar, Mnemonic } from "../types";

// 我們移除了 GoogleGenAI 的引用，這樣就不會跟你要 API Key 了

export const generateStudyGuide = async (wrongItems: KanaChar[]): Promise<Mnemonic[]> => {
  // 1. 如果沒有錯字，直接回傳空陣列
  if (wrongItems.length === 0) return [];

  // 2. 模擬一點點讀取時間 (0.5秒)，讓使用者覺得「系統正在努力分析中...」
  // 這樣感覺比較真實，不會覺得是假的
  await new Promise(resolve => setTimeout(resolve, 500));

  // 3. 直接產生「本機版」的記憶口訣
  // 這裡我們用一個通用的邏輯來回傳資料，保證不會出錯
  return wrongItems.map(item => {
    return {
      // 顯示假名
      kana: `${item.hiragana} / ${item.katakana}`,
      romaji: item.romaji,
      // 這裡提供一個通用的鼓勵口訣，代替原本的 AI 生成
      mnemonic: `記住這個音與「${item.romaji}」的關聯。建議在紙上多練習書寫幾次，加深印象！`,
      // 給一個通用的單字 (或者你也可以以後自己建立一個單字庫來對應)
      word: '練習 (Renshuu)',
      wordMeaning: '練習'
    };
  });
};
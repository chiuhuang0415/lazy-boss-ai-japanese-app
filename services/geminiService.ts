import { GoogleGenAI } from "@google/genai";
import { KanaChar, Mnemonic, MnemonicSchema } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyGuide = async (wrongItems: KanaChar[]): Promise<Mnemonic[]> => {
  if (wrongItems.length === 0) return [];

  // Limit to 5 items to save tokens/time if list is huge
  const itemsToProcess = wrongItems.slice(0, 5);
  
  const promptList = itemsToProcess.map(item => `${item.hiragana}/${item.katakana} (${item.romaji})`).join(", ");

  const prompt = `
    我是一個正在學習日文五十音的初學者。
    我在剛才的測驗中答錯了以下這幾個假名： ${promptList}。
    
    請針對這每一個假名，提供一個繁體中文的「記憶口訣 (Mnemonic)」來幫助我記住它的形狀或發音，
    並提供一個包含該假名的簡單日文單字（含假名與中文意思）。
    
    請以 JSON 格式回傳。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: MnemonicSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as Mnemonic[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

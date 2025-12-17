import { useState, useEffect } from 'react';

// ------------------------------------------
// 1. 資料區：直接把 50 音資料放在這裡，不依賴外部檔案
// ------------------------------------------
const KANA_DATA = [
  { hiragana: 'あ', romaji: 'a' }, { hiragana: 'い', romaji: 'i' }, { hiragana: 'う', romaji: 'u' }, { hiragana: 'え', romaji: 'e' }, { hiragana: 'お', romaji: 'o' },
  { hiragana: 'か', romaji: 'ka' }, { hiragana: 'き', romaji: 'ki' }, { hiragana: 'く', romaji: 'ku' }, { hiragana: 'け', romaji: 'ke' }, { hiragana: 'こ', romaji: 'ko' },
  { hiragana: 'さ', romaji: 'sa' }, { hiragana: 'し', romaji: 'shi' }, { hiragana: 'す', romaji: 'su' }, { hiragana: 'せ', romaji: 'se' }, { hiragana: 'そ', romaji: 'so' },
  { hiragana: 'た', romaji: 'ta' }, { hiragana: 'ち', romaji: 'chi' }, { hiragana: 'つ', romaji: 'tsu' }, { hiragana: 'て', romaji: 'te' }, { hiragana: 'と', romaji: 'to' },
  { hiragana: 'な', romaji: 'na' }, { hiragana: 'に', romaji: 'ni' }, { hiragana: 'ぬ', romaji: 'nu' }, { hiragana: 'ね', romaji: 'ne' }, { hiragana: 'の', romaji: 'no' },
  { hiragana: 'は', romaji: 'ha' }, { hiragana: 'ひ', romaji: 'hi' }, { hiragana: 'ふ', romaji: 'fu' }, { hiragana: 'へ', romaji: 'he' }, { hiragana: 'ほ', romaji: 'ho' },
  { hiragana: 'ま', romaji: 'ma' }, { hiragana: 'み', romaji: 'mi' }, { hiragana: 'む', romaji: 'mu' }, { hiragana: 'め', romaji: 'me' }, { hiragana: 'も', romaji: 'mo' },
  { hiragana: 'や', romaji: 'ya' }, { hiragana: 'ゆ', romaji: 'yu' }, { hiragana: 'よ', romaji: 'yo' },
  { hiragana: 'ら', romaji: 'ra' }, { hiragana: 'り', romaji: 'ri' }, { hiragana: 'る', romaji: 'ru' }, { hiragana: 'れ', romaji: 're' }, { hiragana: 'ろ', romaji: 'ro' },
  { hiragana: 'わ', romaji: 'wa' }, { hiragana: 'を', romaji: 'wo' }, { hiragana: 'ん', romaji: 'n' }
];

// ------------------------------------------
// 2. 主程式區：完全獨立運作，不需要 AI，不需要 API Key
// ------------------------------------------
export default function App() {
  // 遊戲狀態
  const [current, setCurrent] = useState(KANA_DATA[0]);
  const [options, setOptions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState('');
  const [shake, setShake] = useState(false);

  // 出題邏輯：隨機選一題，並湊 3 個錯誤答案
  const nextQuestion = () => {
    const answer = KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)];
    let opts = [answer];
    while (opts.length < 4) {
      const wrong = KANA_DATA[Math.floor(Math.random() * KANA_DATA.length)];
      // 確保選項不重複
      if (!opts.find(o => o.romaji === wrong.romaji)) {
        opts.push(wrong);
      }
    }
    // 打亂選項順序
    setOptions(opts.sort(() => Math.random() - 0.5));
    setCurrent(answer);
    setMsg('');
    setShake(false);
  };

  // 程式一啟動就出第一題
  useEffect(() => {
    nextQuestion();
  }, []);

  // 處理回答
  const handleGuess = (romaji: string) => {
    if (romaji === current.romaji) {
      setScore(s => s + 1);
      setMsg('✨ CORRECT! (正解)');
      // 0.5 秒後自動下一題
      setTimeout(nextQuestion, 500);
    } else {
      setMsg(`❌ 錯囉！答案是 ${current.romaji}`);
      setShake(true);
      // 手機震動
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  // ------------------------------------------
  // 3. 畫面區：黑底白字極簡風
  // ------------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 頂部資訊 */}
        <div className="flex justify-between mb-8 text-gray-400 font-mono text-sm">
          <span>Lazy AI Lab</span>
          <span className="text-green-400 font-bold">Score: {score}</span>
        </div>

        {/* 大大的題目卡片 */}
        <div className={`
          bg-gray-800 rounded-3xl aspect-square flex items-center justify-center mb-6 
          border-4 transition-all duration-100 shadow-2xl
          ${shake ? 'border-red-500 translate-x-1' : 'border-transparent'}
        `}>
          <span className="text-9xl font-bold select-none">{current.hiragana}</span>
        </div>

        {/* 提示訊息 */}
        <div className={`h-8 text-center font-bold mb-6 text-lg ${msg.includes('❌') ? 'text-red-400' : 'text-yellow-400'}`}>
          {msg}
        </div>

        {/* 選項按鈕區 */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleGuess(opt.romaji)}
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 py-6 rounded-2xl text-2xl font-bold transition-all transform active:scale-95 shadow-lg border-b-4 border-gray-900 active:border-b-0 active:translate-y-1"
            >
              {opt.romaji}
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center text-gray-600 text-xs">
          Powered by Vercel & React
        </div>
      </div>
    </div>
  );
}
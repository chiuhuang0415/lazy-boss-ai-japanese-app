import React, { useState } from 'react';
import { KanaType, QuizSettings, KanaCategory, QuizMode } from '../types';

interface MainMenuProps {
  onStart: (settings: QuizSettings) => void;
  onOpenChart: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onOpenChart }) => {
  const [categories, setCategories] = useState<KanaCategory[]>([KanaCategory.SEION]);
  const [quizMode, setQuizMode] = useState<QuizMode>(QuizMode.FLASHCARD);

  const toggleCategory = (cat: KanaCategory) => {
    setCategories(prev => {
      if (prev.includes(cat)) {
        // Prevent deselecting all
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleStart = (kanaType: KanaType) => {
    onStart({
      kanaType,
      categories,
      mode: quizMode
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in pb-10 pt-10">
      <div className="text-center space-y-2 mb-2">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 tracking-tight leading-snug pb-2">
          🧪 懶人 AI 實驗室
        </h1>
        <p className="text-gray-500 font-medium tracking-widest text-sm uppercase">
          日文五十音極速修練
        </p>
      </div>

      {/* Chart Link (Moved Here) */}
      <button 
        onClick={onOpenChart}
        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white border border-indigo-100 rounded-full text-indigo-600 font-bold shadow-sm hover:shadow-md hover:border-indigo-200 transition-all transform hover:-translate-y-0.5"
      >
        <span className="p-1 rounded-full bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </span>
        查看五十音學習表
      </button>

      {/* Settings Section */}
      <div className="w-full max-w-2xl px-6 mb-4 space-y-6">
        
        {/* Mode Toggle */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">作答模式</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-gray-50 p-1.5">
                <button 
                    onClick={() => setQuizMode(QuizMode.FLASHCARD)}
                    className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizMode === QuizMode.FLASHCARD ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    <span>🗣️</span> 讀音卡
                </button>
                <button 
                    onClick={() => setQuizMode(QuizMode.HANDWRITING)}
                    className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizMode === QuizMode.HANDWRITING ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    <span>✍️</span> 手寫板
                </button>
                <button 
                    onClick={() => setQuizMode(QuizMode.CHOICE)}
                    className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizMode === QuizMode.CHOICE ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    <span>🅰️</span> 選擇題
                </button>
                <button 
                    onClick={() => setQuizMode(QuizMode.LISTENING)}
                    className={`py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${quizMode === QuizMode.LISTENING ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    <span>🎧</span> 聽力
                </button>
            </div>
            
            <div className="mt-3 text-center min-h-[1.5em]">
                {quizMode === QuizMode.FLASHCARD && (
                    <p className="text-xs text-indigo-400 font-medium animate-fade-in">
                        ✨ 看字讀音，翻卡自我檢測，最紮實的記憶方式！
                    </p>
                )}
                {quizMode === QuizMode.HANDWRITING && (
                    <p className="text-xs text-indigo-400 font-medium animate-fade-in">
                        ✨ 看拼音寫假名，防止猜題，強化肌肉記憶！
                    </p>
                )}
                {quizMode === QuizMode.CHOICE && (
                    <p className="text-xs text-indigo-400 font-medium animate-fade-in">
                        ✨ 傳統四選一，快速刷題複習。
                    </p>
                )}
                {quizMode === QuizMode.LISTENING && (
                    <p className="text-xs text-indigo-400 font-medium animate-fade-in">
                        ✨ 隱藏文字，專注於聽音辨字！
                    </p>
                )}
            </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
                 測驗範圍 <span className="text-xs font-normal text-indigo-400 ml-1">(可複選)</span>
             </h4>
             <div className="flex flex-wrap justify-center gap-3">
                <label className={`cursor-pointer px-4 py-2 rounded-full border text-sm font-bold transition-all select-none ${categories.includes(KanaCategory.SEION) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <input type="checkbox" className="hidden" 
                        checked={categories.includes(KanaCategory.SEION)} 
                        onChange={() => toggleCategory(KanaCategory.SEION)} 
                    />
                    五十音 (清音)
                </label>
                <label className={`cursor-pointer px-4 py-2 rounded-full border text-sm font-bold transition-all select-none ${categories.includes(KanaCategory.DAKUON) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <input type="checkbox" className="hidden" 
                        checked={categories.includes(KanaCategory.DAKUON)} 
                        onChange={() => toggleCategory(KanaCategory.DAKUON)} 
                    />
                    濁音 / 半濁音
                </label>
                <label className={`cursor-pointer px-4 py-2 rounded-full border text-sm font-bold transition-all select-none ${categories.includes(KanaCategory.YOON) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                    <input type="checkbox" className="hidden" 
                        checked={categories.includes(KanaCategory.YOON)} 
                        onChange={() => toggleCategory(KanaCategory.YOON)} 
                    />
                    拗音 (Kya...)
                </label>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-6">
        <button
          onClick={() => handleStart(KanaType.HIRAGANA)}
          className="group relative p-6 bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <span className="relative z-10 block text-4xl mb-2 text-pink-500 font-bold">あ</span>
          <h3 className="relative z-10 text-xl font-bold text-gray-800">平假名</h3>
          <p className="relative z-10 text-xs text-gray-400 mt-1">基礎入門 Hiragana</p>
        </button>

        <button
          onClick={() => handleStart(KanaType.KATAKANA)}
          className="group relative p-6 bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <span className="relative z-10 block text-4xl mb-2 text-blue-500 font-bold">ア</span>
          <h3 className="relative z-10 text-xl font-bold text-gray-800">片假名</h3>
          <p className="relative z-10 text-xs text-gray-400 mt-1">外來語 Katakana</p>
        </button>

        <button
          onClick={() => handleStart(KanaType.MIX)}
          className="group relative p-6 bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <span className="relative z-10 block text-4xl mb-2 text-purple-500 font-bold">あア</span>
          <h3 className="relative z-10 text-xl font-bold text-gray-800">混合模式</h3>
          <p className="relative z-10 text-xs text-gray-400 mt-1">綜合挑戰 Mix</p>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
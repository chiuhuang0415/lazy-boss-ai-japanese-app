import React, { useState } from 'react';
import { KanaCategory, KanaChar } from '../types';
import { KANA_DATA } from '../constants';

interface KanaChartProps {
  onBack: () => void;
}

const KanaChart: React.FC<KanaChartProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<KanaCategory>(KanaCategory.SEION);

  const filteredData = KANA_DATA.filter(k => k.category === activeTab);

  const playAudio = (char: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(char);
      const voices = window.speechSynthesis.getVoices();
      const jpVoice = voices.find(v => 
        v.lang.toLowerCase().includes('ja') && 
        (v.name.includes('Google') || v.name.includes('Microsoft'))
      );
      if (jpVoice) utterance.voice = jpVoice;
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8; 
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col h-[85vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1 px-2 py-1 hover:bg-indigo-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="text-sm font-bold">返回</span>
        </button>
        <h2 className="text-xl font-bold text-gray-800">五十音學習表</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
        <button 
          onClick={() => setActiveTab(KanaCategory.SEION)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === KanaCategory.SEION ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          清音
        </button>
        <button 
          onClick={() => setActiveTab(KanaCategory.DAKUON)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === KanaCategory.DAKUON ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          濁音/半濁音
        </button>
        <button 
          onClick={() => setActiveTab(KanaCategory.YOON)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === KanaCategory.YOON ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          拗音
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-inner border border-gray-100 p-4">
        <div className={`grid gap-2 ${activeTab === KanaCategory.YOON ? 'grid-cols-3' : 'grid-cols-5'}`}>
            {filteredData.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => playAudio(item.hiragana)}
                    className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl hover:bg-indigo-50 active:bg-indigo-100 active:scale-95 transition-all border border-transparent hover:border-indigo-100"
                >
                    <div className="text-2xl font-black text-gray-800 leading-none mb-1">
                        {item.hiragana}
                    </div>
                    <div className="text-lg font-bold text-gray-400 leading-none mb-1">
                        {item.katakana}
                    </div>
                    <div className="text-xs font-mono text-indigo-400 font-bold uppercase">
                        {item.romaji}
                    </div>
                </button>
            ))}
        </div>
        <div className="text-center mt-6 text-gray-400 text-xs">
            💡 點擊假名可聽取發音
        </div>
      </div>
    </div>
  );
};

export default KanaChart;
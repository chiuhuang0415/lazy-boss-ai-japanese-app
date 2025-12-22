import React from 'react';
import { QuizResult } from '../types';

interface ResultScreenProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetry, onHome }) => {
  // 1. 安全檢查：如果沒有成績資料，顯示載入中或錯誤，防止白畫面
  if (!result) {
    return <div className="p-10 text-center text-red-500">找不到成績資料</div>;
  }

  // 2. 計算分數
  const percentage = Math.round((result.correct / result.total) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10 flex flex-col items-center pb-20">
      
      {/* 成績卡片 (拿掉動畫 class 避免卡住) */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full text-center border border-gray-100 mb-8">
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">測驗結果</p>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            {/* 圓形進度條 SVG */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                className="text-gray-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={365}
                strokeDashoffset={365 - (365 * percentage) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
              <span className="text-4xl font-black text-gray-800">{percentage}%</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600">
          答對 <span className="font-bold text-green-600">{result.correct}</span> / {result.total}
        </p>
      </div>

      {/* 錯誤列表 (只在有錯時顯示) */}
      {result.wrongItems && result.wrongItems.length > 0 && (
        <div className="w-full mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-red-100 text-red-500 p-1 rounded-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
            </span>
            需要複習的假名
          </h3>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6">
            {result.wrongItems.map((item, idx) => (
              <div key={idx} className="bg-white p-2 rounded-xl border border-red-50 shadow-sm text-center">
                <div className="text-xl font-bold text-gray-800">{item.hiragana} / {item.katakana}</div>
                <div className="text-xs text-gray-400 font-mono">{item.romaji}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 按鈕區 */}
      <div className="flex w-full gap-4">
        <button
          onClick={onHome}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
        >
          回首頁
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200"
        >
          再試一次
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
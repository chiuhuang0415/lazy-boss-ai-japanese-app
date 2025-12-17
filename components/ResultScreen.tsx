import React, { useState } from 'react';
import { KanaChar, Mnemonic, QuizResult } from '../types';
import { generateStudyGuide } from '../services/geminiService';

interface ResultScreenProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetry, onHome }) => {
  const percentage = Math.round((result.correct / result.total) * 100);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiTips, setAiTips] = useState<Mnemonic[] | null>(null);

  const handleGetAiTips = async () => {
    setLoadingAi(true);
    const tips = await generateStudyGuide(result.wrongItems);
    setAiTips(tips);
    setLoadingAi(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10 flex flex-col items-center animate-fade-in pb-20">
      
      {/* Score Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full text-center border border-gray-100 mb-8">
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">測驗結果</p>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
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

      {/* Wrong Answers & AI Help */}
      {result.wrongItems.length > 0 && (
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

          {!aiTips ? (
            <button 
              onClick={handleGetAiTips}
              disabled={loadingAi}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 font-bold"
            >
              {loadingAi ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 老師分析中...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
                  </svg>
                  生成記憶口訣與例句
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4 animate-slide-up">
              {aiTips.map((tip, idx) => (
                <div key={idx} className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                    <div className="flex items-baseline gap-2 mb-2">
                        <h4 className="font-bold text-xl text-indigo-700">{tip.character}</h4>
                        <span className="text-xs text-indigo-400 bg-white px-2 py-0.5 rounded-full border border-indigo-100">口訣</span>
                    </div>
                    <p className="text-gray-700 mb-3 font-medium">{tip.mnemonic}</p>
                    <div className="bg-white p-3 rounded-lg text-sm border border-indigo-50">
                        <span className="text-gray-500 text-xs block mb-1">例句</span>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">{tip.exampleWord}</span>
                            <span className="text-gray-500">{tip.exampleMeaning}</span>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
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

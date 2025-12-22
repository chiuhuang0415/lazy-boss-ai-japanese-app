import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import QuizBoard from './components/QuizBoard';
import ResultScreen from './components/ResultScreen';
import MistakeReport from './components/MistakeReport'; // 引入剛剛修好的彈窗
import { QuizSettings, QuizResult, QuizMode, MistakeItem } from './types';

// 定義畫面狀態
type ScreenState = 'MENU' | 'QUIZ' | 'RESULT';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('MENU');
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showMistakePopup, setShowMistakePopup] = useState(false); // 控制彈窗顯示

  // 開始測驗
  const handleStart = (newSettings: QuizSettings) => {
    setSettings(newSettings);
    setCurrentScreen('QUIZ');
    setShowMistakePopup(false);
  };

  // 測驗完成
  const handleComplete = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentScreen('RESULT');
    
    // 如果有錯題，自動跳出彈窗
    if (result.wrongItems.length > 0) {
      setTimeout(() => {
        setShowMistakePopup(true);
      }, 1000); // 延遲 1 秒跳出，體驗比較好
    }
  };

  // 關閉彈窗
  const handleClosePopup = () => {
    setShowMistakePopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* 標題列 */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇯🇵</span>
            <h1 className="text-xl font-black tracking-tighter text-gray-800">
              Lazy Boss <span className="text-indigo-600">AI</span>
            </h1>
          </div>
        </div>
      </header>

      {/* 主畫面切換區 */}
      <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
        {currentScreen === 'MENU' && (
          <MainMenu onStart={handleStart} />
        )}

        {currentScreen === 'QUIZ' && settings && (
          <QuizBoard 
            settings={settings} 
            onComplete={handleComplete}
            onExit={() => setCurrentScreen('MENU')}
          />
        )}

        {currentScreen === 'RESULT' && quizResult && (
          <>
            <ResultScreen 
              result={quizResult} 
              onRetry={() => {
                if (settings) handleStart(settings);
              }}
              onHome={() => setCurrentScreen('MENU')}
            />

            {/* 這裡呼叫我們剛剛寫好的 MistakeReport */}
            {showMistakePopup && (
              <MistakeReport 
                mistakes={quizResult.mistakes || []} 
                onClose={handleClosePopup}
              />
            )}
          </>
        )}
      </main>

      {/* 頁尾 */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2025 Lazy Boss AI Laboratory</p>
      </footer>
    </div>
  );
}

export default App;
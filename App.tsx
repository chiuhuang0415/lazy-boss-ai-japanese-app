import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import QuizBoard from './components/QuizBoard';
import ResultScreen from './components/ResultScreen';
import KanaChart from './components/KanaChart';
import MistakeReport, { MistakeItem } from './components/MistakeReport'; // [新增] 引入急救包
import { ViewState, QuizResult, QuizSettings, KanaType, KanaCategory, QuizMode } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.MENU);
  // Default Settings
  const [settings, setSettings] = useState<QuizSettings>({
      kanaType: KanaType.HIRAGANA,
      categories: [KanaCategory.SEION],
      mode: QuizMode.CHOICE
  });
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  
  // [新增] 控制是否顯示錯題急救包的狀態
  const [showMistakeReport, setShowMistakeReport] = useState(false);

  const handleStart = (newSettings: QuizSettings) => {
    setSettings(newSettings);
    setView(ViewState.QUIZ);
  };

  const handleComplete = (result: QuizResult) => {
    setLastResult(result);
    setView(ViewState.RESULT);
    
    // [新增] 測驗結束時，如果有錯誤，就顯示急救包
    // 這裡使用了 (result as any) 是為了避免您的 types.ts 還沒更新而報錯
    // 如果 result 中有 mistakes 陣列且長度 > 0，則顯示
    const hasMistakes = (result as any).mistakes && (result as any).mistakes.length > 0;
    if (hasMistakes) {
      setShowMistakeReport(true);
    }
  };

  const handleExit = () => {
     setView(ViewState.MENU);
  };

  const handleRetry = () => {
    setShowMistakeReport(false); // 重試時關閉彈窗
    setView(ViewState.QUIZ);
  };

  const handleHome = () => {
    setShowMistakeReport(false); // 回首頁時關閉彈窗
    setView(ViewState.MENU);
  };

  const handleOpenChart = () => {
      setView(ViewState.CHART);
  };

  // [新增] 處理 Email 送出的邏輯 (目前僅在 console 顯示)
  const handleMistakeReportSubmit = (email: string) => {
    console.log("用戶訂閱了錯題急救包:", email);
    // 未來這裡可以串接 API 發送 PDF
    // 這裡不關閉視窗，讓 MistakeReport 自己顯示「成功畫面」
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <div className="max-w-3xl mx-auto min-h-screen relative bg-white sm:shadow-2xl sm:my-8 sm:min-h-[90vh] sm:rounded-[40px] overflow-hidden border border-gray-100">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <main className="relative z-10 h-full overflow-y-auto custom-scrollbar">
          {view === ViewState.MENU && (
            <MainMenu 
                onStart={handleStart} 
                onOpenChart={handleOpenChart}
            />
          )}
          {view === ViewState.QUIZ && (
            <QuizBoard 
                settings={settings}
                onComplete={handleComplete} 
                onExit={handleExit}
            />
          )}
          {view === ViewState.RESULT && lastResult && (
            <>
                <ResultScreen 
                    result={lastResult} 
                    onRetry={handleRetry} 
                    onHome={handleHome}
                />
                
                {/* [新增] 這裡判斷是否要顯示錯題急救包 */}
                {/* 注意：這裡假設 lastResult 裡面有一個 mistakes 陣列 */}
                {/* 如果您的 types.ts 還沒定義 mistakes，這裡用了 fallback 避免崩潰 */}
                {showMistakeReport && (
                  <MistakeReport 
                    mistakes={(lastResult as any).mistakes || []}
                    onSubmitEmail={handleMistakeReportSubmit}
                    onClose={() => setShowMistakeReport(false)}
                  />
                )}
            </>
          )}
          {view === ViewState.CHART && (
            <KanaChart onBack={handleHome} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

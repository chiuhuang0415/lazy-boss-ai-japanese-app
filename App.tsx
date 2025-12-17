import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import QuizBoard from './components/QuizBoard';
import ResultScreen from './components/ResultScreen';
import KanaChart from './components/KanaChart';
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

  const handleStart = (newSettings: QuizSettings) => {
    setSettings(newSettings);
    setView(ViewState.QUIZ);
  };

  const handleComplete = (result: QuizResult) => {
    setLastResult(result);
    setView(ViewState.RESULT);
  };

  const handleExit = () => {
     setView(ViewState.MENU);
  };

  const handleRetry = () => {
    setView(ViewState.QUIZ);
  };

  const handleHome = () => {
    setView(ViewState.MENU);
  };

  const handleOpenChart = () => {
      setView(ViewState.CHART);
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
            <ResultScreen 
                result={lastResult} 
                onRetry={handleRetry} 
                onHome={handleHome}
            />
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KanaChar, KanaType, Question, QuizResult, QuizSettings, QuizMode, MistakeItem } from '../types'; // [修改] 加入 MistakeItem
import { KANA_DATA } from '../constants';

interface QuizBoardProps {
  settings: QuizSettings;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

const QuizBoard: React.FC<QuizBoardProps> = ({ settings, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<KanaChar[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // [新增] 用來記錄詳細錯誤資訊 (為了錯題急救包)
  const [mistakeDetails, setMistakeDetails] = useState<MistakeItem[]>([]);
  
  // Handwriting/Flashcard specific state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Audio Playback
  const playAudio = useCallback((char: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(char);
      
      // Attempt to set a better voice
      const voices = window.speechSynthesis.getVoices();
      const jpVoice = voices.find(v => 
        v.lang.toLowerCase().includes('ja') && 
        (v.name.includes('Google') || v.name.includes('Microsoft'))
      );
      if (jpVoice) utterance.voice = jpVoice;

      utterance.lang = 'ja-JP';
      utterance.rate = 0.8; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Initialize Quiz
  useEffect(() => {
    const generateQuestions = () => {
      // 1. Filter by Category
      let filteredData = KANA_DATA.filter(k => settings.categories.includes(k.category));
      if (filteredData.length === 0) filteredData = KANA_DATA.slice(0, 46);

      // 2. Shuffle (This ensures unique correct answers within the slice)
      const shuffledData = [...filteredData].sort(() => 0.5 - Math.random());
      
      const newQuestions: Question[] = shuffledData.map((correctItem) => {
        let questionType: 'TO_ROMAJI' | 'TO_KANA';
        let targetScript: 'HIRAGANA' | 'KATAKANA' | undefined;

        // Determine Mode Logic
        if (settings.mode === QuizMode.FLASHCARD) {
            questionType = 'TO_ROMAJI'; // Show Kana, User says sound (reveals Romaji)
        } else if (settings.mode === QuizMode.HANDWRITING) {
            questionType = 'TO_KANA'; // Show Romaji, Write Kana
            if (settings.kanaType === KanaType.HIRAGANA) targetScript = 'HIRAGANA';
            else if (settings.kanaType === KanaType.KATAKANA) targetScript = 'KATAKANA';
            else targetScript = Math.random() > 0.5 ? 'HIRAGANA' : 'KATAKANA';
        } else if (settings.mode === QuizMode.LISTENING) {
            questionType = 'TO_KANA'; // Hear audio, pick Kana
             if (settings.kanaType === KanaType.HIRAGANA) targetScript = 'HIRAGANA';
            else if (settings.kanaType === KanaType.KATAKANA) targetScript = 'KATAKANA';
            else targetScript = Math.random() > 0.5 ? 'HIRAGANA' : 'KATAKANA';
        } else {
            // CHOICE Mode
            questionType = Math.random() > 0.5 ? 'TO_ROMAJI' : 'TO_KANA';
            
            if (questionType === 'TO_KANA') {
                if (settings.kanaType === KanaType.HIRAGANA) targetScript = 'HIRAGANA';
                else if (settings.kanaType === KanaType.KATAKANA) targetScript = 'KATAKANA';
                else targetScript = Math.random() > 0.5 ? 'HIRAGANA' : 'KATAKANA';
            }
        }
        
        // Generate options (For CHOICE and LISTENING)
        let options: string[] = [];
        if (settings.mode === QuizMode.CHOICE || settings.mode === QuizMode.LISTENING) {
            const distractors = filteredData
              .filter(k => k.romaji !== correctItem.romaji) // Ensure correct answer isn't in distractors
              .sort(() => 0.5 - Math.random())
              .slice(0, 3);
            
            if (questionType === 'TO_ROMAJI') {
              options = [correctItem.romaji, ...distractors.map(d => d.romaji)];
            } else {
                const prop = targetScript === 'HIRAGANA' ? 'hiragana' : 'katakana';
                options = [correctItem[prop], ...distractors.map(d => d[prop])];
            }
            options.sort(() => 0.5 - Math.random());
        }

        return {
          correct: correctItem,
          options,
          questionType,
          targetScript
        };
      });

      // Limit to 20 questions
      setQuestions(newQuestions.slice(0, 20));
    };

    generateQuestions();
  }, [settings]);

  // Audio Mode Auto-play (LISTENING)
  useEffect(() => {
    if (settings.mode === QuizMode.LISTENING && questions[currentIndex]) {
        const timer = setTimeout(() => {
            playAudio(questions[currentIndex].correct.hiragana);
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [currentIndex, questions, settings.mode, playAudio]);

  // Flashcard Mode Auto-play on Reveal
  useEffect(() => {
    if (settings.mode === QuizMode.FLASHCARD && revealed && questions[currentIndex]) {
        playAudio(questions[currentIndex].correct.hiragana);
    }
  }, [revealed, settings.mode, questions, currentIndex, playAudio]);

  // Canvas Reset Logic
  useEffect(() => {
    if (settings.mode === QuizMode.HANDWRITING && !revealed) {
       clearCanvas();
    }
  }, [currentIndex, revealed, settings.mode]);

  // --- Handlers ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#333';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    e.preventDefault(); 
    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    }
  };

  const handleChoiceAnswer = (answer: string) => {
    if (isAnimating || !questions[currentIndex]) return;
    setIsAnimating(true);

    const currentQ = questions[currentIndex];
    const isCorrect = 
      answer === currentQ.correct.romaji || 
      answer === currentQ.correct.hiragana || 
      answer === currentQ.correct.katakana;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
    } else {
      setWrongAnswers(prev => [...prev, currentQ.correct]);
      
      // [新增] 記錄詳細錯誤資訊 (選擇題)
      // 這裡我們要判斷題目的「正確答案」顯示文字是什麼
      let correctAnswerDisplay = '';
      if (currentQ.questionType === 'TO_ROMAJI') {
        correctAnswerDisplay = currentQ.correct.romaji;
      } else {
        // 如果是選假名，顯示正確的假名
        correctAnswerDisplay = currentQ.targetScript === 'HIRAGANA' 
            ? currentQ.correct.hiragana 
            : currentQ.correct.katakana;
      }

      // 題目的顯示文字 (例如題目是 ぬ，答案是 nu)
      let questionDisplay = '';
      if (settings.mode === QuizMode.LISTENING) {
          questionDisplay = "🔊(聽力)";
      } else if (currentQ.questionType === 'TO_ROMAJI') {
          // 題目是假名
          if (settings.kanaType === KanaType.HIRAGANA) questionDisplay = currentQ.correct.hiragana;
          else if (settings.kanaType === KanaType.KATAKANA) questionDisplay = currentQ.correct.katakana;
          else questionDisplay = `${currentQ.correct.hiragana}/${currentQ.correct.katakana}`;
      } else {
          // 題目是羅馬拼音
          questionDisplay = currentQ.correct.romaji;
      }

      setMistakeDetails(prev => [...prev, {
        id: Date.now(),
        questionContent: questionDisplay,
        userAnswerContent: answer,
        correctAnswerContent: correctAnswerDisplay
      }]);

      setFeedback('wrong');
      if (navigator.vibrate) navigator.vibrate(200);
    }

    setTimeout(() => {
      setFeedback(null);
      setIsAnimating(false);
      nextQuestion();
    }, 600);
  };

  const handleSelfCheckReveal = () => setRevealed(true);

  const handleSelfCheckGrade = (correct: boolean) => {
      const currentQ = questions[currentIndex];
      if (correct) {
          setScore(prev => prev + 1);
          setFeedback('correct');
      } else {
          setWrongAnswers(prev => [...prev, currentQ.correct]);
          
          // [新增] 記錄詳細錯誤資訊 (自我檢測)
          // 因為沒有「選錯的選項」，我們標記為「自我評估錯誤」
          setMistakeDetails(prev => [...prev, {
            id: Date.now(),
            questionContent: currentQ.correct.romaji, // 題目通常是羅馬拼音或假名
            userAnswerContent: "忘記了/寫錯了", 
            correctAnswerContent: `${currentQ.correct.hiragana} / ${currentQ.correct.katakana}`
          }]);

          setFeedback('wrong');
          if (navigator.vibrate) navigator.vibrate(200);
      }
      
      setTimeout(() => {
        setFeedback(null);
        setRevealed(false);
        setHasDrawn(false);
        nextQuestion();
      }, 400);
  };

  const nextQuestion = () => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // [修改] 測驗結束時，將 mistakeDetails 也回傳出去
        onComplete({
          total: questions.length,
          correct: score + (feedback === 'correct' ? 1 : 0),
          wrongItems: feedback === 'correct' ? wrongAnswers : [...wrongAnswers, questions[currentIndex].correct],
          mistakes: mistakeDetails // 回傳詳細錯誤列表
        });
      }
  };

  if (questions.length === 0) return <div className="flex justify-center items-center h-64 text-indigo-500">載入考題中...</div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // --- Display Logic ---
  let displayChar = '';
  let subLabel = '';
  let targetCharForHandwriting = ''; 
  const isListening = settings.mode === QuizMode.LISTENING;

  if (isListening) {
      displayChar = ''; 
      subLabel = '聽音辨字';
  } else if (currentQ.questionType === 'TO_ROMAJI') {
      // Show Kana (FLASHCARD or CHOICE)
      if (settings.kanaType === KanaType.HIRAGANA) displayChar = currentQ.correct.hiragana;
      else if (settings.kanaType === KanaType.KATAKANA) displayChar = currentQ.correct.katakana;
      else {
          displayChar = Math.random() > 0.5 ? currentQ.correct.hiragana : currentQ.correct.katakana;
      }
      
      if (settings.mode === QuizMode.FLASHCARD) {
          subLabel = '請唸出讀音';
      }
  } else {
      // TO_KANA (HANDWRITING or CHOICE or LISTENING)
      displayChar = currentQ.correct.romaji;
      
      if (settings.mode === QuizMode.HANDWRITING) {
         if (currentQ.targetScript === 'HIRAGANA') {
             subLabel = '請寫出：平假名';
             targetCharForHandwriting = currentQ.correct.hiragana;
         } else {
             subLabel = '請寫出：片假名';
             targetCharForHandwriting = currentQ.correct.katakana;
         }
      } else {
          subLabel = '選擇對應的假名';
      }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col h-[85vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1 px-2 py-1 hover:bg-indigo-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="text-sm font-bold">回首頁</span>
        </button>
        <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-bold text-indigo-600">
          {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* Card & Content */}
      <div className="flex-1 flex flex-col items-center">
        
        {/* Main Display Area */}
        <div 
            onClick={() => (isListening || (settings.mode === QuizMode.FLASHCARD && revealed)) && playAudio(currentQ.correct.hiragana)}
            className={`relative w-full bg-white rounded-3xl shadow-xl p-6 text-center mb-6 border border-gray-50 flex flex-col items-center justify-center min-h-[160px] 
            ${(isListening || (settings.mode === QuizMode.FLASHCARD && revealed)) ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
        >
          {feedback === 'correct' && (
            <div className="absolute inset-0 rounded-3xl border-4 border-green-400 animate-pulse z-10 pointer-events-none flex items-center justify-center bg-green-50/20"><span className="text-6xl">⭕</span></div>
          )}
          {feedback === 'wrong' && (
             <div className="absolute inset-0 rounded-3xl border-4 border-red-400 animate-shake z-10 pointer-events-none flex items-center justify-center bg-red-50/20"><span className="text-6xl">❌</span></div>
          )}

          {isListening ? (
              // Audio Mode Display
              <div className="flex flex-col items-center animate-pulse-slow">
                   <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-indigo-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                   </div>
                   <p className="text-sm font-bold text-indigo-400">點擊播放</p>
              </div>
          ) : (
              // Visual Mode Display
              <h2 className="text-7xl font-black text-gray-800 mb-2">{displayChar}</h2>
          )}
          
          {subLabel && <p className="text-gray-400 text-sm font-medium mt-2">{subLabel}</p>}
          
          {/* Answer Reveal (For Flashcard) */}
          {settings.mode === QuizMode.FLASHCARD && revealed && (
              <div className="mt-4 animate-slide-up">
                  <p className="text-3xl font-bold text-indigo-600">{currentQ.correct.romaji}</p>
                  <p className="text-xs text-gray-400 mt-1">
                      {currentQ.correct.hiragana} / {currentQ.correct.katakana}
                  </p>
              </div>
          )}

          {/* Audio Button (Choice Mode Only - TO_ROMAJI) */}
          {!isListening && settings.mode === QuizMode.CHOICE && currentQ.questionType === 'TO_ROMAJI' && (
            <button 
                onClick={(e) => { e.stopPropagation(); playAudio(currentQ.correct.hiragana); }}
                className="mt-2 p-2 text-indigo-400 hover:bg-indigo-50 rounded-full transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
            </button>
          )}
        </div>

        {/* --- CHOICE / LISTENING MODE --- */}
        {(settings.mode === QuizMode.CHOICE || settings.mode === QuizMode.LISTENING) && (
            <div className="grid grid-cols-2 gap-4 w-full">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoiceAnswer(option)}
                  disabled={isAnimating}
                  className={`
                    h-16 rounded-xl font-bold text-2xl shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all
                    ${isAnimating 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                        : 'bg-white text-gray-700 border-indigo-100 hover:border-indigo-300 hover:text-indigo-600'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
        )}

        {/* --- FLASHCARD (SELF-CHECK) MODE --- */}
        {settings.mode === QuizMode.FLASHCARD && (
            <div className="w-full flex-1 flex flex-col justify-end pb-8">
                <div className="h-20 w-full">
                    {!revealed ? (
                        <button
                            onClick={handleSelfCheckReveal}
                            className="w-full h-full bg-indigo-600 text-white text-xl font-bold rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <span>👀</span> 看答案
                        </button>
                    ) : (
                        <div className="flex gap-4 h-full">
                            <button
                                onClick={() => handleSelfCheckGrade(false)}
                                className="flex-1 bg-red-100 text-red-600 text-xl font-bold rounded-xl border border-red-200 hover:bg-red-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                ❌ 唸錯了
                            </button>
                            <button
                                onClick={() => handleSelfCheckGrade(true)}
                                className="flex-1 bg-green-100 text-green-600 text-xl font-bold rounded-xl border border-green-200 hover:bg-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                ⭕ 唸對了
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- HANDWRITING MODE --- */}
        {settings.mode === QuizMode.HANDWRITING && (
            <div className="w-full flex-1 flex flex-col">
                <div className="relative flex-1 bg-white rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden touch-none mb-4">
                    {revealed && (
                        <div className="absolute inset-0 z-0 flex items-center justify-center bg-white/10 pointer-events-none">
                            <span className="text-9xl text-gray-200 font-black select-none opacity-50">
                                {targetCharForHandwriting}
                            </span>
                        </div>
                    )}
                    
                    <canvas
                        ref={canvasRef}
                        width={350}
                        height={350}
                        className="w-full h-full relative z-10 cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />

                    {!revealed && hasDrawn && (
                        <button 
                            onClick={clearCanvas}
                            className="absolute top-2 right-2 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 z-20"
                            title="清除"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="h-16">
                    {!revealed ? (
                        <button
                            onClick={handleSelfCheckReveal}
                            className="w-full h-full bg-indigo-600 text-white text-xl font-bold rounded-xl shadow-md active:scale-95 transition-transform"
                        >
                            看答案
                        </button>
                    ) : (
                        <div className="flex gap-4 h-full">
                            <button
                                onClick={() => handleSelfCheckGrade(false)}
                                className="flex-1 bg-red-100 text-red-600 text-xl font-bold rounded-xl border border-red-200 hover:bg-red-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                ❌ 記錯了
                            </button>
                            <button
                                onClick={() => handleSelfCheckGrade(true)}
                                className="flex-1 bg-green-100 text-green-600 text-xl font-bold rounded-xl border border-green-200 hover:bg-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                ⭕ 答對了
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizBoard;

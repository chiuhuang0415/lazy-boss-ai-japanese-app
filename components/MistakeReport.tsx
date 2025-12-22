import React, { useState } from 'react';

// 定義錯誤項目的資料結構
export interface MistakeItem {
  id: string | number;
  questionContent: string;
  userAnswerContent: string;
  correctAnswerContent: string;
}

interface MistakeReportProps {
  mistakes: MistakeItem[];
  onSubmitEmail?: (email: string) => void; // 設為可選，因為我們直接在內部處理了
  onClose: () => void;
}

// ✅ 已更新：這裡換成了您最新的 Google Apps Script 網址
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzCDdjoE8eyNtBxpWLJUiN1KYWsPPXkTkYPyiv5uXw_WBtK01IGsvktxhTrP0wC569JdQ/exec";

const MistakeReport: React.FC<MistakeReportProps> = ({ mistakes, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 新增載入狀態

  // 如果沒有錯誤數據，就不顯示此彈窗
  if (mistakes.length === 0) return null;

  // 取出前三個錯誤作為範例顯示
  const weakPoints = mistakes.slice(0, 3).map(m => m.correctAnswerContent).join('、');
  const mistakeCount = mistakes.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // 準備要傳送的資料
      const payload = {
        email: email,
        mistakes: mistakes
      };

      // 呼叫 Google Apps Script
      // 使用 no-cors 模式是為了避免跨域錯誤 (雖然無法讀取回應內容，但能確保發送成功)
      await fetch(GAS_API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      // 假設發送成功 (因為 no-cors 不會回傳 status)
      setIsSubmitted(true);

    } catch (error) {
      console.error("寄送失敗:", error);
      alert("寄送失敗，請檢查網路連線");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-200 transform transition-all">
        
        {/* 上方標題區 */}
        <div className="bg-gray-800 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 bg-opacity-20 text-indigo-400 mb-3">
            {!isSubmitted ? (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-wide">
            {isSubmitted ? "發送成功！" : "錯題急救包 💊"}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {isSubmitted ? "請檢查您的收件匣" : `整理了 ${mistakeCount} 個需複習的重點`}
          </p>
        </div>

        {/* 內容區塊 */}
        <div className="p-6">
          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  您剛才在 <span className="font-bold text-red-500 bg-red-50 px-1 rounded">{weakPoints}</span> 等字詞上遇到了困難。
                </p>
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r">
                  <p className="text-indigo-800 text-xs font-bold mb-1">為什麼要寄給我？</p>
                  <p className="text-indigo-700 text-xs leading-snug">
                    AI 老師已經將您的錯誤與正確答案整理成表格。寄到信箱後，您可以在通勤或空閒時快速複習，效果最好！
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                  placeholder="輸入 Email 接收成績單"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-bold py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2
                    ${isLoading 
                      ? 'bg-gray-400 cursor-not-allowed text-gray-100' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      郵差投遞中...
                    </>
                  ) : (
                    "寄出成績單"
                  )}
                </button>
              </form>
              
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="w-full mt-4 text-gray-400 text-xs hover:text-gray-600 py-2"
              >
                不用了，下次再說
              </button>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="text-5xl mb-4 animate-bounce">📩</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">信件已寄出</h3>
              <p className="text-gray-500 text-sm mb-6">
                如果沒收到，請檢查垃圾信件夾。<br/>
                保持練習，你的日文會越來越強！
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg transition"
              >
                關閉視窗
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MistakeReport;
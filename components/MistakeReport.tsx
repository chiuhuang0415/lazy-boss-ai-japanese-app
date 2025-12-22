import React, { useState } from 'react';

// 定義錯誤項目的資料結構
// (之後我們會移到 types.ts 統一管理，目前先寫在這裡方便您直接使用)
export interface MistakeItem {
  id: string | number;
  questionContent: string;
  userAnswerContent: string;
  correctAnswerContent: string;
}

interface MistakeReportProps {
  mistakes: MistakeItem[];
  onSubmitEmail: (email: string) => void;
  onClose: () => void;
}

const MistakeReport: React.FC<MistakeReportProps> = ({ mistakes, onSubmitEmail, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 如果沒有錯誤數據，就不顯示此彈窗
  if (mistakes.length === 0) return null;

  // 取出前三個錯誤作為範例顯示
  const weakPoints = mistakes.slice(0, 3).map(m => m.correctAnswerContent).join('、');
  const mistakeCount = mistakes.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmitEmail(email);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-200">
        
        {/* 上方標題區：強調「數據價值」與「未保存的風險」 */}
        <div className="bg-gray-800 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 bg-opacity-20 text-yellow-400 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-wide">
            分析結果未保存
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            偵測到 {mistakeCount} 個高風險錯誤
          </p>
        </div>

        {/* 內容區塊 */}
        <div className="p-6">
          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  系統發現你對 <span className="font-bold text-red-500 bg-red-50 px-1 rounded">{weakPoints}</span> 等字詞的辨識權重較低。
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r">
                  <p className="text-blue-800 text-xs font-bold mb-1">為什麼要保存？</p>
                  <p className="text-blue-700 text-xs leading-snug">
                    若不保存，此數據將會遺失。綁定 Email 後，演算法會記住這些弱點，並在下次測驗中<strong>自動提高出現頻率</strong>，直到你完全學會。
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                  placeholder="輸入 Email 同步學習數據"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md"
                >
                  雲端儲存我的弱點庫
                </button>
              </form>
              
              <button 
                onClick={onClose}
                className="w-full mt-4 text-gray-400 text-xs hover:text-gray-600 py-2"
              >
                不保存，清除本次分析數據
              </button>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="text-5xl mb-4 animate-bounce">💾</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">數據已同步！</h3>
              <p className="text-gray-500 text-sm mb-6">
                你的弱點庫已更新。<br/>
                系統將會在接下來的 24 小時內，<br/>優先針對這些字詞進行複習演算。
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg transition"
              >
                好的，開始新測驗
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MistakeReport;

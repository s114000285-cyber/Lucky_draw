
import React, { useState, useEffect, useRef } from 'react';
import { Employee } from '../types';

interface LuckyDrawProps {
  employees: Employee[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ employees }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<Employee | null>(null);
  const [currentName, setCurrentName] = useState<string>('???');
  const [history, setHistory] = useState<Employee[]>([]);
  const [availableList, setAvailableList] = useState<Employee[]>([]);

  const rollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setAvailableList([...employees]);
  }, [employees]);

  const startDraw = () => {
    if (availableList.length === 0 && !allowRepeat) {
      alert('所有名單都已抽出！');
      return;
    }

    setRolling(true);
    setWinner(null);

    const source = allowRepeat ? employees : availableList;
    
    let iterations = 0;
    const maxIterations = 30;
    
    rollIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * source.length);
      setCurrentName(source[randomIndex].name);
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(rollIntervalRef.current!);
        const finalWinner = source[Math.floor(Math.random() * source.length)];
        setWinner(finalWinner);
        setCurrentName(finalWinner.name);
        setRolling(false);
        
        setHistory(prev => [finalWinner, ...prev].slice(0, 10));
        
        if (!allowRepeat) {
          setAvailableList(prev => prev.filter(e => e.id !== finalWinner.id));
        }
      }
    }, 100);
  };

  const resetPool = () => {
    if (window.confirm('確定要重置抽籤池嗎？')) {
      setAvailableList([...employees]);
      setHistory([]);
      setWinner(null);
      setCurrentName('???');
    }
  };

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>目前名單為空。請先在「名單登錄」標籤中加入姓名。</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col h-full gap-8">
      <div className="flex flex-col md:flex-row gap-8 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12 border-2 border-gray-50 rounded-3xl relative overflow-hidden bg-white">
          <div className="absolute top-4 left-4 flex items-center gap-4">
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setAllowRepeat(!allowRepeat)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${allowRepeat ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowRepeat ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-tighter flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重複抽取
                </span>
             </div>
             <button 
                onClick={resetPool}
                className="text-xs text-gray-400 hover:text-black border-b border-transparent hover:border-black transition-all flex items-center gap-1"
             >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                重置名單
             </button>
          </div>

          <div className="text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
              </svg>
              幸運中獎者
            </span>
            <div className={`text-6xl md:text-8xl font-black transition-all duration-300 ${rolling ? 'scale-110 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>
              {currentName}
            </div>
            {winner && !rolling && (
               <div className="mt-4 inline-block px-4 py-1 bg-black text-white text-xs font-bold rounded-full animate-bounce">
                 恭喜中獎！
               </div>
            )}
          </div>

          <button
            onClick={startDraw}
            disabled={rolling}
            className={`px-12 py-5 rounded-full font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center gap-3 ${
              rolling 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-2xl'
            }`}
          >
            {rolling ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                抽取中...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                開始抽籤
              </>
            )}
          </button>

          <div className="text-gray-400 text-xs mt-4 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {allowRepeat ? '所有人皆可重複中獎' : `剩餘 ${availableList.length} / ${employees.length} 位待抽取`}
          </div>
        </div>

        <div className="w-full md:w-64 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-gray-100 pb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            中獎紀錄
          </h3>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
            {history.length === 0 ? (
                <div className="text-xs text-gray-300 italic">尚未有中獎者。</div>
            ) : (
                history.map((h, i) => (
                    <div key={`${h.id}-${i}`} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3 group animate-in slide-in-from-right">
                        <span className="text-xs font-bold text-gray-300">#{history.length - i}</span>
                        <div className="flex-1">
                            <div className="text-sm font-semibold">{h.name}</div>
                            <div className="text-[10px] text-gray-400">中獎者</div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;

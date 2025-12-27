
import React, { useState, useEffect, useMemo } from 'react';
import { Employee } from '../types';

interface ListInputProps {
  employees: Employee[];
  onUpdate: (newList: Employee[]) => void;
}

const ListInput: React.FC<ListInputProps> = ({ employees, onUpdate }) => {
  const [rawText, setRawText] = useState('');

  useEffect(() => {
    if (employees.length > 0 && rawText === '') {
      setRawText(employees.map(e => e.name).join('\n'));
    }
  }, [employees, rawText]);

  // Identify duplicates by name
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    employees.forEach(e => counts.set(e.name, (counts.get(e.name) || 0) + 1));
    return new Set([...counts.entries()].filter(([_, count]) => count > 1).map(([name]) => name));
  }, [employees]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRawText(text);
    const names = text.split('\n').map(n => n.trim()).filter(n => n !== '');
    const newList = names.map((name, index) => ({ id: `${index}-${name}-${Math.random()}`, name }));
    onUpdate(newList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const names = content.split('\n')
        .map(line => line.split(',')[0].replace(/"/g, '').trim())
        .filter(name => name !== '' && name.toLowerCase() !== 'name');
      
      const newList = names.map((name, index) => ({ id: `${Date.now()}-${index}-${name}`, name }));
      onUpdate(newList);
      setRawText(names.join('\n'));
    };
    reader.readAsText(file);
  };

  const clearList = () => {
    if (window.confirm('確定要清除所有名單嗎？')) {
      onUpdate([]);
      setRawText('');
    }
  };

  const removeDuplicates = () => {
    const uniqueNames = Array.from(new Set(employees.map(e => e.name)));
    const newList = uniqueNames.map((name, index) => ({ id: `unique-${index}-${name}`, name }));
    onUpdate(newList);
    setRawText(uniqueNames.join('\n'));
  };

  const loadMockData = () => {
    const mockNames = [
      '陳大文', '林小明', '王美麗', '張志豪', '李佳佳', 
      '劉一龍', '黃曉彤', '周杰西', '吳佩珊', '趙子龍',
      '林小明', '陳大文', '孫悟空', '豬八戒', '沙悟淨'
    ];
    setRawText(mockNames.join('\n'));
    const newList = mockNames.map((name, index) => ({ id: `mock-${index}-${name}-${Math.random()}`, name }));
    onUpdate(newList);
  };

  return (
    <div className="p-8 flex flex-col h-full gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              人員名單來源
            </h2>
            <div className="flex gap-4">
              <button 
                onClick={loadMockData}
                className="text-xs text-blue-500 hover:text-blue-700 transition-colors uppercase tracking-widest font-semibold"
              >
                載入範例
              </button>
              <button 
                onClick={clearList}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest font-semibold"
              >
                全部清除
              </button>
            </div>
          </div>
          
          <div className="relative group">
            <textarea
              className="w-full h-80 p-4 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-black transition-all resize-none font-mono text-sm leading-relaxed outline-none scrollbar-hide"
              placeholder="在此貼上姓名（每行一個）..."
              value={rawText}
              onChange={handleTextChange}
            />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl"></div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              從 CSV 匯入
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">點擊上傳</span> 或拖放檔案</p>
                  <p className="text-xs text-gray-400">支援 CSV 格式（姓名請放在第一欄）</p>
                </div>
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-l border-gray-100 pl-0 md:pl-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              名單統計
            </h2>
            {duplicateNames.size > 0 && (
              <button 
                onClick={removeDuplicates}
                className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 hover:bg-red-100 transition-colors font-bold"
              >
                移除重複姓名 ({duplicateNames.size} 種)
              </button>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-end gap-3 mb-1">
              <div className="text-4xl font-bold text-black">{employees.length}</div>
              {duplicateNames.size > 0 && (
                <span className="text-xs text-red-500 font-bold mb-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  發現重複
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              已登錄人數
            </div>
            <div className="mt-4 flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-hide">
              {employees.slice(0, 100).map((e) => (
                <span 
                  key={e.id} 
                  className={`px-2 py-1 bg-white border rounded text-xs transition-colors ${
                    duplicateNames.has(e.name) 
                      ? 'border-red-300 bg-red-50 text-red-600' 
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {e.name}
                </span>
              ))}
              {employees.length > 100 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  + 還有 {employees.length - 100} 位...
                </span>
              )}
            </div>
          </div>

          <div className="bg-black text-white rounded-xl p-6 flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                準備好開始活動了嗎？
              </h3>
              <p className="text-xs text-gray-400">人員名單已同步，您可以前往抽籤或分組功能。</p>
            </div>
            <svg className="w-12 h-12 text-gray-800 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListInput;

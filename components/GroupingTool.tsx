
import React, { useState } from 'react';
import { Employee, Group } from '../types';
import { generateTeamNamesAndMottos } from '../services/geminiService';

interface GroupingToolProps {
  employees: Employee[];
}

const GroupingTool: React.FC<GroupingToolProps> = ({ employees }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const performGrouping = async () => {
    if (employees.length === 0) return;
    setIsGenerating(true);

    const shuffled = [...employees].sort(() => Math.random() - 0.5);
    const numGroups = Math.ceil(shuffled.length / groupSize);

    const aiMetaData = await generateTeamNamesAndMottos(numGroups);

    const newGroups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: aiMetaData[i]?.name || `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize),
        motto: aiMetaData[i]?.motto || '齊心協力，共創佳績。'
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
    csvContent += "組名,座右銘,成員姓名\n";
    
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${group.motto}","${member.name}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p>請先登錄人員名單再進行分組。</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col h-full gap-8">
      <div className="flex flex-col md:flex-row items-end gap-6 pb-6 border-b border-gray-100">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            每組人數上限
          </label>
          <div className="flex items-center gap-4">
             <input 
                type="range" 
                min="2" 
                max="20" 
                step="1"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
             />
             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-lg">
                {groupSize}
             </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          {groups.length > 0 && (
            <button
              onClick={downloadCSV}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下載紀錄 (CSV)
            </button>
          )}
          <button
            onClick={performGrouping}
            disabled={isGenerating}
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center gap-2 disabled:bg-gray-300"
          >
            {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 智能分組中...
                </>
            ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.321a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 001.414 3.414h15.428a2 2 0 001.414-3.414l-1.168-1.168z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  生成創意分組
                </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px] scrollbar-hide pb-8">
        {groups.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <p className="text-gray-400 font-medium">準備好分組了嗎？設定人數後點擊生成。</p>
          </div>
        ) : (
          groups.map((group) => (
            <div 
                key={group.id} 
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 animate-in fade-in zoom-in duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="pr-4">
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {group.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 italic">「{group.motto}」</p>
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black uppercase text-gray-500 whitespace-nowrap flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {group.members.length} 人
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {group.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-xs font-semibold text-gray-700">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupingTool;

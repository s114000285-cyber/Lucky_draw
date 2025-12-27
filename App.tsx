
import React, { useState, useCallback } from 'react';
import { TabType, Employee } from './types';
import Header from './components/Header';
import ListInput from './components/ListInput';
import LuckyDraw from './components/LuckyDraw';
import GroupingTool from './components/GroupingTool';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  const handleUpdateList = useCallback((newList: Employee[]) => {
    setEmployeeList(newList);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <ListInput employees={employeeList} onUpdate={handleUpdateList} />;
      case 'lottery':
        return <LuckyDraw employees={employeeList} />;
      case 'grouping':
        return <GroupingTool employees={employeeList} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
          {renderContent()}
        </div>
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
        &copy; {new Date().getFullYear()} ZenHR Solutions. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;

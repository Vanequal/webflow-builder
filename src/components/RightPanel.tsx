import React, { useState } from 'react';
import { Settings, Database, FileText } from 'lucide-react';
import PropertiesPanel from './PropertiesPanel';
import MemoryPanel from './MemoryPanel';
import LogsPanel from './LogsPanel';

type Tab = 'properties' | 'memory' | 'logs';

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('properties');

  const tabs = [
    { id: 'properties' as Tab, label: 'Properties', icon: Settings },
    { id: 'memory' as Tab, label: 'Memory', icon: Database },
    { id: 'logs' as Tab, label: 'Logs', icon: FileText },
  ];

  return (
    <div className="w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-semibold
                transition-all duration-200
                ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'properties' && <PropertiesPanel />}
        {activeTab === 'memory' && <MemoryPanel />}
        {activeTab === 'logs' && <LogsPanel />}
      </div>
    </div>
  );
};

export default RightPanel;

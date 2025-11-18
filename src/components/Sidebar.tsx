import React from 'react';
import { Brain, Wrench, Database, Plus } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { addNode } from '../store/workflowSlice';
import { AgentType } from '../types';

const agentTypes: { type: AgentType; label: string; icon: any; gradient: string }[] = [
  { 
    type: 'llm', 
    label: 'LLM Agent', 
    icon: Brain,
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    type: 'tool', 
    label: 'Tool Agent', 
    icon: Wrench,
    gradient: 'from-green-500 to-green-600'
  },
  { 
    type: 'memory', 
    label: 'Memory', 
    icon: Database,
    gradient: 'from-purple-500 to-purple-600'
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleAddNode = (type: AgentType, label: string) => {
    const id = `${type}-${Date.now()}`;
    const newNode = {
      id,
      type: 'agent',
      position: { 
        x: Math.random() * 600 + 100, 
        y: Math.random() * 400 + 100 
      },
      data: {
        label,
        config: {
          name: `${label} ${Date.now() % 100}`,
          prompt: '',
          agentType: type,
        },
      },
    };
    dispatch(addNode(newNode));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-lg font-bold text-gray-800">Agent Blocks</h2>
        <p className="text-xs text-gray-600">Click to add</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {agentTypes.map((agent) => {
          const Icon = agent.icon;
          return (
            <button
              key={agent.type}
              onClick={() => handleAddNode(agent.type, agent.label)}
              className={`
                w-full p-3 rounded-lg shadow-md
                bg-gradient-to-br ${agent.gradient}
                text-white font-semibold text-sm
                transition-all duration-200
                hover:scale-105 hover:shadow-xl
                active:scale-95
                flex items-center gap-2
                group
              `}
            >
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 text-left">{agent.label}</span>
              <Plus className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="flex items-center gap-2">
            <Brain className="w-3 h-3" /> 
            <span>LLM: AI processing</span>
          </p>
          <p className="flex items-center gap-2">
            <Wrench className="w-3 h-3" /> 
            <span>Tool: External actions</span>
          </p>
          <p className="flex items-center gap-2">
            <Database className="w-3 h-3" /> 
            <span>Memory: Store context</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

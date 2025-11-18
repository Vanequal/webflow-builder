import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Brain, Wrench, Database } from 'lucide-react';
import { AgentType } from '../types';

const getIcon = (type: AgentType) => {
  switch (type) {
    case 'llm':
      return Brain;
    case 'tool':
      return Wrench;
    case 'memory':
      return Database;
  }
};

const getGradient = (type: AgentType) => {
  switch (type) {
    case 'llm':
      return 'from-blue-500 to-blue-600';
    case 'tool':
      return 'from-green-500 to-green-600';
    case 'memory':
      return 'from-purple-500 to-purple-600';
  }
};

const AgentNode: React.FC<NodeProps> = ({ data, selected }) => {
  const Icon = getIcon(data.config.agentType);
  const gradient = getGradient(data.config.agentType);
  const isExecuting = data.isExecuting;

  return (
    <div
      className={`
        relative px-4 py-3 rounded-xl shadow-lg border-2 border-white/20
        bg-gradient-to-br ${gradient}
        transition-all duration-300 min-w-[180px]
        ${selected ? 'ring-4 ring-indigo-400 ring-opacity-50 scale-105' : ''}
        ${isExecuting ? 'animate-pulse ring-4 ring-yellow-400' : ''}
        hover:shadow-2xl hover:scale-105
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-white border-2 !border-current"
      />

      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">
            {data.config.name || 'Unnamed Agent'}
          </div>
          <div className="text-white/70 text-xs capitalize">
            {data.config.agentType} Agent
          </div>
        </div>
      </div>

      {isExecuting && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-white border-2 !border-current"
      />
    </div>
  );
};

export default AgentNode;

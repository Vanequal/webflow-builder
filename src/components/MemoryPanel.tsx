import React from 'react';
import { useAppSelector } from '../store/hooks';

const MemoryPanel: React.FC = () => {
  const memory = useAppSelector((state) => state.workflow.execution.memory);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 bg-gray-900">
        <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">
          {JSON.stringify(memory, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default MemoryPanel;

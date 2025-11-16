import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';

const ContextViewer: React.FC = () => {
  const context = useAppSelector((state) => state.workflow.execution.context);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div
        className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 flex items-center justify-between cursor-pointer hover:from-slate-600 hover:to-slate-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
          <span>📊</span>
          <span>Контекст JSON</span>
        </h3>
        <button className="text-white text-lg transform transition-transform">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 bg-gray-900 max-h-48 overflow-auto">
          <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">
            {Object.keys(context).length > 0
              ? JSON.stringify(context, null, 2)
              : '{\n  // Контекст пуст\n}'}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ContextViewer;

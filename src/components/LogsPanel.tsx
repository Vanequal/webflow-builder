import React, { useRef, useEffect } from 'react';
import { FileText, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearLogs } from '../store/workflowSlice';

const LogsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.workflow.logs);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Total: {logs.length}</span>
        </div>
        <button
          onClick={() => dispatch(clearLogs())}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FileText className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No logs yet</p>
          </div>
        ) : (
          <>
            {logs.map((log) => (
              <div
                key={log.id}
                className={`border rounded-lg p-3 ${getStatusColor(log.status)} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {log.agentName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 capitalize mb-1">
                      {log.agentType} Agent
                    </div>
                  </div>
                </div>

                {log.input && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Input:</div>
                    <div className="text-xs text-gray-700 bg-white/50 rounded p-2 break-words">
                      {log.input}
                    </div>
                  </div>
                )}

                {log.output && (
                  <div>
                    <div className="text-xs font-semibold text-gray-600 mb-1">Output:</div>
                    <div className="text-xs text-gray-700 bg-white/50 rounded p-2 break-words">
                      {log.output}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default LogsPanel;

import React, { useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearLogs } from '../store/workflowSlice';

const LogsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.workflow.logs);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-3 py-2 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
          <span>📝</span>
          <span>Логи</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{logs.length}</span>
        </h3>
        <button
          onClick={() => dispatch(clearLogs())}
          className="bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          Очистить
        </button>
      </div>

      <div className="h-64 overflow-y-auto bg-gray-50 p-2 space-y-1.5">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">Журнал пуст</p>
          </div>
        ) : (
          <>
            {logs.map((log) => (
              <div
                key={log.id}
                className={`border rounded p-2 ${getLogColor(log.type)} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">{getLogIcon(log.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium break-words">{log.message}</p>
                    <p className="text-xs opacity-70 mt-0.5">{formatTime(log.timestamp)}</p>
                  </div>
                </div>
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

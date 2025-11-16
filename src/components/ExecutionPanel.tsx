import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { startExecution, executeStep, stopExecution } from '../store/workflowSlice';
import { mockAPI } from '../utils/mockAPI';

const ExecutionPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.workflow.elements);
  const execution = useAppSelector((state) => state.workflow.execution);

  const handleStart = () => {
    dispatch(startExecution());
  };

  const handleNextStep = async () => {
    if (execution.currentStep >= elements.length) {
      dispatch(stopExecution());
      return;
    }

    const element = elements[execution.currentStep];
    
    try {
      const result = await mockAPI.executeStep(element, execution.context);
      dispatch(executeStep({ elementId: element.id, result }));

      if (execution.currentStep + 1 >= elements.length) {
        setTimeout(() => {
          dispatch(stopExecution());
        }, 500);
      }
    } catch (error) {
      console.error('Ошибка выполнения шага:', error);
    }
  };

  const handleStop = () => {
    dispatch(stopExecution());
  };

  const handleAutoRun = async () => {
    dispatch(startExecution());
    
    for (let i = 0; i < elements.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const element = elements[i];
      const result = await mockAPI.executeStep(element, execution.context);
      dispatch(executeStep({ elementId: element.id, result }));
    }
    
    setTimeout(() => {
      dispatch(stopExecution());
    }, 500);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Выполнение сценария</h2>
          {execution.isRunning && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Запущено</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!execution.isRunning ? (
            <>
              <button
                onClick={handleStart}
                disabled={elements.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md flex items-center gap-2"
              >
                <span>▶</span>
                <span>Запустить</span>
              </button>
              <button
                onClick={handleAutoRun}
                disabled={elements.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md flex items-center gap-2"
              >
                <span>⏩</span>
                <span>Авто-запуск</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleNextStep}
                disabled={execution.currentStep >= elements.length}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md flex items-center gap-2"
              >
                <span>→</span>
                <span>Следующий шаг</span>
              </button>
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md flex items-center gap-2"
              >
                <span>■</span>
                <span>Остановить</span>
              </button>
            </>
          )}
        </div>
      </div>

      {execution.totalSteps > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Прогресс</span>
            <span className="font-semibold">
              {execution.currentStep} / {execution.totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${(execution.currentStep / execution.totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionPanel;

import React from 'react';
import { Play, StepForward, Square, RotateCcw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { startExecution, executeStep, stopExecution, resetExecution } from '../store/workflowSlice';
import { mockExecuteAgent } from '../utils/mockExecution';

const ExecutionControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const execution = useAppSelector((state) => state.workflow.execution);

  const handleRun = async () => {
    if (nodes.length === 0) return;

    dispatch(startExecution());

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const result = await mockExecuteAgent(
        node.data.config.agentType,
        node.data.config.name,
        node.data.config.prompt
      );
      
      dispatch(executeStep({ nodeId: node.id, result }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    dispatch(stopExecution());
  };

  const handleStep = async () => {
    if (!execution.isRunning) {
      dispatch(startExecution());
    }

    if (execution.currentStep < nodes.length) {
      const node = nodes[execution.currentStep];
      const result = await mockExecuteAgent(
        node.data.config.agentType,
        node.data.config.name,
        node.data.config.prompt
      );
      
      dispatch(executeStep({ nodeId: node.id, result }));

      if (execution.currentStep + 1 >= nodes.length) {
        setTimeout(() => dispatch(stopExecution()), 500);
      }
    }
  };

  const handleStop = () => {
    dispatch(stopExecution());
  };

  const handleReset = () => {
    dispatch(resetExecution());
  };

  const progress = execution.totalSteps > 0 
    ? (execution.currentStep / execution.totalSteps) * 100 
    : 0;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Execution:</span>
            {execution.isRunning && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Running
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600">
            Step <span className="font-semibold">{execution.currentStep}</span> / <span className="font-semibold">{execution.totalSteps || nodes.length}</span>
          </div>

          {execution.totalSteps > 0 && (
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={execution.isRunning || nodes.length === 0}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
          >
            <Play className="w-4 h-4" />
            Run
          </button>

          <button
            onClick={handleStep}
            disabled={execution.currentStep >= nodes.length && execution.isRunning}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
          >
            <StepForward className="w-4 h-4" />
            Step
          </button>

          {execution.isRunning && (
            <button
              onClick={handleStop}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={execution.isRunning}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionControls;

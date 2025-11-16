import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import ExecutionPanel from './components/ExecutionPanel';
import ContextViewer from './components/ContextViewer';
import LogsPanel from './components/LogsPanel';
import FileManager from './components/FileManager';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 shadow-lg">
        <h1 className="text-xl font-bold">🔧 Workflow Builder MVP</h1>
      </header>

      {/* File Manager */}
      <FileManager />

      {/* Toolbar */}
      <Toolbar />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Canvas + Execution */}
        <div className="flex-1 flex flex-col min-w-0">
          <ExecutionPanel />
          <Canvas />
        </div>

        {/* Right: Properties + Context + Logs */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <PropertiesPanel />
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            <ContextViewer />
            <LogsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

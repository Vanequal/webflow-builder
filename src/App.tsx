import React from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import ExecutionControls from './components/ExecutionControls';

const App: React.FC = () => {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#f3f4f6'
    }}>
      <TopBar />
      <ExecutionControls />
      
      <div style={{ 
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0
      }}>
        <Sidebar />
        <Canvas />
        <RightPanel />
      </div>
    </div>
  );
};

export default App;
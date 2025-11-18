import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowState, WorkflowNode, LogEntry } from '../types';
import { Edge, addEdge, Connection } from 'reactflow';

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  logs: [],
  execution: {
    isRunning: false,
    isPaused: false,
    currentNodeId: null,
    currentStep: 0,
    totalSteps: 0,
    memory: { memory: [] },
  },
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<WorkflowNode>) => {
      state.nodes.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(n => n.id !== action.payload);
      state.edges = state.edges.filter(e => e.source !== action.payload && e.target !== action.payload);
      if (state.selectedNodeId === action.payload) {
        state.selectedNodeId = null;
      }
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.data = { ...node.data, ...action.payload.data };
      }
    },
    connectNodes: (state, action: PayloadAction<Connection>) => {
      const newEdge = {
        id: `${action.payload.source}-${action.payload.target}`,
        source: action.payload.source!,
        target: action.payload.target!,
        type: 'smoothstep',
        animated: true,
      };
      state.edges = addEdge(newEdge, state.edges);
    },
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    addLog: (state, action: PayloadAction<Omit<LogEntry, 'id' | 'timestamp'>>) => {
      state.logs.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      });
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    startExecution: (state) => {
      state.execution.isRunning = true;
      state.execution.isPaused = false;
      state.execution.currentStep = 0;
      state.execution.totalSteps = state.nodes.length;
      state.execution.currentNodeId = null;
      state.execution.memory = { memory: [] };
      state.logs = [];
      state.logs.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        agentName: 'System',
        agentType: 'llm',
        input: '',
        output: 'Workflow execution started',
        status: 'success',
      });
    },
    executeStep: (state, action: PayloadAction<{ nodeId: string; result: any }>) => {
      state.execution.currentStep += 1;
      state.execution.currentNodeId = action.payload.nodeId;
      
      const node = state.nodes.find(n => n.id === action.payload.nodeId);
      if (node) {
        // Update memory
        state.execution.memory.memory.push({
          agent: node.data.config.name,
          type: node.data.config.agentType,
          result: action.payload.result,
          timestamp: new Date().toISOString(),
        });

        // Add log
        state.logs.push({
          id: Date.now().toString(),
          timestamp: Date.now(),
          agentName: node.data.config.name,
          agentType: node.data.config.agentType,
          input: node.data.config.prompt || 'No input',
          output: action.payload.result,
          status: 'success',
        });
      }
    },
    pauseExecution: (state) => {
      state.execution.isPaused = true;
    },
    resumeExecution: (state) => {
      state.execution.isPaused = false;
    },
    stopExecution: (state) => {
      state.execution.isRunning = false;
      state.execution.isPaused = false;
      state.execution.currentNodeId = null;
      state.logs.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        agentName: 'System',
        agentType: 'llm',
        input: '',
        output: 'Workflow execution completed',
        status: 'success',
      });
    },
    resetExecution: (state) => {
      state.execution = {
        isRunning: false,
        isPaused: false,
        currentNodeId: null,
        currentStep: 0,
        totalSteps: 0,
        memory: { memory: [] },
      };
      state.logs = [];
    },
    clearWorkflow: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodeId = null;
      state.execution = initialState.execution;
      state.logs = [];
    },
  },
});

export const {
  setNodes,
  setEdges,
  addNode,
  removeNode,
  updateNode,
  connectNodes,
  selectNode,
  addLog,
  clearLogs,
  startExecution,
  executeStep,
  pauseExecution,
  resumeExecution,
  stopExecution,
  resetExecution,
  clearWorkflow,
} = workflowSlice.actions;

export default workflowSlice.reducer;

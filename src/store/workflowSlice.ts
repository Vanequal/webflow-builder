import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowState, WorkflowElement, LogEntry } from '../types';

const initialState: WorkflowState = {
  elements: [],
  selectedElementId: null,
  logs: [],
  execution: {
    isRunning: false,
    currentStep: 0,
    totalSteps: 0,
    context: {},
  },
  canvas: {
    zoom: 1,
    pan: { x: 0, y: 0 },
  },
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<WorkflowElement>) => {
      state.elements.push(action.payload);
      state.logs.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: `Добавлен элемент: ${action.payload.label}`,
        type: 'info',
        elementId: action.payload.id,
      });
    },
    removeElement: (state, action: PayloadAction<string>) => {
      const element = state.elements.find(el => el.id === action.payload);
      state.elements = state.elements.filter(el => el.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
      if (element) {
        state.logs.push({
          id: Date.now().toString(),
          timestamp: Date.now(),
          message: `Удален элемент: ${element.label}`,
          type: 'warning',
        });
      }
    },
    updateElement: (state, action: PayloadAction<{ id: string; updates: Partial<WorkflowElement> }>) => {
      const element = state.elements.find(el => el.id === action.payload.id);
      if (element) {
        Object.assign(element, action.payload.updates);
      }
    },
    moveElement: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const element = state.elements.find(el => el.id === action.payload.id);
      if (element) {
        element.x = action.payload.x;
        element.y = action.payload.y;
      }
    },
    selectElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElementId = action.payload;
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
      state.execution.currentStep = 0;
      state.execution.totalSteps = state.elements.length;
      state.execution.context = {};
      state.logs.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: '🚀 Запуск сценария...',
        type: 'info',
      });
    },
    executeStep: (state, action: PayloadAction<{ elementId: string; result: any }>) => {
      state.execution.currentStep += 1;
      const element = state.elements.find(el => el.id === action.payload.elementId);
      
      if (element) {
        state.execution.context[element.id] = action.payload.result;
        state.logs.push({
          id: Date.now().toString(),
          timestamp: Date.now(),
          message: `✓ Выполнен шаг ${state.execution.currentStep}/${state.execution.totalSteps}: ${element.label}`,
          type: 'success',
          elementId: element.id,
        });
      }
    },
    stopExecution: (state) => {
      state.execution.isRunning = false;
      state.logs.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: state.execution.currentStep === state.execution.totalSteps 
          ? '✅ Сценарий завершен успешно!' 
          : '⏸️ Выполнение остановлено',
        type: state.execution.currentStep === state.execution.totalSteps ? 'success' : 'warning',
      });
    },
    updateContext: (state, action: PayloadAction<Record<string, any>>) => {
      state.execution.context = { ...state.execution.context, ...action.payload };
    },
    loadWorkflow: (state, action: PayloadAction<WorkflowElement[]>) => {
      state.elements = action.payload;
      state.selectedElementId = null;
      state.logs.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: `📂 Загружена схема с ${action.payload.length} элементами`,
        type: 'info',
      });
    },
    clearWorkflow: (state) => {
      state.elements = [];
      state.selectedElementId = null;
      state.execution = initialState.execution;
      state.logs.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: '🗑️ Схема очищена',
        type: 'warning',
      });
    },
  },
});

export const {
  addElement,
  removeElement,
  updateElement,
  moveElement,
  selectElement,
  addLog,
  clearLogs,
  startExecution,
  executeStep,
  stopExecution,
  updateContext,
  loadWorkflow,
  clearWorkflow,
} = workflowSlice.actions;

export default workflowSlice.reducer;

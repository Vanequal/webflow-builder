export type ElementType = 'action' | 'condition' | 'loop' | 'api';

export interface WorkflowElement {
  id: string;
  type: ElementType;
  label: string;
  x: number;
  y: number;
  config: Record<string, any>;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  elementId?: string;
}

export interface ExecutionState {
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  context: Record<string, any>;
}

export interface WorkflowState {
  elements: WorkflowElement[];
  selectedElementId: string | null;
  logs: LogEntry[];
  execution: ExecutionState;
  canvas: {
    zoom: number;
    pan: { x: number; y: number };
  };
}

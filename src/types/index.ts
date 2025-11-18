import { Node, Edge } from 'reactflow';

export type AgentType = 'llm' | 'tool' | 'memory';

export interface AgentConfig {
  name: string;
  prompt: string;
  agentType: AgentType;
}

export interface WorkflowNode extends Node {
  data: {
    label: string;
    config: AgentConfig;
  };
}

export interface LogEntry {
  id: string;
  timestamp: number;
  agentName: string;
  agentType: AgentType;
  input: string;
  output: string;
  status: 'success' | 'running' | 'error';
}

export interface ExecutionState {
  isRunning: boolean;
  isPaused: boolean;
  currentNodeId: string | null;
  currentStep: number;
  totalSteps: number;
  memory: Record<string, any>;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  logs: LogEntry[];
  execution: ExecutionState;
}

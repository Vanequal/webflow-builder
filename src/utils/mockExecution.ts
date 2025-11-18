import { AgentType } from '../types';

export const mockExecuteAgent = async (
  agentType: AgentType,
  agentName: string,
  prompt: string
): Promise<string> => {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  switch (agentType) {
    case 'llm':
      return `LLM Agent "${agentName}" processed: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}" → Generated response with context analysis`;
    
    case 'tool':
      return 'Mock tool response';
    
    case 'memory':
      return `Memory updated: Stored context from "${agentName}"`;
    
    default:
      return 'Execution completed';
  }
};

export const getAgentTypeColor = (type: AgentType): string => {
  switch (type) {
    case 'llm':
      return 'from-blue-500 to-blue-600';
    case 'tool':
      return 'from-green-500 to-green-600';
    case 'memory':
      return 'from-purple-500 to-purple-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export const getAgentTypeIcon = (type: AgentType): string => {
  switch (type) {
    case 'llm':
      return 'brain';
    case 'tool':
      return 'wrench';
    case 'memory':
      return 'database';
    default:
      return 'box';
  }
};

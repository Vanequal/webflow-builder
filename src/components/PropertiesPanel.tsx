import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateNode, removeNode } from '../store/workflowSlice';
import { Settings, Trash2, Save } from 'lucide-react';

const PropertiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedNodeId = useAppSelector((state) => state.workflow.selectedNodeId);
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [agentType, setAgentType] = useState<'llm' | 'tool' | 'memory'>('llm');

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.data.config.name || '');
      setPrompt(selectedNode.data.config.prompt || '');
      setAgentType(selectedNode.data.config.agentType || 'llm');
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      dispatch(updateNode({
        id: selectedNode.id,
        data: {
          config: {
            name,
            prompt,
            agentType,
          },
        },
      }));
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      dispatch(removeNode(selectedNode.id));
    }
  };

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-gray-400">
        <Settings className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-center text-sm">Select a node on the canvas to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter agent name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Agent Type
          </label>
          <select
            value={agentType}
            onChange={(e) => setAgentType(e.target.value as any)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all capitalize"
          >
            <option value="llm">LLM Agent</option>
            <option value="tool">Tool Agent</option>
            <option value="memory">Memory</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prompt / Instructions
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt or instructions for this agent..."
            rows={8}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>

          <button
            onClick={handleDelete}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Agent
          </button>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p className="font-semibold mb-1">ID: {selectedNode.id}</p>
          <p>Type: {selectedNode.data.config.agentType}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;

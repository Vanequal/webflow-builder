import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  ConnectionMode,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setNodes, setEdges, connectNodes, selectNode } from '../store/workflowSlice';
import AgentNode from './AgentNode';

const nodeTypes = {
  agent: AgentNode,
};

const Canvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.workflow.nodes);
  const edges = useAppSelector((state) => state.workflow.edges);
  const currentNodeId = useAppSelector((state) => state.workflow.execution.currentNodeId);

  // Add execution state to nodes for rendering
  const nodesWithExecution = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      isExecuting: node.id === currentNodeId,
    },
  }));

  const onNodesChange = useCallback(
    (changes: any) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      dispatch(setNodes(updatedNodes as any));
    },
    [dispatch, nodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      dispatch(setEdges(updatedEdges));
    },
    [dispatch, edges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      dispatch(connectNodes(connection));
    },
    [dispatch]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(selectNode(node.id));
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch(selectNode(null));
  }, [dispatch]);

  return (
    <div style={{ 
      flex: 1,
      height: '100%',
      width: '100%',
      position: 'relative',
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)'
    }}>
      <ReactFlow
        nodes={nodesWithExecution}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <Background 
          gap={20} 
          size={1} 
          color="#cbd5e1"
        />
        <Controls 
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          showInteractive={false}
        />
        <MiniMap
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          nodeColor={(node) => {
            switch (node.data.config.agentType) {
              case 'llm': return '#3b82f6';
              case 'tool': return '#10b981';
              case 'memory': return '#a855f7';
              default: return '#6b7280';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
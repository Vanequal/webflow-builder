import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectElement, moveElement, removeElement } from '../store/workflowSlice';
import { WorkflowElement } from '../types';

const Canvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.workflow.elements);
  const selectedId = useAppSelector((state) => state.workflow.selectedElementId);
  const executionState = useAppSelector((state) => state.workflow.execution);

  console.log('Canvas render - elements:', elements.length, elements);

  const getElementColor = (type: WorkflowElement['type']) => {
    switch (type) {
      case 'action':
        return 'bg-blue-500 border-blue-600';
      case 'condition':
        return 'bg-amber-500 border-amber-600';
      case 'loop':
        return 'bg-purple-500 border-purple-600';
      case 'api':
        return 'bg-green-500 border-green-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const getElementIcon = (type: WorkflowElement['type']) => {
    switch (type) {
      case 'action':
        return '⚡';
      case 'condition':
        return '🔀';
      case 'loop':
        return '🔄';
      case 'api':
        return '🌐';
      default:
        return '📦';
    }
  };

  const isExecuting = (elementId: string) => {
    if (!executionState.isRunning) return false;
    const index = elements.findIndex(el => el.id === elementId);
    return index === executionState.currentStep - 1;
  };

  const isCompleted = (elementId: string) => {
    if (!executionState.isRunning) return false;
    const index = elements.findIndex(el => el.id === elementId);
    return index < executionState.currentStep;
  };

  return (
    <div className="flex-1 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        {/* Debug info */}
        <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded shadow text-sm">
          Элементов на холсте: <strong>{elements.length}</strong>
        </div>

        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-xl font-semibold">Холст пуст</p>
              <p className="text-sm mt-2">Добавьте элементы с помощью кнопок вверху</p>
            </div>
          </div>
        )}

        {elements.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedId === element.id}
            isExecuting={isExecuting(element.id)}
            isCompleted={isCompleted(element.id)}
            onSelect={() => dispatch(selectElement(element.id))}
            onDelete={() => dispatch(removeElement(element.id))}
            onMove={(x, y) => dispatch(moveElement({ id: element.id, x, y }))}
            getColor={getElementColor}
            getIcon={getElementIcon}
          />
        ))}
      </div>
    </div>
  );
};

interface DraggableElementProps {
  element: WorkflowElement;
  isSelected: boolean;
  isExecuting: boolean;
  isCompleted: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: (x: number, y: number) => void;
  getColor: (type: WorkflowElement['type']) => string;
  getIcon: (type: WorkflowElement['type']) => string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  isExecuting,
  isCompleted,
  onSelect,
  onDelete,
  onMove,
  getColor,
  getIcon,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  console.log('Rendering element:', element.id, 'at', element.x, element.y);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - element.x, y: e.clientY - element.y });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragStart) {
      onMove(e.clientX - dragStart.x, e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.8 : 1,
        zIndex: isSelected ? 100 : 10,
      }}
      onMouseDown={handleMouseDown}
      className="select-none"
    >
      <div
        className={`
          relative w-40 min-h-24 rounded-lg shadow-lg border-2 p-3
          ${getColor(element.type)}
          ${isSelected ? 'ring-4 ring-indigo-300' : ''}
          ${isExecuting ? 'animate-pulse ring-4 ring-yellow-400' : ''}
          ${isCompleted ? 'opacity-60' : ''}
          transition-all duration-200 hover:shadow-xl
        `}
      >
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            ✓
          </div>
        )}
        {isExecuting && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{getIcon(element.type)}</span>
          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-bold transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="text-white">
          <div className="font-semibold text-sm mb-1">{element.label}</div>
          <div className="text-xs opacity-80 capitalize">{element.type}</div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;

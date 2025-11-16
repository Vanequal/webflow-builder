import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { addElement } from '../store/workflowSlice';
import { ElementType } from '../types';

const Toolbar: React.FC = () => {
  const dispatch = useAppDispatch();

  const elementTypes: { type: ElementType; label: string; icon: string; color: string }[] = [
    { type: 'action', label: 'Действие', icon: '⚡', color: 'bg-blue-500 hover:bg-blue-600' },
    { type: 'condition', label: 'Условие', icon: '🔀', color: 'bg-amber-500 hover:bg-amber-600' },
    { type: 'loop', label: 'Цикл', icon: '🔄', color: 'bg-purple-500 hover:bg-purple-600' },
    { type: 'api', label: 'API', icon: '🌐', color: 'bg-green-500 hover:bg-green-600' },
  ];

  const handleAddElement = (type: ElementType, label: string) => {
    const newElement = {
      id: `${type}-${Date.now()}`,
      type,
      label: `${label} ${Date.now() % 100}`,
      x: 50 + (Math.random() * 300),
      y: 50 + (Math.random() * 200),
      config: {},
    };
    dispatch(addElement(newElement));
    console.log('Element added:', newElement);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700 mr-2">Добавить элемент:</h2>
      {elementTypes.map((item) => (
        <button
          key={item.type}
          onClick={() => handleAddElement(item.type, item.label)}
          className={`
            ${item.color}
            text-white px-4 py-2 rounded-lg font-medium shadow-md
            transition-all duration-200 transform hover:scale-105
            flex items-center gap-2
          `}
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;

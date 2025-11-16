import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateElement } from '../store/workflowSlice';

const PropertiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.workflow.selectedElementId);
  const elements = useAppSelector((state) => state.workflow.elements);
  const selectedElement = elements.find((el) => el.id === selectedId);

  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});
  const [localLabel, setLocalLabel] = useState('');

  useEffect(() => {
    if (selectedElement) {
      setLocalConfig(selectedElement.config || {});
      setLocalLabel(selectedElement.label || '');
    }
  }, [selectedElement]);

  const handleUpdate = () => {
    if (selectedElement) {
      dispatch(updateElement({
        id: selectedElement.id,
        updates: {
          label: localLabel,
          config: localConfig,
        },
      }));
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (!selectedElement) {
    return (
      <div className="bg-white border-b border-gray-200 p-4 flex flex-col items-center justify-center text-gray-400">
        <div className="text-4xl mb-2">📋</div>
        <p className="text-center text-sm">Выберите элемент</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 overflow-y-auto max-h-80">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Свойства</h2>
      
      <div className="mb-3 p-3 bg-gray-50 rounded">
        <div className="text-xs text-gray-500 mb-1">Тип</div>
        <div className="text-sm font-semibold capitalize">{selectedElement.type}</div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Название
        </label>
        <input
          type="text"
          value={localLabel}
          onChange={(e) => setLocalLabel(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          ID
        </label>
        <input
          type="text"
          value={selectedElement.id}
          disabled
          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-gray-100 text-gray-500"
        />
      </div>

      <hr className="my-3 border-gray-200" />

      <h3 className="text-sm font-semibold text-gray-800 mb-3">Конфигурация</h3>

      {selectedElement.type === 'action' && (
        <>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Команда
            </label>
            <input
              type="text"
              value={localConfig.command || ''}
              onChange={(e) => handleConfigChange('command', e.target.value)}
              placeholder="например: processData"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Параметры (JSON)
            </label>
            <textarea
              value={localConfig.params || ''}
              onChange={(e) => handleConfigChange('params', e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 font-mono"
              rows={2}
            />
          </div>
        </>
      )}

      {selectedElement.type === 'condition' && (
        <>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Условие
            </label>
            <input
              type="text"
              value={localConfig.condition || ''}
              onChange={(e) => handleConfigChange('condition', e.target.value)}
              placeholder="например: value > 10"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Действие при true
            </label>
            <input
              type="text"
              value={localConfig.trueAction || ''}
              onChange={(e) => handleConfigChange('trueAction', e.target.value)}
              placeholder="next-step-id"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </>
      )}

      {selectedElement.type === 'loop' && (
        <>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Количество итераций
            </label>
            <input
              type="number"
              value={localConfig.iterations || 3}
              onChange={(e) => handleConfigChange('iterations', parseInt(e.target.value))}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Переменная счетчика
            </label>
            <input
              type="text"
              value={localConfig.iterator || 'i'}
              onChange={(e) => handleConfigChange('iterator', e.target.value)}
              placeholder="i"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </>
      )}

      {selectedElement.type === 'api' && (
        <>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Endpoint
            </label>
            <input
              type="text"
              value={localConfig.endpoint || ''}
              onChange={(e) => handleConfigChange('endpoint', e.target.value)}
              placeholder="/api/users"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Метод
            </label>
            <select
              value={localConfig.method || 'GET'}
              onChange={(e) => handleConfigChange('method', e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Headers (JSON)
            </label>
            <textarea
              value={localConfig.headers || ''}
              onChange={(e) => handleConfigChange('headers', e.target.value)}
              placeholder='{"Authorization": "Bearer token"}'
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 font-mono"
              rows={2}
            />
          </div>
        </>
      )}

      <button
        onClick={handleUpdate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors shadow-md text-sm"
      >
        Применить изменения
      </button>
    </div>
  );
};

export default PropertiesPanel;

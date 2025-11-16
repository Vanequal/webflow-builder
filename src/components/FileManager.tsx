import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadWorkflow, clearWorkflow, addLog } from '../store/workflowSlice';
import { mockAPI } from '../utils/mockAPI';

const FileManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.workflow.elements);

  const handleSave = async () => {
    try {
      await mockAPI.saveWorkflow(elements);
      dispatch(addLog({
        message: '💾 Схема сохранена успешно!',
        type: 'success',
      }));
    } catch (error) {
      dispatch(addLog({
        message: '❌ Ошибка при сохранении схемы',
        type: 'error',
      }));
    }
  };

  const handleLoad = async () => {
    try {
      const loadedElements = await mockAPI.loadWorkflow();
      if (loadedElements.length === 0) {
        dispatch(addLog({
          message: 'ℹ️ Нет сохраненной схемы',
          type: 'info',
        }));
        return;
      }
      dispatch(loadWorkflow(loadedElements));
    } catch (error) {
      dispatch(addLog({
        message: '❌ Ошибка при загрузке схемы',
        type: 'error',
      }));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    dispatch(addLog({
      message: '📥 Схема экспортирована в JSON',
      type: 'success',
    }));
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            dispatch(loadWorkflow(imported));
            dispatch(addLog({
              message: '📤 Схема импортирована из JSON',
              type: 'success',
            }));
          } catch (error) {
            dispatch(addLog({
              message: '❌ Ошибка при импорте: неверный формат JSON',
              type: 'error',
            }));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (elements.length > 0 && !confirm('Вы уверены? Все элементы будут удалены.')) {
      return;
    }
    dispatch(clearWorkflow());
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700 mr-2">Файл:</h2>
      
      <button
        onClick={handleSave}
        disabled={elements.length === 0}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <span>💾</span>
        <span>Сохранить</span>
      </button>

      <button
        onClick={handleLoad}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <span>📂</span>
        <span>Загрузить</span>
      </button>

      <button
        onClick={handleExport}
        disabled={elements.length === 0}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <span>📥</span>
        <span>Экспорт JSON</span>
      </button>

      <button
        onClick={handleImport}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <span>📤</span>
        <span>Импорт JSON</span>
      </button>

      <div className="flex-1"></div>

      <button
        onClick={handleClear}
        disabled={elements.length === 0}
        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <span>🗑️</span>
        <span>Очистить всё</span>
      </button>
    </div>
  );
};

export default FileManager;

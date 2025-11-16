import { WorkflowElement } from '../types';

const STORAGE_KEY = 'workflow_data';

export const mockAPI = {
  // Сохранение схемы
  saveWorkflow: async (elements: WorkflowElement[]): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
        resolve({ success: true });
      }, 300);
    });
  },

  // Загрузка схемы
  loadWorkflow: async (): Promise<WorkflowElement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        resolve(data ? JSON.parse(data) : []);
      }, 300);
    });
  },

  // Мок выполнения шага
  executeStep: async (element: WorkflowElement, _context: Record<string, any>): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result: any;

        switch (element.type) {
          case 'action':
            result = {
              status: 'completed',
              output: `Действие "${element.label}" выполнено`,
              timestamp: new Date().toISOString(),
            };
            break;

          case 'condition':
            const conditionValue = element.config.condition || 'true';
            result = {
              passed: Math.random() > 0.3, // 70% успешных проверок
              condition: conditionValue,
              message: `Условие "${conditionValue}" проверено`,
            };
            break;

          case 'loop':
            const iterations = element.config.iterations || 3;
            result = {
              iterations,
              completed: true,
              message: `Цикл выполнен ${iterations} раз`,
            };
            break;

          case 'api':
            const endpoint = element.config.endpoint || '/api/mock';
            result = {
              endpoint,
              status: 200,
              data: { message: 'Mock API response', timestamp: Date.now() },
              responseTime: Math.floor(Math.random() * 500) + 100,
            };
            break;

          default:
            result = { status: 'unknown' };
        }

        resolve(result);
      }, Math.random() * 800 + 400); // Рандомная задержка 400-1200ms
    });
  },
};

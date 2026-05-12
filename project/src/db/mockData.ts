import type { User } from '../models/user';
import type { Task } from '../models/task';

export const MOCK_USER: User = {
  id: 'usr_01',
  name: 'Олексій Ковальчук',
  email: 'admin@taskdiary.app',
  createdAt: '2024-01-15T10:00:00Z',
};

export const MOCK_PASSWORD = 'password123';

export const MOCK_TASKS: Task[] = [
  {
    id: 'tsk_01',
    title: 'Розробити UI компоненти',
    description: 'Створити базові UI компоненти для дашборду: кнопки, інпути, картки.',
    priority: 'high',
    status: 'done',
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-05-02T14:30:00Z',
    userId: 'usr_01',
  },
  {
    id: 'tsk_02',
    title: 'Підключити PostgreSQL',
    description: 'Налаштувати підключення до бази даних та написати міграції для таблиць users і tasks.',
    priority: 'high',
    status: 'todo',
    createdAt: '2024-05-03T11:00:00Z',
    updatedAt: '2024-05-03T11:00:00Z',
    userId: 'usr_01',
  },
  {
    id: 'tsk_03',
    title: 'Написати unit тести',
    description: 'Покрити сервіси та репозиторії тестами. Мінімальний поріг покриття — 80%.',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-05-04T08:30:00Z',
    updatedAt: '2024-05-05T16:00:00Z',
    userId: 'usr_01',
  },
  {
    id: 'tsk_04',
    title: 'Налаштувати CI/CD pipeline',
    description: 'Інтегрувати GitHub Actions для автоматичного деплою на staging і production.',
    priority: 'medium',
    status: 'todo',
    createdAt: '2024-05-06T10:00:00Z',
    updatedAt: '2024-05-06T10:00:00Z',
    userId: 'usr_01',
  },
  {
    id: 'tsk_05',
    title: 'Оптимізувати запити до БД',
    description: 'Додати індекси та оптимізувати N+1 запити в ORM.',
    priority: 'low',
    status: 'todo',
    createdAt: '2024-05-07T14:00:00Z',
    updatedAt: '2024-05-07T14:00:00Z',
    userId: 'usr_01',
  },
  {
    id: 'tsk_06',
    title: 'Документація API',
    description: 'Написати OpenAPI (Swagger) документацію для всіх ендпоінтів.',
    priority: 'low',
    status: 'in_progress',
    createdAt: '2024-05-08T09:00:00Z',
    updatedAt: '2024-05-09T12:00:00Z',
    userId: 'usr_01',
  },
];

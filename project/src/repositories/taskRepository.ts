import type { Task, CreateTaskDto, UpdateTaskDto } from '../models/task';
import { MOCK_TASKS } from '../db/mockData';

// In production: replace with actual DB queries

let tasks: Task[] = [...MOCK_TASKS];

let idCounter = tasks.length + 1;

function generateId(): string {
  return `tsk_${String(idCounter++).padStart(2, '0')}`;
}

export const taskRepository = {
  findAllByUser(userId: string): Task[] {
    return tasks.filter((t) => t.userId === userId);
  },

  findById(id: string): Task | null {
    return tasks.find((t) => t.id === id) ?? null;
  },

  create(userId: string, dto: CreateTaskDto): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      ...dto,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    tasks = [...tasks, task];
    return task;
  },

  update(dto: UpdateTaskDto): Task | null {
    const idx = tasks.findIndex((t) => t.id === dto.id);
    if (idx === -1) return null;
    const updated: Task = {
      ...tasks[idx],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    tasks = tasks.map((t) => (t.id === dto.id ? updated : t));
    return updated;
  },

  delete(id: string): boolean {
    const before = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);
    return tasks.length < before;
  },
};

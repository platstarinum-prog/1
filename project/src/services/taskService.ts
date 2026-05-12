import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../models/task';
import { taskRepository } from '../repositories/taskRepository';

export const taskService = {
  getTasks(userId: string): Task[] {
    return taskRepository.findAllByUser(userId);
  },

  createTask(userId: string, dto: CreateTaskDto): Task {
    if (!dto.title.trim()) throw new Error('Назва задачі обовязкова');
    return taskRepository.create(userId, dto);
  },

  updateTask(dto: UpdateTaskDto): Task {
    const updated = taskRepository.update(dto);
    if (!updated) throw new Error('Задачу не знайдено');
    return updated;
  },

  deleteTask(id: string): void {
    const deleted = taskRepository.delete(id);
    if (!deleted) throw new Error('Задачу не знайдено');
  },

  changeStatus(id: string, status: TaskStatus): Task {
    return taskService.updateTask({ id, status });
  },

  getStats(userId: string) {
    const all = taskRepository.findAllByUser(userId);
    return {
      total: all.length,
      todo: all.filter((t) => t.status === 'todo').length,
      inProgress: all.filter((t) => t.status === 'in_progress').length,
      done: all.filter((t) => t.status === 'done').length,
    };
  },
};

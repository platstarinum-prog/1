import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../models/task';
import { taskService } from '../services/taskService';

// Mock API layer — replace with actual HTTP calls when backend is ready

export const taskApi = {
  async getTasks(userId: string): Promise<Task[]> {
    await delay(400);
    return taskService.getTasks(userId);
  },

  async createTask(userId: string, dto: CreateTaskDto): Promise<Task> {
    await delay(350);
    return taskService.createTask(userId, dto);
  },

  async updateTask(dto: UpdateTaskDto): Promise<Task> {
    await delay(300);
    return taskService.updateTask(dto);
  },

  async deleteTask(id: string): Promise<void> {
    await delay(300);
    taskService.deleteTask(id);
  },

  async changeStatus(id: string, status: TaskStatus): Promise<Task> {
    await delay(250);
    return taskService.changeStatus(id, status);
  },

  async getStats(userId: string) {
    await delay(200);
    return taskService.getStats(userId);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

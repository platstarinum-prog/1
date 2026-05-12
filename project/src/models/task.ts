export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  id: string;
}

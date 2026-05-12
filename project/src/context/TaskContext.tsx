import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../models/task';
import { taskApi } from '../api/taskApi';
import { useAuth } from './AuthContext';

interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

interface TaskContextValue {
  tasks: Task[];
  stats: TaskStats;
  isLoading: boolean;
  createTask: (dto: CreateTaskDto) => Promise<Task>;
  updateTask: (dto: UpdateTaskDto) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  changeStatus: (id: string, status: TaskStatus) => Promise<Task>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const refreshTasks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [fetched, fetchedStats] = await Promise.all([
        taskApi.getTasks(user.id),
        taskApi.getStats(user.id),
      ]);
      setTasks(fetched);
      setStats(fetchedStats);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const createTask = useCallback(
    async (dto: CreateTaskDto): Promise<Task> => {
      if (!user) throw new Error('Not authenticated');
      const task = await taskApi.createTask(user.id, dto);
      await refreshTasks();
      return task;
    },
    [user, refreshTasks]
  );

  const updateTask = useCallback(
    async (dto: UpdateTaskDto): Promise<Task> => {
      const task = await taskApi.updateTask(dto);
      await refreshTasks();
      return task;
    },
    [refreshTasks]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      await taskApi.deleteTask(id);
      await refreshTasks();
    },
    [refreshTasks]
  );

  const changeStatus = useCallback(
    async (id: string, status: TaskStatus): Promise<Task> => {
      const task = await taskApi.changeStatus(id, status);
      await refreshTasks();
      return task;
    },
    [refreshTasks]
  );

  return (
    <TaskContext.Provider value={{ tasks, stats, isLoading, createTask, updateTask, deleteTask, changeStatus, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider');
  return ctx;
}

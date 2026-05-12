import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import type { Task, TaskStatus } from '../../models/task';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onChangeStatus: (id: string, status: TaskStatus) => void;
}

const statusOptions = [
  { value: 'todo', label: 'До виконання' },
  { value: 'in_progress', label: 'В процесі' },
  { value: 'done', label: 'Виконано' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function TaskCard({ task, onEdit, onDelete, onChangeStatus }: TaskCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-zinc-100 p-5 hover:shadow-md hover:shadow-zinc-100 hover:border-zinc-200 transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 leading-snug mb-1.5">{task.title}</h3>
          {task.description && (
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            title="Редагувати"
            className="p-1.5"
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            title="Видалити"
            className="p-1.5 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-50">
        <span className="text-xs text-zinc-400">{formatDate(task.createdAt)}</span>
        <div className="flex items-center gap-2">
          <Select
            options={statusOptions}
            value={task.status}
            onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus)}
            className="text-xs py-1 px-2"
          />
          <ChevronRight size={12} className="text-zinc-300" />
        </div>
      </div>
    </div>
  );
}

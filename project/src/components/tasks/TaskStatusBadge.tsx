import type { TaskStatus } from '../../models/task';
import { Badge } from '../ui/Badge';

const config: Record<TaskStatus, { label: string; variant: 'default' | 'success' | 'warning' }> = {
  todo: { label: 'До виконання', variant: 'default' },
  in_progress: { label: 'В процесі', variant: 'warning' },
  done: { label: 'Виконано', variant: 'success' },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

import type { TaskPriority } from '../../models/task';
import { Badge } from '../ui/Badge';

const config: Record<TaskPriority, { label: string; variant: 'danger' | 'warning' | 'info' }> = {
  high: { label: 'Високий', variant: 'danger' },
  medium: { label: 'Середній', variant: 'warning' },
  low: { label: 'Низький', variant: 'info' },
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
}

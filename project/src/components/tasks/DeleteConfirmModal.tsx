import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Task } from '../../models/task';

interface DeleteConfirmModalProps {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  task,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={!!task} onClose={onClose} title="Видалити задачу" size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm text-zinc-600 mb-1">
            Ви впевнені, що хочете видалити задачу?
          </p>
          <p className="text-sm font-semibold text-zinc-900">"{task?.title}"</p>
        </div>
        <p className="text-xs text-zinc-400">Цю дію неможливо скасувати.</p>
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
            Скасувати
          </Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isLoading} className="flex-1 bg-red-500 hover:bg-red-600">
            Видалити
          </Button>
        </div>
      </div>
    </Modal>
  );
}

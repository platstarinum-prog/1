import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Task, CreateTaskDto, TaskPriority, TaskStatus } from '../../models/task';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateTaskDto) => Promise<void>;
  initialTask?: Task;
  isLoading?: boolean;
}

const priorityOptions = [
  { value: 'high', label: 'Високий' },
  { value: 'medium', label: 'Середній' },
  { value: 'low', label: 'Низький' },
];

const statusOptions = [
  { value: 'todo', label: 'До виконання' },
  { value: 'in_progress', label: 'В процесі' },
  { value: 'done', label: 'Виконано' },
];

const emptyForm: CreateTaskDto = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
};

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  isLoading = false,
}: TaskFormModalProps) {
  const [form, setForm] = useState<CreateTaskDto>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskDto, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialTask
          ? {
              title: initialTask.title,
              description: initialTask.description,
              priority: initialTask.priority,
              status: initialTask.status,
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [isOpen, initialTask]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "Назва обов'язкова";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Редагувати задачу' : 'Нова задача'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Назва"
          placeholder="Введіть назву задачі..."
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          error={errors.title}
          autoFocus
        />
        <Textarea
          label="Опис"
          placeholder="Деталі задачі (необов'язково)..."
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Пріоритет"
            options={priorityOptions}
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
          />
          <Select
            label="Статус"
            options={statusOptions}
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
            Скасувати
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialTask ? 'Зберегти' : 'Створити'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

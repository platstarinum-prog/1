import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, ListTodo } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { DeleteConfirmModal } from '../components/tasks/DeleteConfirmModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import type { Task, CreateTaskDto, TaskPriority, TaskStatus } from '../models/task';

const statusFilterOptions = [
  { value: 'all', label: 'Всі статуси' },
  { value: 'todo', label: 'До виконання' },
  { value: 'in_progress', label: 'В процесі' },
  { value: 'done', label: 'Виконано' },
];

const priorityFilterOptions = [
  { value: 'all', label: 'Всі пріоритети' },
  { value: 'high', label: 'Високий' },
  { value: 'medium', label: 'Середній' },
  { value: 'low', label: 'Низький' },
];

const sortOptions = [
  { value: 'newest', label: 'Спочатку нові' },
  { value: 'oldest', label: 'Спочатку старі' },
  { value: 'priority', label: 'За пріоритетом' },
  { value: 'title', label: 'За назвою' },
];

const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

export function TasksPage() {
  const { tasks, isLoading, createTask, updateTask, deleteTask, changeStatus } = useTasks();
  const { showToast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sort === 'title') return a.title.localeCompare(b.title, 'uk');
      return 0;
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sort]);

  async function handleCreate(dto: CreateTaskDto) {
    setActionLoading(true);
    try {
      await createTask(dto);
      setIsCreateOpen(false);
      showToast('Задачу створено', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Помилка', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEdit(dto: CreateTaskDto) {
    if (!editTask) return;
    setActionLoading(true);
    try {
      await updateTask({ id: editTask.id, ...dto });
      setEditTask(null);
      showToast('Задачу оновлено', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Помилка', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteTask(deleteTarget.id);
      setDeleteTarget(null);
      showToast('Задачу видалено', 'info');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Помилка', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleChangeStatus(id: string, status: TaskStatus) {
    try {
      await changeStatus(id, status);
      showToast('Статус оновлено', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Помилка', 'error');
    }
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSort('newest');
  }

  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <>
      <Header title="Задачі" subtitle={`${tasks.length} задач загалом`} />

      <div className="flex-1 p-8 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Пошук задач..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={15} />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm"
            />
            <Select
              options={priorityFilterOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-sm"
            />
            <Select
              options={sortOptions}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm"
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <SlidersHorizontal size={14} />
                Скинути
              </Button>
            )}
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus size={15} />
              Нова задача
            </Button>
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-xs text-zinc-400">
            {filtered.length === tasks.length
              ? `${tasks.length} задач`
              : `${filtered.length} з ${tasks.length} задач`}
          </p>
        )}

        {/* Task grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-200 p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-4">
              <ListTodo size={24} className="text-zinc-400" />
            </div>
            {hasFilters ? (
              <>
                <p className="text-sm font-medium text-zinc-600 mb-1">Нічого не знайдено</p>
                <p className="text-xs text-zinc-400 mb-4">Спробуйте змінити параметри пошуку</p>
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Скинути фільтри
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-600 mb-1">Задач ще немає</p>
                <p className="text-xs text-zinc-400 mb-4">Створіть свою першу задачу прямо зараз</p>
                <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                  <Plus size={14} />
                  Створити задачу
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditTask}
                onDelete={setDeleteTarget}
                onChangeStatus={handleChangeStatus}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={actionLoading}
      />
      <TaskFormModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleEdit}
        initialTask={editTask ?? undefined}
        isLoading={actionLoading}
      />
      <DeleteConfirmModal
        task={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={actionLoading}
      />
    </>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { DeleteConfirmModal } from '../components/tasks/DeleteConfirmModal';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import type { Task, CreateTaskDto, TaskStatus } from '../models/task';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const { tasks, stats, isLoading, createTask, updateTask, deleteTask, changeStatus } = useTasks();
  const { showToast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const recentTasks = tasks.slice(0, 4);

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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Доброго ранку';
    if (h < 17) return 'Доброго дня';
    return 'Доброго вечора';
  })();

  return (
    <>
      <Header
        title="Дашборд"
        subtitle={`${greeting}, ${user?.name.split(' ')[0]}!`}
      />

      <div className="flex-1 p-8 space-y-8">
        {/* Stats */}
        <section>
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Статистика</h2>
          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Всього задач"
                value={stats.total}
                icon={BarChart3}
                color="blue"
                description="в усіх категоріях"
              />
              <StatCard
                title="До виконання"
                value={stats.todo}
                icon={ListTodo}
                color="red"
                description="очікують початку"
              />
              <StatCard
                title="В процесі"
                value={stats.inProgress}
                icon={Clock}
                color="amber"
                description="активно виконуються"
              />
              <StatCard
                title="Виконано"
                value={stats.done}
                icon={CheckCircle2}
                color="emerald"
                description="успішно завершено"
              />
            </div>
          )}
        </section>

        {/* Progress bar */}
        {stats.total > 0 && (
          <section className="bg-white rounded-2xl border border-zinc-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-zinc-700">Загальний прогрес</span>
              <span className="text-sm font-semibold text-zinc-900">
                {Math.round((stats.done / stats.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-400 to-rose-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.done / stats.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              {stats.done} з {stats.total} задач виконано
            </p>
          </section>
        )}

        {/* Recent tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Останні задачі
            </h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setIsCreateOpen(true)}>
                <Plus size={14} />
                Нова задача
              </Button>
              <Link to="/tasks">
                <Button size="sm" variant="ghost">
                  Всі задачі
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : recentTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 border-dashed p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3">
                <ListTodo size={20} className="text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-600 mb-1">Задач ще немає</p>
              <p className="text-xs text-zinc-400 mb-4">Створіть свою першу задачу</p>
              <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus size={14} />
                Створити задачу
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentTasks.map((task) => (
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
        </section>
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

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TaskProvider } from '../../context/TaskContext';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-zinc-50 flex">
        <Sidebar />
        <main className="flex-1 ml-60 flex flex-col min-h-screen">
          {children}
        </main>
      </div>
    </TaskProvider>
  );
}

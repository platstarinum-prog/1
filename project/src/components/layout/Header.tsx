import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="h-6 w-px bg-zinc-100" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {user?.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-zinc-700 hidden sm:block">
            {user?.name.split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  );
}

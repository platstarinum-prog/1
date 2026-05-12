import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { to: '/tasks', icon: ListTodo, label: 'Задачі' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  async function handleLogout() {
    await logout();
    showToast('Ви вийшли з системи', 'info');
  }

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-zinc-100 flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-zinc-100">
        <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-semibold text-zinc-900 tracking-tight">Task Diary</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-red-50 text-red-600'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-red-500' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="px-3 py-3 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-900 truncate">{user?.name}</p>
            <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Вийти"
            className="text-zinc-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

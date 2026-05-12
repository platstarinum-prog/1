import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'red' | 'amber' | 'emerald' | 'blue';
  description?: string;
}

const colorClasses = {
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-500',
    ring: 'ring-red-100',
    value: 'text-red-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    ring: 'ring-amber-100',
    value: 'text-amber-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-500',
    ring: 'ring-emerald-100',
    value: 'text-emerald-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    ring: 'ring-blue-100',
    value: 'text-blue-600',
  },
};

export function StatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
  const c = colorClasses[color];
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 hover:shadow-md hover:shadow-zinc-100 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-zinc-500">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
          <Icon size={17} className={c.icon} />
        </div>
      </div>
      <div className={`text-3xl font-bold ${c.value} mb-1`}>{value}</div>
      {description && <p className="text-xs text-zinc-400">{description}</p>}
    </div>
  );
}

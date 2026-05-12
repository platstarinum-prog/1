import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast, type Toast, type ToastType } from '../../context/ToastContext';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />,
  error: <XCircle size={16} className="text-red-500 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-500 flex-shrink-0" />,
};

const borderColors: Record<ToastType, string> = {
  success: 'border-l-emerald-400',
  error: 'border-l-red-400',
  info: 'border-l-blue-400',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <div
      className={[
        'flex items-start gap-3 bg-white rounded-xl shadow-lg shadow-zinc-200/60 border border-zinc-100 border-l-4 px-4 py-3 min-w-72 max-w-sm animate-slide-in',
        borderColors[toast.type],
      ].join(' ')}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-zinc-700 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-zinc-300 hover:text-zinc-500 transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}

import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-700">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={[
              'w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : '',
              error ? 'border-red-400 focus:ring-red-100' : '',
              className,
            ].join(' ')}
            {...rest}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

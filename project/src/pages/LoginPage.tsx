import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState(''); // Прибрав забиті дані
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  if (user) return <Navigate to="/dashboard" replace />;

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email обов'язковий";
    if (!password) e.password = "Пароль обов'язковий";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    
    try {
      // Викликаємо функцію login з AuthContext
      await login(email, password);
      showToast('Ласкаво просимо!', 'success');
    } catch (err) {
      // Сюди прилетить помилка, якщо пароль невірний або сервер лежить
      showToast(err instanceof Error ? err.message : 'Помилка авторизації', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-red-50 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-zinc-100/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-zinc-200/60 shadow-xl shadow-zinc-200/40 px-8 py-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center mb-4 shadow-lg shadow-red-200">
              <BookOpen size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Task Diary</h1>
            <p className="text-sm text-zinc-400 mt-1">Увійдіть до свого облікового запису</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="vash-email@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail size={15} />}
              autoComplete="email"
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock size={15} />}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2"
              size="lg"
            >
              Увійти
            </Button>
          </form>

          {/* Підказка з твоїм реальним створеним акаунтом */}
          <div className="mt-6 p-3 bg-red-50/50 rounded-xl border border-red-100">
            <p className="text-xs text-red-600 text-center">
              Твій локальний акаунт:<br/>
              <span className="font-bold">test@test.com</span> / <span className="font-bold">123456</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Task Diary &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

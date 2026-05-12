import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function RegisterPage() {
  const { user, register, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  if (user) return <Navigate to="/dashboard" replace />;

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Ім'я обов'язкове";
    if (!email.trim()) e.email = "Email обов'язковий";
    if (password.length < 6) e.password = "Пароль має бути не менше 6 символів";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await register(name, email, password);
      showToast('Акаунт створено!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Помилка реєстрації', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-zinc-200/60 shadow-xl shadow-zinc-200/40 px-8 py-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center mb-4 shadow-lg shadow-red-200">
              <BookOpen size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Створити акаунт</h1>
            <p className="text-sm text-zinc-400 mt-1">Приєднуйтесь до Task Diary</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Повне ім'я"
              placeholder="Тимур"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              leftIcon={<User size={15} />}
            />
            <Input
              label="Email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail size={15} />}
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock size={15} />}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="lg">
              Зареєструватися
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Вже маєте акаунт?{' '}
            <button onClick={() => navigate('/login')} className="text-red-500 hover:underline font-medium">
              Увійти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

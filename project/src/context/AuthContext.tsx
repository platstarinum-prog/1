import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AuthUser } from '../models/user';
import { authApi } from '../api/authApi';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // Добавили тип
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  // Вход
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authUser = await authApi.login(email, password);
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // РЕГИСТРАЦИЯ (Новый метод)
  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const authUser = await authApi.register(name, email, password);
      setUser(authUser); // Сразу логиним юзера после регистрации
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Выход
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

import type { AuthUser } from '../models/user';

const API_URL = 'http://localhost:3001';

export const authApi = {
  /**
   * Вход в систему
   */
  login: async (email: string, password: string): Promise<AuthUser> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Помилка авторизації');
    }

    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data.user;
  },

  /**
   * Регистрация нового пользователя
   */
  register: async (name: string, email: string, password: string): Promise<AuthUser> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Помилка при реєстрації');
    }

    const data = await response.json();

    // Сразу после регистрации обычно тоже выдается токен, чтобы юзер зашел автоматически
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data.user;
  },

  /**
   * Выход из системы
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

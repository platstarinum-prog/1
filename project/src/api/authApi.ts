import type { AuthUser } from '../models/user';

// Твой новый живой адрес бэкенда
const API_URL = 'https://2-production-f179.up.railway.app';

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
      // Сохраняем данные юзера, чтобы authService мог их прочитать
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data.user;
  },

  /**
   * Реєстрація нового користувача
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

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    // Если бэкенд возвращает только юзера без обертки data.user, 
    // попробуй просто: return data; но в коде выше я настроил под стандарт
    return data.user || data; 
  },

  /**
   * Вихід із системи
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};

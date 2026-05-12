import type { AuthUser } from '../models/user';

const API_URL = 'http://localhost:3001';

export const authApi = {
  // Логін
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
    
    // Зберігаємо токен у localStorage, щоб сесія не злітала при оновленні сторінки
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    // Повертаємо дані юзера (id, name, email)
    return data.user;
  },

  // Логаут (просто чистимо токен локально)
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    // Можна додати запит на сервер, якщо захочеш видаляти сесію в БД
    return Promise.resolve();
  }
};

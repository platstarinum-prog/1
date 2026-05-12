import type { AuthUser } from '../models/user';
import { userRepository } from '../repositories/userRepository';

const TOKEN_KEY = 'task_diary_token';
const USER_KEY = 'task_diary_user';

function generateFakeJwt(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 86400000 })
  );
  const signature = btoa(`fake-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
}

export const authService = {
  login(email: string, password: string): AuthUser {
    const user = userRepository.findByEmail(email);
    if (!user) throw new Error('Користувача не знайдено');
    const valid = userRepository.validatePassword(email, password);
    if (!valid) throw new Error('Невірний пароль');
    const token = generateFakeJwt(user.id);
    const authUser: AuthUser = { ...user, token };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    return authUser;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

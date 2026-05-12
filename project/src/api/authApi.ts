import type { AuthUser } from '../models/user';
import { authService } from '../services/authService';

// Mock API layer — replace with actual HTTP calls when backend is ready

export const authApi = {
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(600);
    return authService.login(email, password);
  },

  async logout(): Promise<void> {
    await delay(200);
    authService.logout();
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

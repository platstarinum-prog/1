import type { User } from '../models/user';
import { MOCK_USER, MOCK_PASSWORD } from '../db/mockData';

// In production: replace with actual DB queries via pg/prisma/drizzle

export interface LoginCredentials {
  email: string;
  password: string;
}

export const userRepository = {
  findByEmail(email: string): User | null {
    if (email === MOCK_USER.email) return MOCK_USER;
    return null;
  },

  validatePassword(_email: string, password: string): boolean {
    return password === MOCK_PASSWORD;
  },

  findById(id: string): User | null {
    if (id === MOCK_USER.id) return MOCK_USER;
    return null;
  },
};

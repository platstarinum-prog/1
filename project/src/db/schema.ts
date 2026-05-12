/**
 * PostgreSQL-ready schema definitions.
 * When connecting a real DB, use these types to generate migrations.
 *
 * users table:
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid()
 *   name VARCHAR(255) NOT NULL
 *   email VARCHAR(255) UNIQUE NOT NULL
 *   password_hash VARCHAR(255) NOT NULL
 *   created_at TIMESTAMPTZ DEFAULT now()
 *
 * tasks table:
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid()
 *   user_id UUID REFERENCES users(id) ON DELETE CASCADE
 *   title VARCHAR(255) NOT NULL
 *   description TEXT
 *   priority ENUM('low','medium','high') DEFAULT 'medium'
 *   status ENUM('todo','in_progress','done') DEFAULT 'todo'
 *   created_at TIMESTAMPTZ DEFAULT now()
 *   updated_at TIMESTAMPTZ DEFAULT now()
 */

export const DB_TABLES = {
  USERS: 'users',
  TASKS: 'tasks',
} as const;

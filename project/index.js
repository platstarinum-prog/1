
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// 1. Настройка CORS - чтобы Netlify мог достучаться до Railway
app.use(cors());
app.use(express.json());

// 2. Подключение к БД (Railway сам даст DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

// Проверка подключения в логах
pool.connect((err) => {
  if (err) console.error('❌ Ошибка БД:', err.message);
  else console.log('✅ Подключено к PostgreSQL на Railway!');
});

// Middleware для защиты роутов
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Неверный токен' });
  }
}

// Главная страница (чтобы проверить в браузере, жив ли сервер)
app.get('/', (req, res) => {
  res.send('Backend is running! 🚀');
});

// --- АУТЕНТИФИКАЦИЯ ---

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: 'Email уже занят' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Юзер не найден' });
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Неверный пароль' });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- ЗАДАЧИ ---

app.get('/tasks', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
});

app.post('/tasks', authMiddleware, async (req, res) => {
  const { title, description, priority, status } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (user_id, title, description, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [req.user.id, title, description, priority, status]
  );
  res.json(result.rows[0]);
});

app.delete('/tasks/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// 3. ЗАПУСК (0.0.0.0 обязателен для Railway!)
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

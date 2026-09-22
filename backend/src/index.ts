import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

import { initDb } from './db/database';
import { seedDatabase } from './db/seed';

import memoriesRouter from './routes/memories';
import searchRouter from './routes/search';
import remindersRouter from './routes/reminders';
import demoRouter from './routes/demo';
import insightsRouter from './routes/insights';
import { errorHandler } from './middleware/error-handler';

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .flatMap((origin) => origin.startsWith('http') ? [origin] : [`https://${origin}`, `http://${origin}`]);

// Middlewares
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'recall-backend' });
});

// Routes
app.use('/api/memories', memoriesRouter);
app.use('/api/search', searchRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/demo', demoRouter);
app.use('/api/insights', insightsRouter);

// Global Error Handler
app.use(errorHandler);

// Ensure uploads dir exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Init
initDb();
if (process.env.DEMO_MODE === 'true') {
  try {
    seedDatabase();
  } catch (e) {
    console.error('Seed error:', e);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

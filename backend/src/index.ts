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
const corsOriginEnv = process.env.CORS_ORIGIN?.trim();
const corsOptions: cors.CorsOptions = {
  origin: (!corsOriginEnv || corsOriginEnv === '*')
    ? true
    : corsOriginEnv
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .flatMap((origin) => origin.startsWith('http') ? [origin] : [`https://${origin}`, `http://${origin}`]),
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
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

// Serve frontend static build if present
const frontendDist = path.resolve(process.cwd(), '../frontend/dist');
const altFrontendDist = path.resolve(process.cwd(), 'frontend/dist');
const distPath = fs.existsSync(frontendDist)
  ? frontendDist
  : (fs.existsSync(altFrontendDist) ? altFrontendDist : null);

if (distPath) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

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

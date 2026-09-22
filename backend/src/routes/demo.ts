import { Router } from 'express';
import { seedDatabase, clearDatabase } from '../db/seed';
import { db } from '../db/database';

const router = Router();

router.post('/init', (req, res) => {
  seedDatabase();
  res.json({ success: true, message: 'Demo data seeded' });
});

router.post('/reset', (req, res) => {
  clearDatabase();
  seedDatabase();
  res.json({ success: true, message: 'Database reset and re-seeded' });
});

router.get('/status', (req, res) => {
  const isDemo = process.env.DEMO_MODE === 'true';
  const count = db.prepare('SELECT COUNT(*) as count FROM memories').get() as { count: number };
  res.json({ isDemo, memoryCount: count.count });
});

export default router;

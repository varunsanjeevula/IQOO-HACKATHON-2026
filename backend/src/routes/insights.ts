import { Router } from 'express';
import { db } from '../db/database';

const router = Router();

router.get('/', (req, res) => {
  const totalMemories = (db.prepare('SELECT COUNT(*) as c FROM memories').get() as any).c;
  
  const categories = db.prepare('SELECT category, COUNT(*) as count FROM memories GROUP BY category').all();
  
  const recentlyAdded = db.prepare('SELECT * FROM memories ORDER BY created_at DESC LIMIT 5').all();
  
  const upcomingReminders = db.prepare("SELECT * FROM reminders WHERE status = 'pending' ORDER BY reminder_date ASC LIMIT 5").all();
  
  res.json({
    totalMemories,
    categoryCounts: categories,
    recentlyAdded,
    upcomingReminders
  });
});

export default router;

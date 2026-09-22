import { Router } from 'express';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM reminders WHERE 1=1';
  const params: any[] = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY reminder_date ASC';
  
  const reminders = db.prepare(query).all(...params) as any[];
  reminders.forEach((reminder) => {
    if (reminder.memory_id) {
      reminder.memory = db.prepare('SELECT * FROM memories WHERE id = ?').get(reminder.memory_id);
    }
  });
  res.json(reminders);
});

router.post('/', (req, res) => {
  const { memory_id, title, description, reminder_date } = req.body;
  if (!title || !reminder_date) return res.status(400).json({ error: 'Title and reminder_date required' });
  
  const id = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO reminders (id, user_id, memory_id, title, description, reminder_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, 'demo-user', memory_id || null, title, description || null, reminder_date, now);
  
  res.status(201).json({ id });
});

router.patch('/:id', (req, res) => {
  const { status, reminder_date } = req.body;
  const updates: string[] = [];
  const params: any[] = [];
  
  if (status) { updates.push('status = ?'); params.push(status); }
  if (reminder_date) { updates.push('reminder_date = ?'); params.push(reminder_date); }
  
  if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });
  
  params.push(req.params.id);
  const info = db.prepare(`UPDATE reminders SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  
  if (info.changes === 0) return res.status(404).json({ error: 'Reminder not found' });
  res.json({ success: true });
});

router.post('/:id/complete', (req, res) => {
  const info = db.prepare("UPDATE reminders SET status = 'completed' WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Reminder not found' });
  res.json({ success: true });
});

router.post('/:id/dismiss', (req, res) => {
  const info = db.prepare("UPDATE reminders SET status = 'dismissed' WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Reminder not found' });
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM reminders WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Reminder not found' });
  res.json({ success: true });
});

export default router;

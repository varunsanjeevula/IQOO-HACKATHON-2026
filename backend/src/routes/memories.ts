import { Router } from 'express';
import { db } from '../db/database';
import { uploadService } from '../services/upload-service';
import { upload } from '../middleware/upload';

const router = Router();

function safeParseAiAnalysis(item: any) {
  if (!item) return item;
  if (typeof item.ai_analysis === 'string') {
    try {
      item.ai_analysis = JSON.parse(item.ai_analysis);
    } catch {
      // keep as is
    }
  }
  return item;
}

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM memories WHERE 1=1';
  const params: any[] = [];
  
  if (category && category !== 'All' && category !== 'all') {
    query += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }
  
  if (search) {
    query += ' AND (title LIKE ? OR summary LIKE ? OR extracted_text LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const memories = db.prepare(query).all(...params) as any[];
  memories.forEach(m => safeParseAiAnalysis(m));
  res.json(memories);
});

router.get('/:id', (req, res) => {
  const memory = db.prepare('SELECT * FROM memories WHERE id = ?').get(req.params.id) as any;
  if (!memory) return res.status(404).json({ error: 'Memory not found' });
  
  safeParseAiAnalysis(memory);
  const entities = db.prepare('SELECT * FROM entities WHERE memory_id = ?').all(req.params.id);
  
  const relations = db.prepare(`
    SELECT m.*, r.relationship_type, r.confidence
    FROM relationships r
    JOIN memories m ON (m.id = CASE WHEN r.memory_id = ? THEN r.related_memory_id ELSE r.memory_id END)
    WHERE (r.memory_id = ? OR r.related_memory_id = ?) AND m.id != ?
  `).all(req.params.id, req.params.id, req.params.id, req.params.id) as any[];

  relations.forEach(r => safeParseAiAnalysis(r));
  
  res.json({ ...memory, entities, relatedMemories: relations });
});

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await uploadService.processUpload(req.file, 'demo-user');
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM memories WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Memory not found' });
  res.json({ success: true });
});

router.delete('/', (req, res) => {
  db.exec('DELETE FROM relationships; DELETE FROM reminders; DELETE FROM entities; DELETE FROM memories;');
  res.json({ success: true });
});

router.get('/export/json', (req, res) => {
  const memories = db.prepare('SELECT * FROM memories ORDER BY created_at DESC').all();
  const reminders = db.prepare('SELECT * FROM reminders ORDER BY reminder_date ASC').all();
  res.json({ exportedAt: new Date().toISOString(), memories, reminders });
});

router.get('/:id/related', (req, res) => {
  const relations = db.prepare(`
    SELECT m.*, r.relationship_type, r.confidence
    FROM relationships r
    JOIN memories m ON (m.id = CASE WHEN r.memory_id = ? THEN r.related_memory_id ELSE r.memory_id END)
    WHERE (r.memory_id = ? OR r.related_memory_id = ?) AND m.id != ?
  `).all(req.params.id, req.params.id, req.params.id, req.params.id) as any[];

  relations.forEach(r => safeParseAiAnalysis(r));
  res.json(relations);
});

export default router;

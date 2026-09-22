import { Router } from 'express';
import { searchService } from '../services/search-service';
import { aiService } from '../services/ai-service';
import { db } from '../db/database';
import { Memory } from '../types';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    
    const results = await searchService.search(query);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

router.post('/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    
    // Quick semantic search to find context
    const results = await searchService.search(message);
    const relevantMemories = results.map(r => r.memory);
    
    const reminders = db.prepare('SELECT * FROM reminders ORDER BY reminder_date ASC').all();
    const answer = await aiService.answerMemoryQuestion(message, relevantMemories, reminders);
    
    res.json({ response: answer, contextIds: relevantMemories.map(m => m.id) });
  } catch (err) {
    next(err);
  }
});

router.post('/expenses', (req, res, next) => {
  try {
    const category = typeof req.body.category === 'string' ? req.body.category : 'electronics';
    const memories = db.prepare('SELECT * FROM memories').all() as Memory[];
    const matches = memories.filter((memory) => {
      const text = `${memory.title} ${memory.description || ''} ${memory.extracted_text || ''} ${memory.summary || ''}`.toLowerCase();
      return text.includes(category.toLowerCase()) && /(?:₹|rs\.?|inr)\s*[\d,]+|[\d,]+\s*(?:rupees|inr)/i.test(text);
    });
    const amounts = matches.map((memory) => {
      const text = `${memory.extracted_text || ''} ${memory.summary || ''}`;
      const match = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+)|([\d,]+)\s*(?:rupees|inr)/i);
      return { memory, amount: match ? Number((match[1] || match[2]).replace(/,/g, '')) : 0 };
    }).filter((item) => item.amount > 0);
    res.json({ category, total: amounts.reduce((sum, item) => sum + item.amount, 0), items: amounts });
  } catch (err) {
    next(err);
  }
});

export default router;

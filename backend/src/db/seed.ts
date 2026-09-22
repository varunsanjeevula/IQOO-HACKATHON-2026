import { db, initDb } from './database';
import { getDemoData } from '../data/demo-memories';
import { v4 as uuidv4 } from 'uuid';

export function seedDatabase() {
  initDb();

  // Check if already seeded
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM memories');
  const result = countStmt.get() as { count: number };
  
  if (result.count > 0) {
    console.log('Database already has data. Use clear/reset to re-seed.');
    return;
  }

  const { memories, relationships, reminders } = getDemoData();

  const insertMemory = db.prepare(`
    INSERT INTO memories (id, user_id, title, description, category, file_path, thumbnail_path, extracted_text, summary, ai_analysis, embedding, created_at, updated_at, metadata)
    VALUES (@id, @user_id, @title, @description, @category, @file_path, @thumbnail_path, @extracted_text, @summary, @ai_analysis, @embedding, @created_at, @updated_at, @metadata)
  `);

  const insertEntity = db.prepare(`
    INSERT INTO entities (id, memory_id, entity_type, name, value)
    VALUES (@id, @memory_id, @entity_type, @name, @value)
  `);

  const insertRelationship = db.prepare(`
    INSERT INTO relationships (id, memory_id, related_memory_id, relationship_type, confidence)
    VALUES (@id, @memory_id, @related_memory_id, @relationship_type, @confidence)
  `);

  const insertReminder = db.prepare(`
    INSERT INTO reminders (id, user_id, memory_id, title, description, reminder_date, status, created_at)
    VALUES (@id, @user_id, @memory_id, @title, @description, @reminder_date, @status, @created_at)
  `);

  db.transaction(() => {
    for (const mem of memories) {
      insertMemory.run(mem);
      const aiData = JSON.parse(mem.ai_analysis);
      if (aiData.entities) {
        for (const ent of aiData.entities) {
          insertEntity.run({
            id: uuidv4(),
            memory_id: mem.id,
            entity_type: ent.type,
            name: ent.name,
            value: ent.value
          });
        }
      }
    }
    
    for (const rel of relationships) {
      insertRelationship.run(rel);
    }
    
    for (const rem of reminders) {
      insertReminder.run(rem);
    }
  })();

  console.log('Demo data seeded successfully!');
}

export function clearDatabase() {
  initDb();
  db.exec(`
    DELETE FROM relationships;
    DELETE FROM reminders;
    DELETE FROM entities;
    DELETE FROM memories;
  `);
}

// Allow running directly via tsx
if (require.main === module) {
  clearDatabase();
  seedDatabase();
}

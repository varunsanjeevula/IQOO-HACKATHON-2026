import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'recall.db');
export const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      file_path TEXT,
      thumbnail_path TEXT,
      extracted_text TEXT,
      summary TEXT,
      ai_analysis TEXT,
      embedding TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      metadata TEXT
    );

    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      memory_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      memory_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      reminder_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      memory_id TEXT NOT NULL,
      related_memory_id TEXT NOT NULL,
      relationship_type TEXT NOT NULL,
      confidence REAL NOT NULL,
      FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE,
      FOREIGN KEY (related_memory_id) REFERENCES memories (id) ON DELETE CASCADE
    );
  `);
}

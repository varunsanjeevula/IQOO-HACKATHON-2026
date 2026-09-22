import sharp from 'sharp';
import pdfParse from 'pdf-parse';
import { aiService } from './ai-service';
import { db } from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export class UploadService {
  public async processUpload(file: Express.Multer.File, userId: string) {
    const ext = path.extname(file.originalname).toLowerCase();
    let extractedText = '';
    let thumbnailPath = null;

    // Use buffer if available, otherwise read from disk
    const fileBuffer = file.buffer || fs.readFileSync(file.path);

    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
    } else if (file.mimetype.startsWith('image/')) {
      const thumbBuffer = await sharp(fileBuffer)
        .resize(300, 300, { fit: 'inside' })
        .jpeg()
        .toBuffer();
      
      const thumbName = `thumb-${file.filename}.jpg`;
      const thumbFull = path.join(file.destination, thumbName);
      fs.writeFileSync(thumbFull, thumbBuffer);
      thumbnailPath = `/uploads/${thumbName}`;
    }

    const aiAnalysis = await aiService.analyzeDocument(fileBuffer, file.mimetype, extractedText);
    const textToEmbed = `${aiAnalysis.title} ${aiAnalysis.summary} ${aiAnalysis.keywords.join(' ')}`;
    const embedding = await aiService.generateEmbedding(textToEmbed);

    const memId = uuidv4();
    const now = new Date().toISOString();

    const insertMem = db.prepare(`
      INSERT INTO memories (id, user_id, title, category, file_path, thumbnail_path, extracted_text, summary, ai_analysis, embedding, created_at, updated_at)
      VALUES (@id, @user_id, @title, @category, @file_path, @thumbnail_path, @extracted_text, @summary, @ai_analysis, @embedding, @created_at, @updated_at)
    `);

    insertMem.run({
      id: memId,
      user_id: userId,
      title: aiAnalysis.title,
      category: aiAnalysis.category,
      file_path: `/uploads/${file.filename}`,
      thumbnail_path: thumbnailPath,
      extracted_text: aiAnalysis.extracted_text,
      summary: aiAnalysis.summary,
      ai_analysis: JSON.stringify(aiAnalysis),
      embedding: JSON.stringify(embedding),
      created_at: now,
      updated_at: now
    });

    const insertEntity = db.prepare(`
      INSERT INTO entities (id, memory_id, entity_type, name, value)
      VALUES (@id, @memory_id, @entity_type, @name, @value)
    `);
    for (const ent of aiAnalysis.entities) {
      insertEntity.run({ id: uuidv4(), memory_id: memId, entity_type: ent.type, name: ent.name, value: ent.value });
    }

    const insertRem = db.prepare(`
      INSERT INTO reminders (id, user_id, memory_id, title, reminder_date, created_at)
      VALUES (@id, @user_id, @memory_id, @title, @reminder_date, @created_at)
    `);
    for (const d of aiAnalysis.importantDates) {
      insertRem.run({ id: uuidv4(), user_id: userId, memory_id: memId, title: `Follow up for ${aiAnalysis.title}`, reminder_date: d, created_at: now });
    }

    return { memoryId: memId };
  }
}

export const uploadService = new UploadService();

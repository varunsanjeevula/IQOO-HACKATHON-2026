import { GoogleGenerativeAI } from '@google/generative-ai';
import { Memory, AIAnalysis } from '../types';

export class AIService {
  private genAI: GoogleGenerativeAI | null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  }

  public getMockTfIdf(text: string): number[] {
    const arr = new Array(512).fill(0);
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    for (const w of words) {
      if (!w) continue;
      let hash = 0;
      for (let i = 0; i < w.length; i++) hash = ((hash << 5) - hash) + w.charCodeAt(i);
      arr[Math.abs(hash) % 512] += 1;
    }
    const mag = Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0));
    if (mag > 0) {
      for (let i = 0; i < 512; i++) arr[i] /= mag;
    }
    return arr;
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    if (!this.genAI) {
      return this.getMockTfIdf(text);
    }
    try {
      const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (err) {
      console.warn("Embedding API failed, falling back to TF-IDF", err);
      return this.getMockTfIdf(text);
    }
  }

  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public async analyzeDocument(fileBuffer: Buffer, mimeType: string, extractedText?: string): Promise<AIAnalysis> {
    if (!this.genAI) {
      return {
        title: 'Uploaded Document',
        category: 'Uncategorized',
        summary: extractedText?.substring(0, 100) || 'No summary available (Demo Mode)',
        extracted_text: extractedText || '',
        entities: [],
        importantDates: [],
        keywords: ['demo', 'upload']
      };
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Analyze this document. Extract the text, and provide structured information:
- title: A short title
- category: One of Invoice, Receipt, Travel, Medical, Bill, Certificate, Warranty, Screenshot, Document
- summary: 1-2 sentences
- extracted_text: The main text content
- entities: Array of objects with type (product, amount, location, phone, company, etc), name, value
- importantDates: Array of ISO date strings if any future deadlines/dates exist
- keywords: Array of 5-8 relevant tags

Respond ONLY with valid JSON.`;

    try {
      let result;
      if (mimeType.startsWith('image/')) {
        result = await model.generateContent([
          prompt,
          { inlineData: { data: fileBuffer.toString("base64"), mimeType } }
        ]);
      } else {
        result = await model.generateContent(prompt + "\n\nDocument Text:\n" + (extractedText || ''));
      }
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(text);
    } catch (err) {
      console.error('Gemini analysis failed', err);
      throw new Error('Failed to analyze document');
    }
  }

  public async semanticSearch(query: string, memories: Memory[]) {
    const queryEmbedding = await this.generateEmbedding(query);
    const results = memories.map(mem => {
      if (!mem.embedding) return { memory: mem, score: 0 };
      const memEmbedding = JSON.parse(mem.embedding) as number[];
      const score = this.cosineSimilarity(queryEmbedding, memEmbedding);
      return { memory: mem, score };
    });
    return results.sort((a, b) => b.score - a.score);
  }

  public async answerMemoryQuestion(question: string, relevantMemories: Memory[], reminders: any[] = []): Promise<string> {
    if (!this.genAI) {
      const normalizedQuestion = question.toLowerCase();
      if (normalizedQuestion.includes('spend') || normalizedQuestion.includes('spent') || normalizedQuestion.includes('cost')) {
        const total = relevantMemories.reduce((sum, memory) => {
          const analysis = typeof memory.ai_analysis === 'string' ? JSON.parse(memory.ai_analysis || '{}') : memory.ai_analysis;
          const amountEntity = analysis?.entities?.find((entity: any) => entity.type === 'amount');
          const amount = String(amountEntity?.value || '').replace(/[^0-9.]/g, '');
          return sum + (Number(amount) || 0);
        }, 0);
        return `I found ${relevantMemories.length} matching purchase memories. The estimated total is ₹${total.toLocaleString('en-IN')}.`;
      }
      if (normalizedQuestion.includes('due') || normalizedQuestion.includes('reminder')) {
        const upcoming = reminders.filter((reminder) => reminder.status === 'pending').slice(0, 5);
        if (!upcoming.length) return 'There are no pending reminders in your memory vault.';
        return `You have ${upcoming.length} pending reminder${upcoming.length === 1 ? '' : 's'}: ${upcoming.map((reminder) => `${reminder.title} on ${new Date(reminder.reminder_date).toLocaleDateString('en-IN')}`).join('; ')}.`;
      }
      const bestMatches = relevantMemories.slice(0, 3).map((memory) => `${memory.title}: ${memory.summary || memory.description || 'No summary available'}`);
      return bestMatches.length ? `I found these memories: ${bestMatches.join(' | ')}` : 'I could not find a matching memory in your vault.';
    }
    const context = relevantMemories.map(m => `Title: ${m.title}\nSummary: ${m.summary}\nExtracted: ${m.extracted_text}`).join('\n\n');
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are an AI memory assistant. Answer the user's question based ONLY on their memories.\n\nMemories:\n${context}\n\nQuestion: ${question}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

export const aiService = new AIService();

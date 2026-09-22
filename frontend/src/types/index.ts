export interface Memory {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: MemoryCategory;
  file_path: string;
  thumbnail_path: string;
  extracted_text: string;
  summary: string;
  ai_analysis: AIAnalysis | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export type MemoryCategory = 'receipt' | 'invoice' | 'warranty' | 'bill' | 'travel' | 'ticket' | 'certificate' | 'medical' | 'education' | 'personal' | 'screenshot' | 'insurance' | 'other';

export interface AIAnalysis {
  title: string;
  category: string;
  summary: string;
  entities: EntityInfo[];
  importantDates: ImportantDate[];
  keywords: string[];
  warrantyInfo?: { expiryDate: string; details: string };
}

export interface EntityInfo {
  type: string;
  name: string;
  value: string;
}

export interface ImportantDate {
  date: string;
  description: string;
  type: string;
}

export interface Entity {
  id: string;
  memory_id: string;
  entity_type: string;
  name: string;
  value: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  memory_id: string;
  title: string;
  description: string;
  reminder_date: string;
  status: 'pending' | 'completed' | 'dismissed';
  created_at: string;
  memory?: Memory;
}

export interface Relationship {
  id: string;
  memory_id: string;
  related_memory_id: string;
  relationship_type: string;
  confidence: number;
  relatedMemory?: Memory;
}

export interface SearchResult {
  memory: Memory;
  score: number;
  matchReasons: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  memories?: Memory[];
  timestamp: string;
}

export interface Insights {
  totalMemories: number;
  categoryCounts: Record<string, number>;
  recentlyAdded: Memory[];
  upcomingExpiries: Reminder[];
  upcomingReminders: Reminder[];
}

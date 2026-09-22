export interface Memory {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string | null;
  thumbnail_path: string | null;
  extracted_text: string | null;
  summary: string | null;
  ai_analysis: any; // JSON object
  embedding: string | null; // Serialized float array
  created_at: string;
  updated_at: string;
  metadata: any | null; // JSON object
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
  memory_id: string | null;
  title: string;
  description: string | null;
  reminder_date: string;
  status: 'pending' | 'completed' | 'dismissed';
  created_at: string;
}

export interface Relationship {
  id: string;
  memory_id: string;
  related_memory_id: string;
  relationship_type: string;
  confidence: number;
}

export interface SearchResult {
  memory: Memory;
  score: number;
  matchReasons: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AIAnalysis {
  title: string;
  category: string;
  summary: string;
  extracted_text: string;
  entities: {
    type: string;
    name: string;
    value: string;
  }[];
  importantDates: string[];
  keywords: string[];
  warrantyInfo?: string;
}

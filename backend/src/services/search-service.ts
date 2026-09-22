import { db } from '../db/database';
import { Memory, SearchResult } from '../types';
import { aiService } from './ai-service';

export class SearchService {
  public async search(query: string): Promise<SearchResult[]> {
    const memories = db.prepare('SELECT * FROM memories').all() as Memory[];
    
    // Perform semantic search
    const semanticResults = await aiService.semanticSearch(query, memories);
    
    // Keyword match basics
    const qLower = query.toLowerCase();
    const tokens = qLower.split(/\s+/);
    
    const finalResults: SearchResult[] = semanticResults.map(res => {
      const mem = res.memory;
      let finalScore = res.score;
      const matchReasons: string[] = [];
      
      const searchStr = `${mem.title} ${mem.description} ${mem.category} ${mem.extracted_text} ${mem.summary}`.toLowerCase();
      
      // Bump score for direct keyword matches
      let matchedTokens = 0;
      for (const t of tokens) {
        if (t.length > 2 && searchStr.includes(t)) {
          matchedTokens++;
          finalScore += 0.1;
        }
      }

      if (matchedTokens > 0) {
        matchReasons.push(`Contains keywords related to your search`);
      }
      
      // TF-IDF semantic match
      if (res.score > 0.15) {
        matchReasons.push(`Conceptually related to "${query}"`);
      }

      if (mem.category.toLowerCase().includes(qLower)) {
        matchReasons.push(`Category match: ${mem.category}`);
        finalScore += 0.2;
      }

      return {
        memory: mem,
        score: finalScore,
        matchReasons
      };
    });

    return finalResults
      .filter(r => r.score > 0.05) // Threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
}

export const searchService = new SearchService();

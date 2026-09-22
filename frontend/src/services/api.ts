import { Memory, Reminder, SearchResult, ChatMessage, Insights } from '../types';
import { demoMemories, demoReminders, demoInsights } from '../data/demo-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private baseUrl = `${this.getApiOrigin()}/api`;

  private getApiOrigin() {
    const configuredUrl = import.meta.env.VITE_API_URL?.trim();
    if (!configuredUrl || configuredUrl === 'recall-api' || configuredUrl === 'http://recall-api') {
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return window.location.origin;
      }
      return 'http://localhost:3001';
    }
    return configuredUrl.startsWith('http') ? configuredUrl.replace(/\/$/, '') : `https://${configuredUrl}`;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`API call failed for ${endpoint}, falling back to demo data:`, error);
      return this.getMockData(endpoint) as unknown as Promise<T>;
    }
  }

  private async getMockData(endpoint: string): Promise<any> {
    await delay(300); // Fast response for smooth UI

    if (endpoint.includes('search')) {
      return {
        results: demoMemories.map(m => ({
          memory: m,
          score: 0.95,
          matchReasons: ['Contains relevant keywords', 'Category match']
        }))
      };
    }

    if (endpoint.includes('/memories')) {
      const parts = endpoint.split('/');
      const id = parts[parts.length - 1];
      if (id && id !== 'memories') {
        const memory = demoMemories.find(m => m.id === id);
        return memory || demoMemories[0];
      }
      return demoMemories;
    }

    if (endpoint.includes('/reminders')) {
      return demoReminders;
    }

    if (endpoint.includes('/insights')) {
      return demoInsights;
    }

    return {};
  }

  async getMemories(): Promise<Memory[]> {
    return this.fetch<Memory[]>('/memories');
  }

  async getMemory(id: string): Promise<Memory> {
    return this.fetch<Memory>(`/memories/${id}`);
  }

  async searchMemories(query: string): Promise<{ results: SearchResult[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return { results: data };
        }
        return data;
      }
    } catch {
      console.warn('Search backend failed, falling back to demo search');
    }
    return this.getMockData(`/search?q=${encodeURIComponent(query)}`);
  }

  async getReminders(): Promise<Reminder[]> {
    return this.fetch<Reminder[]>('/reminders');
  }

  async getInsights(): Promise<Insights> {
    try {
      const res = await fetch(`${this.baseUrl}/insights`);
      if (res.ok) {
        const data = await res.json();
        // Normalize categoryCounts to Record<string, number>
        const categoryMap: Record<string, number> = {};
        if (Array.isArray(data.categoryCounts)) {
          data.categoryCounts.forEach((c: { category: string; count: number }) => {
            categoryMap[c.category.toLowerCase()] = c.count;
          });
        } else if (typeof data.categoryCounts === 'object' && data.categoryCounts) {
          Object.assign(categoryMap, data.categoryCounts);
        }

        return {
          totalMemories: data.totalMemories || 15,
          categoryCounts: categoryMap,
          recentlyAdded: data.recentlyAdded || demoMemories,
          upcomingExpiries: (data.upcomingReminders || []).filter((r: Reminder) =>
            r.title.toLowerCase().includes('warranty') || r.title.toLowerCase().includes('expiry')
          ),
          upcomingReminders: data.upcomingReminders || demoReminders,
        };
      }
    } catch {
      console.warn('Insights backend call failed, using demo fallback');
    }
    return demoInsights;
  }

  async uploadMemory(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${this.baseUrl}/memories/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return { id: data.memoryId || data.id || 'm1', ...data };
      }
    } catch {
      console.warn('Upload backend failed, falling back to demo simulation');
    }
    await delay(1200);
    return demoMemories[0];
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      const res = await fetch(`${this.baseUrl}/search/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      console.warn('Chat backend failed, falling back to mock response');
    }
    await delay(500);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I found several relevant memories in your private vault regarding your query.",
      timestamp: new Date().toISOString(),
      memories: [demoMemories[0]],
    };
  }

  async getRelatedMemories(id: string): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseUrl}/memories/${id}/related`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      console.warn('Failed to fetch related memories');
    }
    return [];
  }

  async deleteMemory(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/memories/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async createReminder(reminder: { memory_id?: string; title: string; description?: string; reminder_date: string }): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      });
      if (res.ok) return await res.json();
    } catch {
      console.warn('Create reminder failed');
    }
    return { success: true };
  }

  async updateReminder(id: string, status: 'completed' | 'dismissed'): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  }

  async deleteReminder(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/reminders/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  async exportMemories(): Promise<void> {
    const res = await fetch(`${this.baseUrl}/memories/export/json`);
    if (!res.ok) throw new Error('Export failed');
    const blob = new Blob([JSON.stringify(await res.json(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recall-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async deleteAllMemories(): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/memories`, { method: 'DELETE' });
    return res.ok;
  }
}

export const api = new ApiService();

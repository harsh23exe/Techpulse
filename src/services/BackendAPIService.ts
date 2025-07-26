// Backend API service for Real-Time-News-Agent integration
export interface NewsArticle {
  title: string;
  url: string;
  summary: string;
  published_at: string;
}

export interface NewsSearchResponse {
  results: NewsArticle[];
}

export interface NewsSearchRequest {
  query: string;
  limit?: number;
}

export interface HeadlinesRequest {
  country?: string;
  category?: string;
  limit?: number;
}

export interface ChatMessage {
  type: 'user_message' | 'bot_response' | 'error';
  content?: string;
  message?: string;
  selected_news_article?: NewsArticle | null;
}

class BackendAPIService {
  private baseUrl: string;
  private wsUrl: string;
  private jwtToken: string | null;

  constructor() {
    // Use the Next.js proxy route instead of direct backend URL
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend';
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    this.jwtToken = process.env.NEXT_PUBLIC_JWT_TOKEN || null;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.jwtToken) {
      headers['Authorization'] = `Bearer ${this.jwtToken}`;
    }
    
    return headers;
  }

  async searchNews(query: string, limit: number = 10): Promise<NewsSearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/news/search`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query, limit }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching news:', error);
      
      // Check if it's a network error (backend not available)
      if (error instanceof TypeError && error.message.includes('Load failed')) {
        throw new Error('Backend server is not available. Please ensure your backend is running on port 8000.');
      }
      
      throw error;
    }
  }

  async getHeadlines(params: HeadlinesRequest = {}): Promise<NewsSearchResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.country) searchParams.append('country', params.country);
      if (params.category) searchParams.append('category', params.category);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      
      const url = `${this.baseUrl}/api/v1/news/headlines${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching headlines:', error);
      
      // Check if it's a network error (backend not available)
      if (error instanceof TypeError && error.message.includes('Load failed')) {
        throw new Error('Backend server is not available. Please ensure your backend is running on port 8000.');
      }
      
      throw error;
    }
  }

  createChatWebSocket(): WebSocket | null {
    try {
      const wsUrl = this.jwtToken 
        ? `${this.wsUrl}/ws/chat?token=${this.jwtToken}`
        : `${this.wsUrl}/ws/chat`;
      
      return new WebSocket(wsUrl);
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      return null;
    }
  }

  // Helper method to check if backend is available
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

export const backendAPI = new BackendAPIService();

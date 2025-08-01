// Backend API service for Real-Time-News-Agent integration
export interface NewsArticle {
  id: string;
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
  selected_news_article?: NewsArticle | string | null;
}

export interface ChatRequest {
  type: 'user_message';
  content: string;
  chat_history?: string[];
  selected_news_article?: string | null;
}

export interface ChatResponse {
  type: 'bot_response';
  content: string;
}

export interface ArticleMetadata {
  author?: string;
  content_type?: string;
  description?: string;
  image_url?: string;
  processed_at?: string;
  published_at?: string;
  source_name?: string;
  source_type?: string;
  text?: string;
  text_length?: number;
  title?: string;
  url?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ArticleRecord {
  id: string;
  metadata: ArticleMetadata;
}

export interface FetchArticleResponse {
  success: boolean;
  records: Record<string, ArticleRecord>;
  namespace: string;
  usage: {
    read_units: number;
  };
  total_fetched: number;
  error: string | null;
}

class BackendAPIService {
  private baseUrl: string;
  private jwtToken: string | null;

  constructor() {
    // Use the Next.js proxy route instead of direct backend URL
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend';
    
    this.jwtToken = process.env.NEXT_PUBLIC_JWT_TOKEN || null;
    
    // Validate JWT token
    if (this.jwtToken === 'null' || this.jwtToken === 'undefined' || this.jwtToken === '') {
      this.jwtToken = null;
    }
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

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    return await response.json();
  }

  private handleNetworkError(error: unknown): never {
    console.error('API request failed:', error);
    
    if (error instanceof TypeError && error.message.includes('Load failed')) {
      throw new Error('Backend server is not available. Please ensure your backend is running on port 8000.');
    }
    
    throw error;
  }

  async searchNews(query: string, limit: number = 15): Promise<NewsSearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/news/search`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query, limit }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleNetworkError(error);
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

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  async sendChatMessage(
    content: string, 
    chatHistory: string[] = [], 
    selectedNewsArticle?: NewsArticle | null
  ): Promise<ChatResponse> {
    try {
      const requestBody: ChatRequest = {
        type: 'user_message',
        content,
        chat_history: chatHistory,
        selected_news_article: selectedNewsArticle ? JSON.stringify(selectedNewsArticle) : null
      };

      const response = await fetch(`${this.baseUrl}/api/v1/chat`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Chat API request failed:', error);
      return this.handleNetworkError(error);
    }
  }

  async fetchArticle(id: string): Promise<NewsArticle> {
    return this.fetchArticles([id]).then(response => {
      // Check if response indicates failure
      if (response.success === false) {
        throw new Error(response.error || 'API request failed');
      }
      
      // Check if records exist
      if (!response.records || typeof response.records !== 'object') {
        throw new Error('Invalid response format: missing records');
      }
      
      // Try exact ID match first
      let record = response.records[id];
      
      // If exact match fails, try to find by partial match or alternative formats
      if (!record) {
        const recordKeys = Object.keys(response.records);
        
        // Try to find a record that contains the ID
        const matchingKey = recordKeys.find(key => 
          key.includes(id) || id.includes(key) || key.toLowerCase() === id.toLowerCase()
        );
        
        if (matchingKey) {
          record = response.records[matchingKey];
        }
      }
      
      if (!record) {
        const availableIds = Object.keys(response.records);
        const errorMessage = availableIds.length > 0 
          ? `Article not found. Available IDs: ${availableIds.join(', ')}`
          : 'Article not found. No articles returned from API.';
        
        throw new Error(errorMessage);
      }
      
      // Validate record structure
      if (!record.metadata) {
        throw new Error('Invalid article format: missing metadata');
      }
      
      return {
        id: record.id,
        title: String(record.metadata.title || 'Untitled'),
        url: String(record.metadata.url || ''),
        summary: String(record.metadata.description || record.metadata.text || 'No summary available'),
        published_at: String(record.metadata.published_at || new Date().toISOString()),
      };
    });
  }

  async fetchArticles(ids: string[]): Promise<FetchArticleResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/news/fetch`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ ids }),
      });

      const data = await this.handleResponse(response);
      return data;
    } catch (error) {
      console.error('fetchArticles error:', error);
      return this.handleNetworkError(error);
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

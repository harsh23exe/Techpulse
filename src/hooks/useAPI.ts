import { useState, useEffect, useCallback } from 'react';
import { backendAPI, NewsArticle } from '@/services/BackendAPIService';

interface UseAPIState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseHeadlinesParams {
  country?: string;
  category?: string;
  limit?: number;
}

export function useHeadlines(params: UseHeadlinesParams = {}) {
  const [state, setState] = useState<UseAPIState<NewsArticle[]>>({
    data: null,
    isLoading: true,
    error: null
  });

  const fetchHeadlines = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await backendAPI.getHeadlines({
        country: params.country || 'us',
        category: params.category || 'technology',
        limit: params.limit || 6
      });
      setState({ data: response.results, isLoading: false, error: null });
    } catch {
      setState({ 
        data: null, 
        isLoading: false, 
        error: 'Failed to fetch headlines. Please try again later.' 
      });
    }
  }, [params.country, params.category, params.limit]);

  useEffect(() => {
    fetchHeadlines();
  }, [fetchHeadlines]);

  return { ...state, refetch: fetchHeadlines };
}

export function useNewsSearch() {
  const [state, setState] = useState<UseAPIState<NewsArticle[]>>({
    data: null,
    isLoading: false,
    error: null
  });

  const searchNews = useCallback(async (query: string, limit = 15) => {
    if (!query.trim()) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await backendAPI.searchNews(query, limit);
      setState({ data: response.results, isLoading: false, error: null });
    } catch {
      setState({ 
        data: null, 
        isLoading: false, 
        error: 'Failed to search news. Please try again.' 
      });
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, searchNews, clearResults };
}

export function useArticleFetch() {
  const [state, setState] = useState<UseAPIState<NewsArticle>>({
    data: null,
    isLoading: false,
    error: null
  });

  const fetchArticle = useCallback(async (id: string) => {
    if (!id) return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const article = await backendAPI.fetchArticle(id);
      setState({ data: article, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch article. Please try again.';
      setState({ 
        data: null, 
        isLoading: false, 
        error: errorMessage 
      });
    }
  }, []);

  return { ...state, fetchArticle };
} 
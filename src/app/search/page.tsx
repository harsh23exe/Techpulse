'use client';

import { useState } from 'react';
import { useNewsSearch } from '@/hooks/useAPI';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: articles, isLoading, error, searchNews } = useNewsSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchNews(query, 10);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Real-Time News Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Search for the latest tech news and get AI-powered summaries
          </p>

          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for tech news (e.g., 'AI developments', 'startup funding')"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <Button 
              type="submit" 
              disabled={!query.trim()}
              isLoading={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>

          {error && <ErrorMessage message={error} className="mb-6" />}
        </div>

        {isLoading && <LoadingSpinner />}

        {articles && articles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Card 
                key={index} 
                data={{
                  type: 'news',
                  id: article.id,
                  title: article.title,
                  summary: article.summary,
                  url: article.url,
                  published_at: article.published_at
                }} 
              />
            ))}
          </div>
        )}

        {!isLoading && articles && articles.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No articles found for &quot;{query}&quot;. Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

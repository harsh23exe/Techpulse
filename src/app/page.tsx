'use client';

import { useState, useEffect } from 'react';
import { backendAPI, NewsArticle } from '@/services/BackendAPIService';
import NewsCard from "@/components/NewsCard";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await backendAPI.getHeadlines({
          country: 'us',
          category: 'technology',
          limit: 6
        });
        setArticles(response.results);
      } catch (err) {
        setError('Failed to fetch headlines. Please try again later.');
        console.error('Error fetching headlines:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeadlines();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          TechPulse AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
          Stay ahead with real-time tech news, AI-powered insights, and interactive chat
        </p>
        
        {/* New Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Link href="/search" className="group">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-Time News Search</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Search the latest tech news with AI-powered summaries and real-time updates
              </p>
            </div>
          </Link>
          
          <Link href="/chat" className="group">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Chat Assistant</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Chat with our AI assistant for instant answers about current tech developments
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Latest Tech Headlines
        </h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
            
            {articles.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No headlines available at the moment.
                </p>
              </div>
            )}
          </>
        )}
        
        <div className="text-center mt-8">
          <Link 
            href="/search"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search More News
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <NewsletterForm />
      </section>
    </div>
  );
}

'use client';

import { useHeadlines } from '@/hooks/useAPI';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Icon from '@/components/ui/Icon';
import NewsletterForm from '@/components/NewsletterForm';
import Link from 'next/link';

export default function Home() {
  const { data: articles, isLoading, error } = useHeadlines({
    country: 'us',
    category: 'technology',
    limit: 6
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          TechPulse AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8">
          Stay ahead with real-time tech news, AI-powered insights, and interactive chat
        </p>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Link href="/search" className="group">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <Icon name="search" className="text-blue-600 dark:text-blue-400 mr-2" />
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
                <Icon name="chat" className="text-green-600 dark:text-green-400 mr-2" />
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
        
        {error && <ErrorMessage message={error} className="mb-6" />}
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles?.map((article, index) => (
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
            
            {articles?.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No headlines available at the moment.
                </p>
              </div>
            )}
          </>
        )}
        
        <div className="text-center mt-8">
          <Link href="/search">
            <Button>
              Search More News
              <Icon name="arrow" className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <NewsletterForm />
      </section>
    </div>
  );
}

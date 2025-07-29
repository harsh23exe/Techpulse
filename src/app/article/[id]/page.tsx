'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useArticleFetch } from '@/hooks/useAPI';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const { data: article, isLoading, error, fetchArticle } = useArticleFetch();

  useEffect(() => {
    if (params.id) {
      // URL decode the ID to handle encoded characters like %3A (colon)
      const decodedId = decodeURIComponent(params.id as string);
      fetchArticle(decodedId);
    }
  }, [params.id, fetchArticle]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error || 'The article you\'re looking for could not be found.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 12H5m0 0l7 7m-7-7l7-7"
            />
          </svg>
          Back to News
        </Link>
      </div>

      {/* Article content */}
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Article header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <time className="mr-4">
                Published on {format(new Date(article.published_at), 'MMMM dd, yyyy')}
              </time>
              <span className="mr-4">•</span>
              <span>Tech News</span>
            </div>
          </header>

          {/* Article summary/content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Original source link */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Read Full Article
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This is a summary of the original article. Click below to read the full article from the original source.
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Read Original Article
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </article>

      {/* Additional actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/search"
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Search More Articles
        </Link>
        <Link
          href="/chat"
          onClick={() => {
            // Store article context in localStorage
            localStorage.setItem('chatArticleContext', JSON.stringify({
              id: article.id,
              title: article.title,
              summary: article.summary,
              url: article.url,
              published_at: article.published_at
            }));
          }}
          className="inline-flex items-center justify-center px-6 py-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
        >
          Ask AI About This Topic
        </Link>
      </div>
    </div>
  );
}

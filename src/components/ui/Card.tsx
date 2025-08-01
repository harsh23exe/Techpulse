import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ReactNode } from 'react';

interface BaseCardProps {
  className?: string;
  children?: ReactNode;
}

interface NewsCardData {
  type: 'news';
  id?: string;
  title: string;
  summary: string;
  url: string;
  published_at: string;
}

interface BlogCardData {
  type: 'blog';
  title: string;
  excerpt: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readingTime: string;
  coverImage: string;
}

interface CardProps extends BaseCardProps {
  data: NewsCardData | BlogCardData;
}

function NewsCardContent({ data }: { data: NewsCardData }) {
  // Use the article ID if available, otherwise fall back to encoded URL for backward compatibility
  const articleId = data.id || encodeURIComponent(data.url);
  
  // Helper function to safely format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Date unavailable';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.warn('Invalid date format:', dateString, error);
      return 'Date unavailable';
    }
  };
  
  return (
    <Link href={`/article/${articleId}`} className="flex flex-col h-full">
      <div className="p-6 flex flex-col gap-4 h-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {data.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {data.summary}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(data.published_at)}
          </time>
          
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Read More
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogCardContent({ data }: { data: BlogCardData }) {
  return (
    <>
      <div className="relative h-48 w-full">
        <Image
          src={data.coverImage}
          alt={data.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={data.author.avatar}
            alt={data.author.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{data.author.name}</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">{data.readingTime}</span>
        </div>
        <Link href={`/blog/${data.slug}`} className="group">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {data.title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
            {data.excerpt}
          </p>
        </Link>
        <div className="flex items-center mt-2">
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {(() => {
              try {
                const date = new Date(data.date);
                if (isNaN(date.getTime())) {
                  return 'Date unavailable';
                }
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long", 
                  day: "numeric",
                });
              } catch (error) {
                console.warn('Invalid blog date format:', data.date, error);
                return 'Date unavailable';
              }
            })()}
          </time>
        </div>
      </div>
    </>
  );
}

export default function Card({ data, className = '', children }: CardProps) {
  return (
    <article className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02] ${className}`}>
      {data.type === 'news' ? (
        <NewsCardContent data={data} />
      ) : (
        <BlogCardContent data={data} />
      )}
      {children}
    </article>
  );
} 
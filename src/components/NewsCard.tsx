import { NewsArticle } from "@/services/BackendAPIService";
import { format } from "date-fns";

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
          {article.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(article.published_at), 'MMM dd, yyyy')}
          </time>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Read More
            <svg
              className="ml-1 w-4 h-4"
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
  );
}

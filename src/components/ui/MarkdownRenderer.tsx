import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headers - make them smaller for chat context
        h1: ({ ...props }) => (
          <h1 className="text-lg font-bold mb-2 text-gray-900 dark:text-white" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-base font-bold mb-2 text-gray-900 dark:text-white" {...props} />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-sm font-bold mb-1 text-gray-900 dark:text-white" {...props} />
        ),
        
        // Paragraphs
        p: ({ ...props }) => (
          <p className="mb-1.5 text-sm leading-relaxed" {...props} />
        ),
        
        // Lists
        ul: ({ ...props }) => (
          <ul className="list-disc pl-4 mb-2 space-y-0.5" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal pl-4 mb-2 space-y-0.5" {...props} />
        ),
        li: ({ ...props }) => (
          <li className="text-sm leading-tight" {...props} />
        ),
        
        // Links
        a: ({ ...props }) => (
          <a 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" 
            target="_blank"
            rel="noopener noreferrer"
            {...props} 
          />
        ),
        
        // Code blocks
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 overflow-x-auto mb-2">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 text-sm" {...props}>
              {children}
            </code>
          );
        },
        
        // Blockquotes
        blockquote: ({ ...props }) => (
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic my-2 text-sm" {...props} />
        ),
        
        // Strong/bold text
        strong: ({ ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        
        // Emphasis/italic text
        em: ({ ...props }) => (
          <em className="italic" {...props} />
        ),
        
        // Tables
        table: ({ ...props }) => (
          <div className="overflow-x-auto mb-2">
            <table className="min-w-full border border-gray-300 dark:border-gray-600" {...props} />
          </div>
        ),
        thead: ({ ...props }) => (
          <thead className="bg-gray-50 dark:bg-gray-700" {...props} />
        ),
        tbody: ({ ...props }) => (
          <tbody {...props} />
        ),
        tr: ({ ...props }) => (
          <tr className="border-b border-gray-300 dark:border-gray-600" {...props} />
        ),
        th: ({ ...props }) => (
          <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 dark:text-white" {...props} />
        ),
        td: ({ ...props }) => (
          <td className="px-3 py-2 text-xs" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
} 
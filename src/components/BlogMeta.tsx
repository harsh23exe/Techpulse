import Link from 'next/link';

interface Props {
  tags?: string[];
  readingTime: string;
}

export default function BlogMeta({ tags, readingTime }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center text-sm text-gray-600 dark:text-gray-400">
      {tags && tags.length > 0 && (
        <div className="flex gap-2 items-center">
          <span>Tags:</span>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      <span>•</span>
      <span>{readingTime}</span>
    </div>
  );
}

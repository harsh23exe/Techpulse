import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';

interface Props {
  posts: Post[];
  currentPostId: string;
}

export default function RelatedPosts({ posts, currentPostId }: Props) {
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group"
          >
            <div className="relative aspect-video w-full mb-4">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover rounded-lg transition-transform group-hover:scale-105"
              />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

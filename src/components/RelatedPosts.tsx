import { Post } from '@/types';
import Card from './ui/Card';

interface Props {
  posts: Post[];
  currentPostId: string;
}

export default function RelatedPosts({ posts, currentPostId }: Props) {
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card
            key={post.id}
            data={{
              type: 'blog',
              title: post.title,
              excerpt: post.excerpt,
              slug: post.slug,
              author: post.author,
              date: post.date,
              readingTime: post.readingTime,
              coverImage: post.coverImage
            }}
          />
        ))}
      </div>
    </section>
  );
}

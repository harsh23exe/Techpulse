import { posts } from "@/data/posts";
import Card from "@/components/ui/Card";

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          All Articles
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          Explore our complete collection of tech insights, AI developments, and digital innovation stories
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
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
    </div>
  );
}

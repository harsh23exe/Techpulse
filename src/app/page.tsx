import { posts } from "@/data/posts";
import PostCard from "@/components/PostCard";
import NewsletterForm from "@/components/NewsletterForm";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          TechPulse AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
          Stay ahead with the latest insights in technology, AI, and digital innovation
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <NewsletterForm />
      </section>
    </div>
  );
}

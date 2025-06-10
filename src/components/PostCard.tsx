import Link from "next/link";
import { Post } from "@/types";
import Image from "next/image";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 w-full">
        <Image
          src={post.coverImage}
          alt={post.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">{post.readingTime}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="group">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {post.title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
            {post.excerpt}
          </p>
        </Link>
        <div className="flex items-center mt-2">
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </article>
  );
}

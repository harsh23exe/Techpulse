import { posts } from "@/data/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const post = posts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found - TechPulse AI",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} - TechPulse AI`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }: Props) {
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-gray-600 dark:text-gray-400">{post.author.name}</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <time className="text-gray-600 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="text-gray-400 dark:text-gray-500">•</span>
          <span className="text-gray-600 dark:text-gray-400">{post.readingTime}</span>
        </div>
        <div className="relative aspect-video w-full mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </header>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {post.content.split("\n").map((paragraph, index) => {
          if (paragraph.startsWith("# ")) {
            return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
          }
          if (paragraph.startsWith("## ")) {
            return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>;
          }
          if (paragraph.trim() === "") {
            return null;
          }
          return <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">{paragraph}</p>;
        })}
      </div>
    </article>
  );
}

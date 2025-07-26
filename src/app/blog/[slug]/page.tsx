import { posts } from "@/data/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ShareButtons from '@/components/ShareButtons';
import RelatedPosts from '@/components/RelatedPosts';
import TableOfContents from '@/components/TableOfContents';
import BackToTop from '@/components/BackToTop';
import NewsletterForm from '@/components/NewsletterForm';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);
  
  if (!post) {
    return {
      title: "Post Not Found - TechPulse AI",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} - TechPulse AI`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col xl:flex-row gap-8">
        <article className="flex-1 max-w-4xl">
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
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({...props}) => (
                  <h1 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} 
                      className="text-3xl font-bold mt-8 mb-4" 
                      {...props} 
                  />
                ),
                h2: ({...props}) => (
                  <h2 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      className="text-2xl font-bold mt-6 mb-3" 
                      {...props} 
                  />
                ),
                p: ({...props}) => (
                  <p className="mb-4 text-gray-700 dark:text-gray-300" {...props} />
                ),
                a: ({...props}) => (
                  <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" 
                     {...props} 
                  />
                ),
                ul: ({...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                ol: ({...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                blockquote: ({...props}) => (
                  <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4"
                    {...props}
                  />
                ),
                code: ({className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {post.content}
            </ReactMarkdown>

            <ShareButtons 
              url={`https://techpulse.ai/blog/${post.slug}`} 
              title={post.title} 
            />
          </div>

          <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
            <NewsletterForm />
          </div>

          <RelatedPosts posts={posts} currentPostId={post.id} />
        </article>

        <aside className="xl:w-64">
          <TableOfContents content={post.content} />
        </aside>
      </div>

      <BackToTop />
    </div>
  );
}

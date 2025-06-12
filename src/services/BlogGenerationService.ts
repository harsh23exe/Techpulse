import OpenAI from 'openai';
import axios from 'axios';
import { format } from 'date-fns';
import { Post } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export class BlogGenerationService {
  private static async fetchTechNews(): Promise<NewsArticle[]> {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${process.env.NEWS_API_KEY}`
      );
      return response.data.articles;
    } catch (error) {
      console.error('Error fetching tech news:', error);
      return [];
    }
  }

  private static async generateBlogContent(article: NewsArticle): Promise<string> {
    const prompt = `
    Write a detailed blog post based on this technology news:
    Title: ${article.title}
    Description: ${article.description}
    Source URL: ${article.url}

    The blog post should:
    1. Expand on the topic with technical insights
    2. Include analysis of implications for the tech industry
    3. Provide context and background information
    4. Be written in a professional but engaging style
    5. Include section headings using markdown (# for main title, ## for sections)
    6. Be around 800-1000 words
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional technology writer who specializes in creating insightful and well-researched blog posts about the latest developments in technology."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async generatePost(article: NewsArticle): Promise<Post> {
    const content = await this.generateBlogContent(article);
    const slug = this.generateSlug(article.title);

    return {
      id: Math.random().toString(36).substr(2, 9),
      slug,
      title: article.title,
      excerpt: article.description,
      content,
      author: {
        name: "AI Content Team",
        avatar: "/authors/ai-team.jpg" // You'll need to add this image
      },
      date: format(new Date(article.publishedAt), 'yyyy-MM-dd'),
      readingTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
      coverImage: "/blog/ai-generated.jpg" // You'll need to add this image
    };
  }

  static async generatePosts(count: number = 5): Promise<Post[]> {
    const articles = await this.fetchTechNews();
    const posts: Post[] = [];

    for (let i = 0; i < Math.min(count, articles.length); i++) {
      const post = await this.generatePost(articles[i]);
      posts.push(post);
    }

    return posts;
  }
}

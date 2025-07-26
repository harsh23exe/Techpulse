import { Post } from "@/types";

// Minimal posts data to maintain blog functionality
// The homepage now uses real-time news instead of these static posts
export const posts: Post[] = [
  {
    id: "1",
    slug: "welcome-to-techpulse",
    title: "Welcome to TechPulse AI",
    excerpt: "Your new destination for real-time tech news and AI-powered insights.",
    content: `# Welcome to TechPulse AI

TechPulse AI is your premier destination for real-time technology news, AI-powered insights, and interactive chat experiences.

## Features

- **Real-time News Search**: Get the latest tech news with AI-powered summaries
- **Interactive Chat**: Chat with our AI assistant about current tech developments  
- **Live Headlines**: Stay updated with the latest technology headlines

Experience the future of tech news consumption with TechPulse AI.`,
    author: {
      name: "TechPulse Team",
      avatar: "/next.svg"
    },
    date: "2024-07-25",
    readingTime: "2 min read",
    coverImage: "/next.svg"
  }
];

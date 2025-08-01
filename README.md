# TechPulse AI 

A modern Next.js frontend for the TechPulse AI platform, integrated with the Real-Time-News-Agent backend service.
Techpulse is designed to autonomously monitor news APIs, aggregate and index articles, and provide users with instant, summarized, and context-aware responses to their queries about developing events. This empowers users, organizations, and applications to access up-to-date, relevant news insights with minimal latency and maximum accuracy.
## Features

- **Real-Time News Search**: Search the latest tech news with AI-powered summaries
- **AI Chat Interface**: Interactive chat with AI assistant for news queries
- **Blog System**: Display curated tech articles and insights

## Environment Configuration

### Local Development

Create a `.env.local` file in the project root:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Getting Started

Make sure your Real-Time-News-Agent backend is running, then start the development server:

```bash
npm install
npm run dev

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

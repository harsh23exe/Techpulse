# TechPulse AI - Frontend

A modern Next.js frontend for the TechPulse AI platform, integrated with the Real-Time-News-Agent backend service.

## Features

- **Real-Time News Search**: Search the latest tech news with AI-powered summaries
- **AI Chat Interface**: Interactive chat with AI assistant for news queries
- **Blog System**: Display curated tech articles and insights
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Backend Integration**: Seamless integration with FastAPI backend

## Environment Configuration

Create a `.env.local` file in the project root:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# JWT Token for API authentication (set this when you have a token)
NEXT_PUBLIC_JWT_TOKEN=your_jwt_token_here
```

## Backend Integration

This frontend integrates with your Real-Time-News-Agent backend that provides:

- `POST /api/v1/news/search` - News search with AI summaries
- `ws://<host>/ws/chat` - Real-time chat interface
- JWT authentication for secure access

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

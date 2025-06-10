export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readingTime: string;
  coverImage: string;
}

export interface SubscribePayload {
  email: string;
}

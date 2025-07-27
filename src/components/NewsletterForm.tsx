'use client';

import { useState } from 'react';
import Button from './ui/Button';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just set as subscribed
      console.log('Newsletter subscription for:', email);
      setIsSubscribed(true);
      setEmail('');
    } catch {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 Welcome to TechPulse AI!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Thank you for subscribing! You&apos;ll receive the latest tech news and insights directly in your inbox.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Stay Updated with TechPulse AI
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Get the latest tech news, AI insights, and exclusive content delivered to your inbox
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={!email.trim()}
          >
            Subscribe
          </Button>
        </form>
        
        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

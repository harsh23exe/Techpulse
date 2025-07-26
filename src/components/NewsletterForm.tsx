'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // TODO: Integrate with your backend newsletter endpoint
    // Example implementation:
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add JWT token if needed: 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Subscription failed');
      
      setStatus('success');
      setEmail('');
    } catch {
      // Fallback: simulate success for now
      console.log('Newsletter subscription for:', email);
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        Stay Updated with TechPulse AI
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Get the latest tech insights delivered straight to your inbox
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-4 text-center text-green-600 dark:text-green-400">
          Thanks for subscribing!
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-center text-red-600 dark:text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

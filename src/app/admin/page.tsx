import { useState } from 'react';

export default function AdminDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const generatePosts = async () => {
    try {
      setIsGenerating(true);
      setMessage('Generating new blog posts...');

      const response = await fetch('/api/generate-posts', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Successfully generated ${data.count} new blog posts!`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to generate blog posts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Blog Generation</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Generate new blog posts using AI and the latest tech news.
        </p>
        
        <button
          onClick={generatePosts}
          disabled={isGenerating}
          className={`px-4 py-2 rounded-lg ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {isGenerating ? 'Generating...' : 'Generate New Posts'}
        </button>
        
        {message && (
          <p className={`mt-4 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100' 
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
